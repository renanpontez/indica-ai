import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, city, country, address, lat, lng, instagram_handle, google_place_id, google_maps_url } = body;

  // Validate required fields
  if (!name || !city || !country) {
    return NextResponse.json(
      { error: 'Name, city, and country are required' },
      { status: 400 }
    );
  }

  // Check if place with same google_place_id already exists
  if (google_place_id) {
    const { data: existingPlace } = await supabase
      .from('places')
      .select('*')
      .eq('google_place_id', google_place_id)
      .single();

    if (existingPlace) {
      // Return existing place instead of creating a duplicate
      return NextResponse.json({
        id: existingPlace.id,
        google_place_id: existingPlace.google_place_id,
        name: existingPlace.name,
        city: existingPlace.city,
        country: existingPlace.country,
        address: existingPlace.address,
        lat: existingPlace.lat,
        lng: existingPlace.lng,
        instagram_handle: existingPlace.instagram_handle,
        google_maps_url: existingPlace.google_maps_url,
        custom: existingPlace.custom ?? false,
      });
    }
  }

  // Create the place
  const { data: place, error } = await supabase
    .from('places')
    .insert({
      name,
      city,
      country,
      address: address || null,
      lat: lat || null,
      lng: lng || null,
      instagram_handle: instagram_handle || null,
      google_place_id: google_place_id || null,
      google_maps_url: google_maps_url || null,
      custom: !google_place_id, // custom is false if from Google Places
    })
    .select()
    .single();

  if (error) {
    console.error('Create place error:', error);
    return NextResponse.json({ error: 'Failed to create place' }, { status: 500 });
  }

  return NextResponse.json({
    id: place.id,
    google_place_id: place.google_place_id,
    name: place.name,
    city: place.city,
    country: place.country,
    address: place.address,
    lat: place.lat,
    lng: place.lng,
    instagram_handle: place.instagram_handle,
    google_maps_url: place.google_maps_url,
    custom: place.custom ?? true,
  });
}
