import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { formatTimeAgo, generateExperienceSlug } from '@/lib/utils/format';

interface OtherRecommender {
  id: string;
  display_name: string;
  avatar_url: string | null;
  username: string | null;
  experience_id: string;
}

function formatAndReturnExperience(
  experience: any,
  recommendationCount: number,
  otherRecommenders: OtherRecommender[] = []
) {
  const placeName = (experience.places as any)?.name || 'Unknown Place';
  const placeCity = (experience.places as any)?.city || '';

  // Generate slug for the experience (without ID, since ID is now in the URL)
  const slug = generateExperienceSlug(placeName, placeCity);

  // Transform to a detailed experience format
  const detailedExperience = {
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
      id: (experience.places as any)?.id || experience.place_id,
      name: placeName,
      city: placeCity,
      country: (experience.places as any)?.country || '',
      address: (experience.places as any)?.address || null,
      lat: (experience.places as any)?.lat || null,
      lng: (experience.places as any)?.lng || null,
      instagram_handle: (experience.places as any)?.instagram_handle || null,
      google_maps_url: (experience.places as any)?.google_maps_url || null,
      recommendation_count: recommendationCount,
    },
    price_range: experience.price_range || '$$',
    tags: experience.tags || [],
    brief_description: experience.brief_description,
    phone_number: experience.phone_number,
    images: experience.images || [],
    visit_date: experience.visit_date,
    visibility: experience.visibility || 'friends_only',
    time_ago: experience.created_at ? formatTimeAgo(experience.created_at) : 'Unknown',
    created_at: experience.created_at,
    other_recommenders: otherRecommenders,
  };

  return NextResponse.json(detailedExperience);
}

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch experience to verify ownership
  const { data: experience, error: fetchError } = await supabase
    .from('experiences')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !experience) {
    return NextResponse.json(
      { error: 'Experience not found' },
      { status: 404 }
    );
  }

  // Verify ownership
  if (experience.user_id !== authUser.id) {
    return NextResponse.json(
      { error: 'Not authorized to edit this experience' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const {
      price_range,
      tags,
      brief_description,
      phone_number,
      images,
      visibility,
    } = body;

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (price_range !== undefined) updateData.price_range = price_range;
    if (tags !== undefined) updateData.tags = tags;
    if (brief_description !== undefined)
      updateData.brief_description = brief_description || null;
    if (phone_number !== undefined)
      updateData.phone_number = phone_number || null;
    if (images !== undefined) updateData.images = images;
    if (visibility !== undefined) updateData.visibility = visibility;

    // Update experience
    const { data: updatedExperience, error: updateError } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', id)
      .select(experienceSelect)
      .single();

    if (updateError) {
      console.error('Experience update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update experience' },
        { status: 500 }
      );
    }

    // Get recommendation count for the place
    const placeId =
      ((updatedExperience.places as Record<string, unknown>)?.id as string) ||
      updatedExperience.place_id;
    const { count } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', placeId);

    // Get other public recommenders for the same place
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
      .neq('user_id', updatedExperience.user_id)
      .order('created_at', { ascending: false })
      .limit(10);

    const otherRecommenders: OtherRecommender[] = (otherExperiences || []).map((exp: any) => ({
      id: exp.users?.id || exp.user_id,
      display_name: exp.users?.display_name || 'Unknown User',
      avatar_url: exp.users?.avatar_url || null,
      username: exp.users?.username || null,
      experience_id: exp.id,
    }));

    return formatAndReturnExperience(updatedExperience, count ?? 1, otherRecommenders);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch experience to verify ownership
  const { data: experience, error: fetchError } = await supabase
    .from('experiences')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError || !experience) {
    return NextResponse.json(
      { error: 'Experience not found' },
      { status: 404 }
    );
  }

  // Verify ownership
  if (experience.user_id !== authUser.id) {
    return NextResponse.json(
      { error: 'Not authorized to delete this experience' },
      { status: 403 }
    );
  }

  // Delete the experience
  const { error: deleteError } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Experience delete error:', deleteError);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Direct ID lookup
  const { data: experience, error } = await supabase
    .from('experiences')
    .select(experienceSelect)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    console.error('Experience fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }

  // Get recommendation count for this place
  const placeId = (experience.places as any)?.id || experience.place_id;
  const { count } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true })
    .eq('place_id', placeId);

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

  return formatAndReturnExperience(experience, count ?? 1, otherRecommenders);
}
