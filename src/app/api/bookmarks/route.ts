import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';

// Helper to format slug to display name (capitalize first letter, replace hyphens with spaces)
function formatSlugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to transform bookmark data to ExperienceFeedItem format
function transformBookmarkToFeedItem(bookmark: any, tagDisplayNames: Map<string, string>) {
  const exp = bookmark.experiences;
  const place = exp.places;
  const user = exp.users;

  const placeName = place?.name || 'Unknown Place';
  const placeCity = place?.city || '';
  const slug = generateExperienceSlug(placeName, placeCity);

  const images = exp.images || [];
  const thumbnailImageUrl = images.length > 0 ? images[0] : null;

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
      id: user?.id || exp.user_id,
      display_name: user?.display_name || 'Unknown User',
      avatar_url: user?.avatar_url || null,
    },
    place: {
      id: place?.id || exp.place_id,
      name: placeName,
      city_short: placeCity,
      country: place?.country || '',
      thumbnail_image_url: thumbnailImageUrl,
      instagram: place?.instagram_handle || null,
    },
    price_range: exp.price_range || '$$',
    tags,
    time_ago: formatTimeAgo(exp.created_at),
    description: exp.brief_description,
    visibility: exp.visibility,
    isBookmarked: true,
    bookmarkId: bookmark.id,
  };
}

// GET /api/bookmarks - Get current user's bookmarks
export async function GET() {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch bookmarks with experience and related data
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      experience_id,
      experiences:experience_id (
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
      )
    `)
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Bookmarks fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }

  // Filter out bookmarks with deleted experiences
  const validBookmarks = (bookmarks || []).filter((b: any) => b.experiences);

  // Collect all unique tag slugs and fetch display names
  const allTagSlugs = [...new Set(validBookmarks.flatMap((b: any) => b.experiences?.tags || []))];
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

  // Transform bookmarks to feed items
  const feedItems = validBookmarks.map(b => transformBookmarkToFeedItem(b, tagDisplayNames));

  return NextResponse.json(feedItems);
}

// POST /api/bookmarks - Create a bookmark
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { experience_id } = body;

  if (!experience_id) {
    return NextResponse.json({ error: 'experience_id is required' }, { status: 400 });
  }

  // Verify the experience exists
  const { data: experience, error: expError } = await supabase
    .from('experiences')
    .select('id')
    .eq('id', experience_id)
    .single();

  if (expError || !experience) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }

  // Check if already bookmarked
  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', authUser.id)
    .eq('experience_id', experience_id)
    .single();

  if (existingBookmark) {
    return NextResponse.json({ error: 'Already bookmarked' }, { status: 400 });
  }

  // Create the bookmark
  const { data: bookmark, error: insertError } = await supabase
    .from('bookmarks')
    .insert({
      user_id: authUser.id,
      experience_id,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Bookmark insert error:', insertError);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }

  return NextResponse.json(bookmark);
}
