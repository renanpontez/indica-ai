import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';

// Helper to format slug to display name (capitalize first letter, replace hyphens with spaces)
function formatSlugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper to transform tags from slugs to TagInfo objects
function transformTags(tags: string[], tagDisplayNames: Map<string, string>) {
  return tags.map(tagSlug => ({
    slug: tagSlug,
    display_name: tagDisplayNames.get(tagSlug) || formatSlugToDisplayName(tagSlug),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();

  // Handle "me" - return current authenticated user's profile
  if (userId === 'me') {
    const authUser = await getAuthUser(supabase);

    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Fetch user's experiences
    const { data: experiences, error: expError } = await supabase
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
        places:place_id (
          id,
          name,
          city,
          country,
          instagram_handle
        )
      `)
      .eq('user_id', authUser.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (expError) {
      console.error('Experiences fetch error:', expError);
    }

    // Collect all unique tag slugs and fetch display names
    const allTagSlugs = [...new Set((experiences || []).flatMap((exp: any) => exp.tags || []))];
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

    // Transform experiences to feed item format
    const experienceFeedItems = (experiences || []).map((exp: any) => {
      const placeName = exp.places?.name || 'Unknown Place';
      const placeCity = exp.places?.city || '';
      const slug = generateExperienceSlug(placeName, placeCity);

      return {
        id: exp.id,
        experience_id: exp.id,
        slug,
        user: {
          id: authUser.id,
          display_name: profile?.display_name || authUser.user_metadata?.full_name || 'User',
          avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || null,
        },
        place: {
          id: exp.places?.id || exp.place_id,
          name: placeName,
          city_short: placeCity,
          country: exp.places?.country || '',
          thumbnail_image_url: exp.images?.[0] || null,
          instagram: exp.places?.instagram_handle || null,
        },
        price_range: exp.price_range || '$$',
        tags: transformTags(exp.tags || [], tagDisplayNames),
        time_ago: formatTimeAgo(exp.created_at),
        description: exp.brief_description,
        visibility: exp.visibility || 'friends_only',
      };
    });

    const userProfile = profile ? {
      id: profile.id,
      display_name: profile.display_name,
      username: profile.username,
      avatar_url: profile.avatar_url,
    } : {
      id: authUser.id,
      display_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
      username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'user',
      avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
    };

    // Get follower and following counts
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', authUser.id);

    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', authUser.id);

    return NextResponse.json({
      user: userProfile,
      experiences: experienceFeedItems,
      stats: {
        suggestions: experienceFeedItems.length,
        followers: followersCount || 0,
        following: followingCount || 0,
      },
    });
  }

  // Fetch other user's profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('Profile fetch error:', profileError);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }

  // Fetch user's experiences
  const { data: experiences, error: expError } = await supabase
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
      places:place_id (
        id,
        name,
        city,
        country,
        instagram_handle
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (expError) {
    console.error('Experiences fetch error:', expError);
  }

  // Collect all unique tag slugs and fetch display names
  const allTagSlugsOther = [...new Set((experiences || []).flatMap((exp: any) => exp.tags || []))];
  const tagDisplayNamesOther = new Map<string, string>();
  if (allTagSlugsOther.length > 0) {
    const { data: tagDetails } = await supabase
      .from('tags')
      .select('slug, display_name')
      .in('slug', allTagSlugsOther);

    (tagDetails || []).forEach((t: any) => {
      if (t.display_name) {
        tagDisplayNamesOther.set(t.slug, t.display_name);
      }
    });
  }

  // Transform experiences to feed item format
  const experienceFeedItems = (experiences || []).map((exp: any) => {
    const placeName = exp.places?.name || 'Unknown Place';
    const placeCity = exp.places?.city || '';
    const slug = generateExperienceSlug(placeName, placeCity);

    return {
      id: exp.id,
      experience_id: exp.id,
      slug,
      user: {
        id: profile.id,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
      },
      place: {
        id: exp.places?.id || exp.place_id,
        name: placeName,
        city_short: placeCity,
        country: exp.places?.country || '',
        thumbnail_image_url: exp.images?.[0] || null,
        instagram: exp.places?.instagram_handle || null,
      },
      price_range: exp.price_range || '$$',
      tags: transformTags(exp.tags || [], tagDisplayNamesOther),
      time_ago: formatTimeAgo(exp.created_at),
      description: exp.brief_description,
      visibility: exp.visibility || 'friends_only',
    };
  });

  // Get follower and following counts
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  // Get current user to check if they're viewing their own profile
  const authUser = await getAuthUser(supabase);

  // Filter experiences based on visibility
  // Show all if viewing own profile, or only public + friends_only if current user follows the profile
  let filteredExperiences = experienceFeedItems;

  if (authUser && authUser.id !== userId) {
    // Check if current user follows this profile
    const { data: followRelation } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', authUser.id)
      .eq('following_id', userId)
      .single();

    const isFollowing = !!followRelation;

    // Filter experiences: show public always, show friends_only only if following
    filteredExperiences = experienceFeedItems.filter((exp: any) => {
      const visibility = (experiences || []).find((e: any) => e.id === exp.id)?.visibility || 'public';
      return visibility === 'public' || (visibility === 'friends_only' && isFollowing);
    });
  } else if (!authUser) {
    // Not logged in - only show public experiences
    filteredExperiences = experienceFeedItems.filter((exp: any) => {
      const visibility = (experiences || []).find((e: any) => e.id === exp.id)?.visibility || 'public';
      return visibility === 'public';
    });
  }

  return NextResponse.json({
    user: {
      id: profile.id,
      display_name: profile.display_name,
      username: profile.username,
      avatar_url: profile.avatar_url,
    },
    experiences: filteredExperiences,
    stats: {
      suggestions: experienceFeedItems.length,
      followers: followersCount || 0,
      following: followingCount || 0,
    },
  });
}
