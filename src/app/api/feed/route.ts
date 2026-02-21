import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';
import { geolocation } from '@vercel/functions';

// Helper to format slug to display name (capitalize first letter, replace hyphens with spaces)
function formatSlugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to transform experience data
function transformExperience(
  exp: any,
  recommendationCounts: Map<string, number>,
  userBookmarks: Map<string, string>,
  tagDisplayNames: Map<string, string>
) {
  const placeName = exp.places?.name || 'Unknown Place';
  const placeCity = exp.places?.city || '';
  const slug = generateExperienceSlug(placeName, placeCity);

  // Use first image from experience as thumbnail
  const images = exp.images || [];
  const thumbnailImageUrl = images.length > 0 ? images[0] : null;

  const placeId = exp.places?.id || exp.place_id;
  const bookmarkId = userBookmarks.get(exp.id);

  // Transform tags from slugs to TagInfo objects
  const tags = (exp.tags || []).map((tagSlug: string) => ({
    slug: tagSlug,
    display_name: tagDisplayNames.get(tagSlug) || formatSlugToDisplayName(tagSlug),
  }));

  return {
    id: exp.id,
    experience_id: exp.id,
    slug,
    user: {
      id: exp.users?.id || exp.user_id,
      display_name: exp.users?.display_name || 'Unknown User',
      avatar_url: exp.users?.avatar_url || null,
    },
    place: {
      id: placeId,
      name: placeName,
      city_short: placeCity,
      country: exp.places?.country || '',
      thumbnail_image_url: thumbnailImageUrl,
      instagram: exp.places?.instagram_handle || null,
      recommendation_count: recommendationCounts.get(placeId) ?? 1,
    },
    price_range: exp.price_range || '$$',
    tags,
    time_ago: formatTimeAgo(exp.created_at),
    description: exp.brief_description,
    visibility: exp.visibility,
    isBookmarked: !!bookmarkId,
    bookmarkId: bookmarkId || undefined,
  };
}

