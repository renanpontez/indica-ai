import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Get authenticated user
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { place_id, place, price_range, tags, brief_description, phone_number, images, visit_date, visibility } = body;

  // Resolve place_id: use provided place_id or create place from place object
  let resolvedPlaceId = place_id;

  if (!resolvedPlaceId && place) {
    // Try to find existing place by google_place_id
    if (place.google_place_id) {
      const { data: existing } = await supabase
        .from('places')
        .select('id')
        .eq('google_place_id', place.google_place_id)
        .single();

      if (existing) {
        resolvedPlaceId = existing.id;
      }
    }

    // If not found, create the place
    if (!resolvedPlaceId) {
      const { data: newPlace, error: placeError } = await supabase
        .from('places')
        .insert({
          name: place.name,
          city: place.city,
          country: place.country,
          address: place.address || null,
          google_place_id: place.google_place_id || null,
          lat: place.lat || null,
          lng: place.lng || null,
          instagram_handle: place.instagram_handle || null,
          google_maps_url: place.google_maps_url || null,
        })
        .select('id')
        .single();

      if (placeError) {
        console.error('Create place error:', placeError);
        return NextResponse.json({ error: 'Failed to create place', details: placeError.message }, { status: 500 });
      }
      resolvedPlaceId = newPlace.id;
    }
  }

  // Validate required fields
  if (!resolvedPlaceId) {
    return NextResponse.json({ error: 'place_id is required' }, { status: 400 });
  }
  if (!price_range) {
    return NextResponse.json({ error: 'price_range is required' }, { status: 400 });
  }
  if (!tags || tags.length === 0) {
    return NextResponse.json({ error: 'At least one tag is required' }, { status: 400 });
  }

  // Create the experience
  const { data: experience, error } = await supabase
    .from('experiences')
    .insert({
      user_id: user.id,
      place_id: resolvedPlaceId,
      price_range,
      tags,
      brief_description: brief_description || null,
      phone_number: phone_number || null,
      images: images || null,
      visit_date: visit_date || null,
      visibility: visibility || 'public',
    })
    .select()
    .single();

  if (error) {
    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience', details: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: experience.id,
    user_id: experience.user_id,
    place_id: experience.place_id,
    price_range: experience.price_range,
    tags: experience.tags,
    brief_description: experience.brief_description,
    phone_number: experience.phone_number,
    images: experience.images,
    visit_date: experience.visit_date,
    visibility: experience.visibility,
    created_at: experience.created_at,
  });
}
