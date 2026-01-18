import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateExperienceSlug } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.trim();
  const type = searchParams.get('type') || 'all'; // 'all', 'experiences', 'users'

  if (!query || query.length < 2) {
    return NextResponse.json({ experiences: [], users: [] });
  }

  const supabase = await createClient();
  const searchPattern = `%${query}%`;

  const results: { experiences: any[]; users: any[] } = {
    experiences: [],
    users: [],
  };

  // Search experiences (via places)
  if (type === 'all' || type === 'experiences') {
    const { data: experiences, error: expError } = await supabase
      .from('experiences')
      .select(`
        id,
        brief_description,
        tags,
        price_range,
        created_at,
        places:place_id (
          id,
          name,
          city,
          country
        ),
        users:user_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .or(`brief_description.ilike.${searchPattern}`)
      .limit(10);

    if (!expError && experiences) {
      // Also search by place name
      const { data: placeExperiences } = await supabase
        .from('places')
        .select(`
          id,
          name,
          city,
          country,
          experiences (
            id,
            brief_description,
            tags,
            price_range,
            created_at,
            users:user_id (
              id,
              display_name,
              avatar_url
            )
          )
        `)
        .or(`name.ilike.${searchPattern},city.ilike.${searchPattern}`)
        .limit(10);

      // Combine and deduplicate results
      const experienceMap = new Map();

      experiences.forEach((exp: any) => {
        const placeName = exp.places?.name || '';
        const placeCity = exp.places?.city || '';
        experienceMap.set(exp.id, {
          id: exp.id,
          slug: generateExperienceSlug(placeName, placeCity),
          brief_description: exp.brief_description,
          tags: exp.tags || [],
          price_range: exp.price_range,
          place: exp.places,
          user: exp.users,
        });
      });

      placeExperiences?.forEach((place: any) => {
        place.experiences?.forEach((exp: any) => {
          if (!experienceMap.has(exp.id)) {
            experienceMap.set(exp.id, {
              id: exp.id,
              slug: generateExperienceSlug(place.name || '', place.city || ''),
              brief_description: exp.brief_description,
              tags: exp.tags || [],
              price_range: exp.price_range,
              place: {
                id: place.id,
                name: place.name,
                city: place.city,
                country: place.country,
              },
              user: exp.users,
            });
          }
        });
      });

      results.experiences = Array.from(experienceMap.values()).slice(0, 10);
    }
  }

  // Search users
  if (type === 'all' || type === 'users') {
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, display_name, username, avatar_url')
      .or(`display_name.ilike.${searchPattern},username.ilike.${searchPattern}`)
      .limit(10);

    if (!userError && users) {
      results.users = users;
    }
  }

  return NextResponse.json(results);
}