// Helper to get recommendation counts for multiple places in one query
async function getRecommendationCounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  placeIds: string[]
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (placeIds.length === 0) return counts;

  // Get counts for all places in one query using a raw SQL approach
  const { data } = await supabase
    .from('experiences')
    .select('place_id')
    .eq('status', 'active')
    .in('place_id', placeIds);

  // Count occurrences of each place_id
  for (const exp of data || []) {
    const current = counts.get(exp.place_id) || 0;
    counts.set(exp.place_id, current + 1);
  }

  return counts;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get user's location from Vercel geolocation
  const geo = geolocation(request);
  const userCity = geo?.city || null;

  // Get current authenticated user
  const authUser = await getAuthUser(supabase);
  const currentUserId = authUser?.id;

  // Get list of users the current user follows (for visibility filtering)
  let followingIds: string[] = [];
  // Map of experience_id -> bookmark_id for current user
  const userBookmarks = new Map<string, string>();

  if (currentUserId) {
    const { data: following } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUserId);
    followingIds = (following || []).map(f => f.following_id);

    // Fetch user's bookmarks
    const { data: bookmarks } = await supabase
      .from('bookmarks')
      .select('id, experience_id')
      .eq('user_id', currentUserId);

    for (const bookmark of bookmarks || []) {
      userBookmarks.set(bookmark.experience_id, bookmark.id);
    }
  }

  // Fetch my suggestions (if authenticated)
  let myExperiencesData: any[] = [];
  if (currentUserId) {
    const { data: myExperiences } = await supabase
      .from('experiences')
      .select(`
        id,
        price_range,
        tags,
        brief_description,
        images,
        created_at,
        user_id,
        place_id,
        users:user_id (
          id,
          display_name,
          avatar_url
        ),
        places:place_id (
          id,
          name,
          city,
          country,
          instagram_handle
        )
      `)
      .eq('user_id', currentUserId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10);

    myExperiencesData = myExperiences || [];
  }

  // Fetch friends' suggestions (experiences from users the current user follows)
  let friendsExperiencesData: any[] = [];
  if (currentUserId && followingIds.length > 0) {
    const { data: friendsExperiences } = await supabase
      .from('experiences')
      .select(`
        id,
        price_range,
        tags,
        brief_description,
        images,
        created_at,
        user_id,
        place_id,
        visibility,
        users:user_id (
          id,
          display_name,
          avatar_url
        ),
        places:place_id (
          id,
          name,
          city,
          country,
          instagram_handle
        )
      `)
      .in('user_id', followingIds)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(30);

    // Filter based on visibility (friends can see friends_only and public)
    friendsExperiencesData = (friendsExperiences || []).filter((exp: any) => {
      const visibility = exp.visibility || 'public';
      return visibility === 'public' || visibility === 'friends_only';
    });
  }

  // Fetch community suggestions (other users' experiences)
  // We need to filter based on visibility:
  // - public: visible to everyone
  // - friends_only: visible only to followers
  const { data: communityExperiences } = await supabase
    .from('experiences')
    .select(`
      id,
      price_range,
      tags,
      brief_description,
      images,
      created_at,
      user_id,
      place_id,
      visibility,
      users:user_id (
        id,
        display_name,
        avatar_url
      ),
      places:place_id (
        id,
        name,
        city,
        country,
        instagram_handle
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50); // Fetch more to account for filtering

  // Filter experiences based on visibility
  const filteredCommunityExperiences = (communityExperiences || []).filter((exp: any) => {
    // Exclude current user's experiences
    if (currentUserId && exp.user_id === currentUserId) {
      return false;
    }

    const visibility = exp.visibility || 'public';

    // Public experiences are always visible
    if (visibility === 'public') {
      return true;
    }

    // Friends-only experiences are only visible if the current user follows the author
    if (visibility === 'friends_only' && currentUserId) {
      return followingIds.includes(exp.user_id);
    }

    return false;
  }).slice(0, 20); // Limit to 20 after filtering

  // Fetch nearby places (based on user's city)
  let filteredNearbyExperiences: any[] = [];
  if (userCity) {
    const { data: nearbyExperiences } = await supabase
      .from('experiences')
      .select(`
        id,
        price_range,
        tags,
        brief_description,
        images,
        created_at,
        user_id,
        place_id,
        visibility,
        users:user_id (
          id,
          display_name,
          avatar_url
        ),
        places:place_id!inner (
          id,
          name,
          city,
          country,
          instagram_handle
        )
      `)
      .eq('status', 'active')
      .ilike('places.city', `%${userCity}%`)
      .order('created_at', { ascending: false })
      .limit(30); // Fetch more to account for filtering

    // Filter out experiences that are already in my suggestions and apply visibility rules
    const myIds = new Set(myExperiencesData.map((e: any) => e.id));
    filteredNearbyExperiences = (nearbyExperiences || [])
      .filter((exp: any) => {
        if (myIds.has(exp.id)) return false;

        const visibility = exp.visibility || 'public';
        if (visibility === 'public') return true;
        if (visibility === 'friends_only' && currentUserId) {
          return followingIds.includes(exp.user_id);
        }
        return false;
      })
      .slice(0, 10);
  }

  // Collect all unique place IDs from all experiences
  const allExperiences = [...myExperiencesData, ...friendsExperiencesData, ...filteredCommunityExperiences, ...filteredNearbyExperiences];
  const placeIds = [...new Set(allExperiences.map((exp: any) => exp.places?.id || exp.place_id).filter(Boolean))];

  // Fetch recommendation counts for all places in one query
  const recommendationCounts = await getRecommendationCounts(supabase, placeIds);

  // Collect all unique tag slugs from all experiences
  const allTagSlugs = [...new Set(allExperiences.flatMap((exp: any) => exp.tags || []))];

  // Fetch tag display names
  const tagDisplayNames = new Map<string, string>();
  if (allTagSlugs.length > 0) {
    const { data: tagDetails } = await supabase
      .from('tags')
      .select('slug, display_name')
      .in('slug', allTagSlugs);

    (tagDetails || []).forEach((t: any) => {
      if (t.display_name) {
        tagDisplayNames.set(t.slug, t.display_name);
      }
    });
  }

  // Transform experiences with recommendation counts, bookmark data, and tag display names
  const mySuggestions = myExperiencesData.map(exp => transformExperience(exp, recommendationCounts, userBookmarks, tagDisplayNames));
  const friendsSuggestions = friendsExperiencesData.map(exp => transformExperience(exp, recommendationCounts, userBookmarks, tagDisplayNames));
  const communitySuggestions = filteredCommunityExperiences.map(exp => transformExperience(exp, recommendationCounts, userBookmarks, tagDisplayNames));
  const nearbyPlaces = filteredNearbyExperiences.map(exp => transformExperience(exp, recommendationCounts, userBookmarks, tagDisplayNames));

  return NextResponse.json({
    mySuggestions,
    friendsSuggestions,
    communitySuggestions,
    nearbyPlaces,
    userCity,
  });
}
