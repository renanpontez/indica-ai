import { createClient } from '@/lib/supabase/server';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';
import type { ExperienceDetail, PriceRange, ExperienceVisibility, OtherRecommender } from '@/lib/models';

const experienceSelect = `
  id,
  price_range,
  tags,
  brief_description,
  phone_number,
  images,
  visit_date,
  visibility,
  created_at,
  user_id,
  place_id,
  users:user_id (
    id,
    display_name,
    avatar_url,
    username
  ),
  places:place_id (
    id,
    name,
    city,
    country,
    address,
    lat,
    lng,
    instagram_handle,
    google_maps_url
  )
`;

export async function getExperience(id: string): Promise<ExperienceDetail | null> {
  const supabase = await createClient();

  const { data: experience, error } = await supabase
    .from('experiences')
    .select(experienceSelect)
    .eq('id', id)
    .single();

  if (error || !experience) {
    return null;
  }

  const placeName = (experience.places as any)?.name || 'Unknown Place';
  const placeCity = (experience.places as any)?.city || '';
  const placeId = (experience.places as any)?.id || experience.place_id;
  const slug = generateExperienceSlug(placeName, placeCity);

  // Get other public recommenders for the same place (excluding current experience's user)
  const { data: otherExperiences } = await supabase
    .from('experiences')
    .select(`
      id,
      user_id,
      users:user_id (
        id,
        display_name,
        avatar_url,
        username
      )
    `)
    .eq('place_id', placeId)
    .eq('visibility', 'public')
    .neq('user_id', experience.user_id)
    .order('created_at', { ascending: false })
    .limit(10);

  const otherRecommenders: OtherRecommender[] = (otherExperiences || []).map((exp: any) => ({
    id: exp.users?.id || exp.user_id,
    display_name: exp.users?.display_name || 'Unknown User',
    avatar_url: exp.users?.avatar_url || null,
    username: exp.users?.username || null,
    experience_id: exp.id,
  }));

  return {
    id: experience.id,
    experience_id: experience.id,
    slug,
    user: {
      id: (experience.users as any)?.id || experience.user_id,
      display_name: (experience.users as any)?.display_name || 'Unknown User',
      avatar_url: (experience.users as any)?.avatar_url || null,
      username: (experience.users as any)?.username || null,
    },
    place: {
      id: placeId,
      name: placeName,
      city: placeCity,
      country: (experience.places as any)?.country || '',
      address: (experience.places as any)?.address || null,
      lat: (experience.places as any)?.lat || null,
      lng: (experience.places as any)?.lng || null,
      instagram_handle: (experience.places as any)?.instagram_handle || null,
      google_maps_url: (experience.places as any)?.google_maps_url || null,
    },
    price_range: (experience.price_range || '$$') as PriceRange,
    tags: experience.tags || [],
    brief_description: experience.brief_description,
    phone_number: experience.phone_number,
    images: experience.images || [],
    visit_date: experience.visit_date,
    visibility: (experience.visibility || 'friends_only') as ExperienceVisibility,
    time_ago: experience.created_at ? formatTimeAgo(experience.created_at) : 'Unknown',
    created_at: experience.created_at,
    other_recommenders: otherRecommenders,
  };
}
