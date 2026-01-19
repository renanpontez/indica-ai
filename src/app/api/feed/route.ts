import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';
import { geolocation } from '@vercel/functions';

// Helper function to transform experience data
function transformExperience(exp: any, recommendationCounts: Map<string, number>) {
  const placeName = exp.places?.name || 'Unknown Place';
  const placeCity = exp.places?.city || '';
  const slug = generateExperienceSlug(placeName, placeCity);

  // Use first image from experience as thumbnail
  const images = exp.images || [];
  const thumbnailImageUrl = images.length > 0 ? images[0] : null;

  const placeId = exp.places?.id || exp.place_id;

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
    tags: exp.tags || [],
    time_ago: formatTimeAgo(exp.created_at),
    description: exp.brief_description,
    visibility: exp.visibility
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
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const currentUserId = authUser?.id;

  // Get list of users the current user follows (for visibility filtering)
  let followingIds: string[] = [];
  if (currentUserId) {
    const { data: following } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', currentUserId);
    followingIds = (following || []).map(f => f.following_id);
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
      .order('created_at', { ascending: false })
      .limit(10);

    myExperiencesData = myExperiences || [];
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
        places:place_id (
          id,
          name,
          city,
          country,
          instagram_handle
        )
      `)
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
  const allExperiences = [...myExperiencesData, ...filteredCommunityExperiences, ...filteredNearbyExperiences];
  const placeIds = [...new Set(allExperiences.map((exp: any) => exp.places?.id || exp.place_id).filter(Boolean))];

  // Fetch recommendation counts for all places in one query
  const recommendationCounts = await getRecommendationCounts(supabase, placeIds);

  // Transform experiences with recommendation counts
  const mySuggestions = myExperiencesData.map(exp => transformExperience(exp, recommendationCounts));
  const communitySuggestions = filteredCommunityExperiences.map(exp => transformExperience(exp, recommendationCounts));
  const nearbyPlaces = filteredNearbyExperiences.map(exp => transformExperience(exp, recommendationCounts));

  return NextResponse.json({
    mySuggestions,
    communitySuggestions,
    nearbyPlaces,
    userCity,
  });
}
