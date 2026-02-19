import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatTimeAgo, generateExperienceSlug, slugify } from '@/lib/utils/format';

// Helper to format slug to display name (capitalize first letter, replace hyphens with spaces)
function formatSlugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to transform experience data
function transformExperience(exp: any, tagDisplayNames: Map<string, string>) {
  const placeName = exp.places?.name || 'Unknown Place';
  const placeCity = exp.places?.city || '';
  const slug = generateExperienceSlug(placeName, placeCity);

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
      id: exp.places?.id || exp.place_id,
      name: placeName,
      city_short: placeCity,
      country: exp.places?.country || '',
      thumbnail_image_url: exp.images?.[0] || null,
      instagram: exp.places?.instagram_handle || null,
    },
    price_range: exp.price_range || '$$',
    tags,
    time_ago: formatTimeAgo(exp.created_at),
    description: exp.brief_description,
  };
}

export interface ExploreResponse {
  experiences: ReturnType<typeof transformExperience>[];
  cities: { city: string; country: string; count: number; slug: string }[];
  tags: { tag: string; count: number; displayName: string | null }[];
  total: number;
  resolvedCity?: string | null;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // Query parameters for filtering
  let city = searchParams.get('city');
  const citySlug = searchParams.get('citySlug');
  const tag = searchParams.get('tag');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Resolve citySlug to actual city name
  let resolvedCity: string | null = null;
  if (citySlug && !city) {
    const { data: distinctCities } = await supabase
      .from('places')
      .select('city')
      .not('city', 'is', null);

    const uniqueCities = [...new Set((distinctCities || []).map((p: any) => p.city).filter(Boolean))];
    const matchedCity = uniqueCities.find((c: string) => slugify(c) === citySlug);
    if (matchedCity) {
      city = matchedCity;
      resolvedCity = matchedCity;
    }
  }

  // Build the query - only public experiences
  let query = supabase
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
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  // Apply city filter if provided
  if (city) {
    query = query.ilike('places.city', `%${city}%`);
  }

  // Apply tag filter if provided
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data: experiences, error } = await query;

  if (error) {
    console.error('Error fetching explore experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }

  // Filter out experiences where place is null (due to inner join behavior)
  const validExperiences = (experiences || []).filter((exp: any) => exp.places !== null);

  // Get aggregated cities (for the cities page)
  const { data: citiesData } = await supabase
    .from('experiences')
    .select(`
      places:place_id (
        city,
        country
      )
    `)
    .eq('visibility', 'public');

  // Aggregate cities with counts
  const cityMap = new Map<string, { city: string; country: string; count: number }>();
  (citiesData || []).forEach((exp: any) => {
    if (exp.places?.city) {
      const key = `${exp.places.city}-${exp.places.country}`;
      const existing = cityMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        cityMap.set(key, {
          city: exp.places.city,
          country: exp.places.country,
          count: 1,
        });
      }
    }
  });
  const cities = Array.from(cityMap.values())
    .map(c => ({ ...c, slug: slugify(c.city) }))
    .sort((a, b) => b.count - a.count);

  // Get aggregated tags
  const { data: tagsData } = await supabase
    .from('experiences')
    .select('tags')
    .eq('visibility', 'public');

  // Aggregate tags with counts
  const tagMap = new Map<string, number>();
  (tagsData || []).forEach((exp: any) => {
    (exp.tags || []).forEach((t: string) => {
      tagMap.set(t, (tagMap.get(t) || 0) + 1);
    });
  });

  // Fetch tag display names from the tags table
  const tagSlugs = Array.from(tagMap.keys());
  const { data: tagDetails } = await supabase
    .from('tags')
    .select('slug, display_name')
    .in('slug', tagSlugs);

  const tagDisplayNames = new Map<string, string>();
  (tagDetails || []).forEach((t: any) => {
    if (t.display_name) {
      tagDisplayNames.set(t.slug, t.display_name);
    }
  });

  // Transform experiences with tag display names
  const transformedExperiences = validExperiences.map(exp => transformExperience(exp, tagDisplayNames));

  const tags = Array.from(tagMap.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      displayName: tagDisplayNames.get(tag) || null,
    }))
    .sort((a, b) => b.count - a.count);

  // Get total count for pagination (with same filters applied)
  // Must include places join so that city filter works on the related table
  let countQuery = supabase
    .from('experiences')
    .select('*, places:place_id(city)', { count: 'exact', head: true })
    .eq('visibility', 'public');

  if (tag) {
    countQuery = countQuery.contains('tags', [tag]);
  }

  if (city) {
    countQuery = countQuery.ilike('places.city', `%${city}%`);
  }

  const { count: total } = await countQuery;

  return NextResponse.json({
    experiences: transformedExperiences,
    cities,
    tags,
    total: total || 0,
    resolvedCity: resolvedCity || null,
  });
}
