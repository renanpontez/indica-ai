import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateExperienceSlug } from '@/lib/utils/format';

function formatSlugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function transformSearchExperience(exp: any, place: any, tagDisplayNames: Map<string, string>) {
  const placeName = place?.name || '';
  const placeCity = place?.city || '';
  const images = exp.images || [];
  const tags = (exp.tags || []).map((tagSlug: string) => ({
    slug: tagSlug,
    display_name: tagDisplayNames.get(tagSlug) || formatSlugToDisplayName(tagSlug),
  }));

  return {
    id: exp.id,
    experience_id: exp.id,
    slug: generateExperienceSlug(placeName, placeCity),
    brief_description: exp.brief_description,
    tags,
    price_range: exp.price_range,
    place: {
      id: place?.id,
      name: placeName,
      city: placeCity,
      country: place?.country || '',
      thumbnail_image_url: images.length > 0 ? images[0] : null,
    },
    user: {
      id: exp.users?.id,
      display_name: exp.users?.display_name || '',
      avatar_url: exp.users?.avatar_url || null,
    },
  };
}

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
        images,
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
      .eq('status', 'active')
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
            images,
            created_at,
            status,
            users:user_id (
              id,
              display_name,
              avatar_url
            )
          )
        `)
        .or(`name.ilike.${searchPattern},city.ilike.${searchPattern}`)
        .limit(10);

      // Collect all tag slugs to fetch display names
      const allTagSlugs = new Set<string>();
      experiences.forEach((exp: any) => (exp.tags || []).forEach((t: string) => allTagSlugs.add(t)));
      placeExperiences?.forEach((place: any) =>
        place.experiences?.forEach((exp: any) => (exp.tags || []).forEach((t: string) => allTagSlugs.add(t)))
      );

      const tagDisplayNames = new Map<string, string>();
      if (allTagSlugs.size > 0) {
        const { data: tagsData } = await supabase
          .from('tags')
          .select('slug, display_name')
          .in('slug', Array.from(allTagSlugs));
        tagsData?.forEach((tag: any) => tagDisplayNames.set(tag.slug, tag.display_name));
      }

      // Combine and deduplicate results
      const experienceMap = new Map();

      experiences.forEach((exp: any) => {
        experienceMap.set(exp.id, transformSearchExperience(exp, exp.places, tagDisplayNames));
      });

      placeExperiences?.forEach((place: any) => {
        place.experiences?.filter((exp: any) => exp.status !== 'inactive').forEach((exp: any) => {
          if (!experienceMap.has(exp.id)) {
            experienceMap.set(exp.id, transformSearchExperience(exp, place, tagDisplayNames));
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
