import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';

// Helper function to transform experience data
function transformExperience(exp: any) {
  const placeName = exp.places?.name || 'Unknown Place';
  const placeCity = exp.places?.city || '';
  const slug = generateExperienceSlug(placeName, placeCity);

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
    categories: exp.categories || [],
    time_ago: formatTimeAgo(exp.created_at),
    description: exp.brief_description,
  };
}

export interface ExploreResponse {
  experiences: ReturnType<typeof transformExperience>[];
  cities: { city: string; country: string; count: number }[];
  categories: { category: string; count: number }[];
  total: number;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const searchParams = request.nextUrl.searchParams;

  // Query parameters for filtering
  const city = searchParams.get('city');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Build the query - only public experiences
  let query = supabase
    .from('experiences')
    .select(`
      id,
      price_range,
      categories,
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

  // Apply category filter if provided
  if (category) {
    query = query.contains('categories', [category]);
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
  const transformedExperiences = validExperiences.map(transformExperience);

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
  const cities = Array.from(cityMap.values()).sort((a, b) => b.count - a.count);

  // Get aggregated categories
  const { data: categoriesData } = await supabase
    .from('experiences')
    .select('categories')
    .eq('visibility', 'public');

  // Aggregate categories with counts
  const categoryMap = new Map<string, number>();
  (categoriesData || []).forEach((exp: any) => {
    (exp.categories || []).forEach((cat: string) => {
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });
  });
  const categories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Get total count for pagination
  const { count: total } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true })
    .eq('visibility', 'public');

  return NextResponse.json({
    experiences: transformedExperiences,
    cities,
    categories,
    total: total || 0,
  });
}
