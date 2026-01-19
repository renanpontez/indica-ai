import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper to get recommendation count for a place
async function getRecommendationCount(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never, placeId: string): Promise<number> {
  const { count } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true })
    .eq('place_id', placeId);
  return count ?? 0;
}

// Normalize country names to a consistent format
function normalizeCountry(country: string): string {
  const normalized = country.trim().toLowerCase();
  // Map common variations to a standard format
  const countryMap: Record<string, string> = {
    'brasil': 'Brazil',
    'brazil': 'Brazil',
    'estados unidos': 'United States',
    'eua': 'United States',
    'usa': 'United States',
    'united states': 'United States',
    'united states of america': 'United States',
  };
  return countryMap[normalized] || country.trim();
}

// Normalize city names
function normalizeCity(city: string): string {
  return city.trim();
}

// Format place response
function formatPlaceResponse(place: any, recommendation_count: number) {
  return {
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
    custom: place.custom ?? !place.google_place_id,
    recommendation_count,
  };
}

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

  // Normalize city and country for consistency
  const normalizedCity = normalizeCity(city);
  const normalizedCountry = normalizeCountry(country);

  // 1. Check if place with same google_place_id already exists
  if (google_place_id) {
    const { data: existingPlace } = await supabase
      .from('places')
      .select('*')
      .eq('google_place_id', google_place_id)
      .single();

    if (existingPlace) {
      const recommendation_count = await getRecommendationCount(supabase, existingPlace.id);
      return NextResponse.json(formatPlaceResponse(existingPlace, recommendation_count));
    }
  }

  // 2. Check for existing place by name (case-insensitive) regardless of custom flag
  // This catches duplicates even when google_place_id differs
  const { data: existingByName } = await supabase
    .from('places')
    .select('*')
    .ilike('name', name.trim());

  if (existingByName && existingByName.length > 0) {
    // Find a match with similar location (same city or same country)
    const matchingPlace = existingByName.find(place => {
      const sameCity = place.city.toLowerCase() === normalizedCity.toLowerCase();
      const sameCountry = place.country.toLowerCase() === normalizedCountry.toLowerCase() ||
                          normalizeCountry(place.country).toLowerCase() === normalizedCountry.toLowerCase();
      return sameCity || sameCountry;
    });

    if (matchingPlace) {
      const recommendation_count = await getRecommendationCount(supabase, matchingPlace.id);
      return NextResponse.json(formatPlaceResponse(matchingPlace, recommendation_count));
    }
  }

  // 3. If we have coordinates, check for nearby places with similar names
  if (lat && lng) {
    const { data: nearbyPlaces } = await supabase
      .from('places')
      .select('*')
      .not('lat', 'is', null)
      .not('lng', 'is', null);

    if (nearbyPlaces && nearbyPlaces.length > 0) {
      // Find places within ~500m with similar names
      const matchingNearby = nearbyPlaces.find(place => {
        if (!place.lat || !place.lng) return false;

        // Calculate approximate distance (simplified, not accurate for large distances)
        const latDiff = Math.abs(place.lat - lat);
        const lngDiff = Math.abs(place.lng - lng);
        const isNearby = latDiff < 0.005 && lngDiff < 0.005; // ~500m

        // Check if names are similar (case-insensitive)
        const nameSimilar = place.name.toLowerCase() === name.trim().toLowerCase();

        return isNearby && nameSimilar;
      });

      if (matchingNearby) {
        const recommendation_count = await getRecommendationCount(supabase, matchingNearby.id);
        return NextResponse.json(formatPlaceResponse(matchingNearby, recommendation_count));
      }
    }
  }

  // 4. No existing place found, create a new one with normalized data
  const { data: place, error } = await supabase
    .from('places')
    .insert({
      name: name.trim(),
      city: normalizedCity,
      country: normalizedCountry,
      address: address || null,
      lat: lat || null,
      lng: lng || null,
      instagram_handle: instagram_handle || null,
      google_place_id: google_place_id || null,
      google_maps_url: google_maps_url || null,
      custom: !google_place_id,
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
    recommendation_count: 0, // Newly created place has no recommendations yet
  });
}
