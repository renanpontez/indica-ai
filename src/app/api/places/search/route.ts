import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchGooglePlaces } from '@/lib/google-places';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const userLat = lat ? parseFloat(lat) : undefined;
  const userLng = lng ? parseFloat(lng) : undefined;

  const supabase = await createClient();

  // Search local database first
  const { data: localPlaces, error } = await supabase
    .from('places')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(5);

  if (error) {
    console.error('Local place search error:', error);
  }

  // Get recommendation counts for local places
  const localPlaceIds = (localPlaces || []).map(p => p.id);
  let recommendationCounts = new Map<string, number>();

  if (localPlaceIds.length > 0) {
    const { data: experiences } = await supabase
      .from('experiences')
      .select('place_id')
      .eq('status', 'active')
      .in('place_id', localPlaceIds);

    for (const exp of experiences || []) {
      recommendationCounts.set(exp.place_id, (recommendationCounts.get(exp.place_id) || 0) + 1);
    }
  }

  // Transform local results to match Place model
  const localResults = (localPlaces || []).map((place) => ({
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
    source: 'local' as const,
    recommendation_count: recommendationCounts.get(place.id) || 0,
  }));

  // Search Google Places API
  const googleResults = await searchGooglePlaces(query, userLat, userLng);

  // Transform Google results to match Place model (without id, will be created on selection)
  const googlePlaceResults = googleResults
    .filter((gp) => {
      // Exclude Google results that already exist in local DB
      return !localResults.some((lp) => lp.google_place_id === gp.google_place_id);
    })
    .map((place) => ({
      id: null, // Will be created when user selects this place
      google_place_id: place.google_place_id,
      name: place.name,
      city: place.city,
      country: place.country,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      instagram_handle: null,
      google_maps_url: place.google_maps_url,
      custom: false,
      source: 'google' as const,
      recommendation_count: 0, // New place, no recommendations yet
    }));

  // Combine results: local first, then Google
  let allResults = [...localResults, ...googlePlaceResults];

  // If coordinates provided, filter out distant results and sort by distance
  if (userLat !== undefined && userLng !== undefined) {
    const MAX_KM = 100;

    allResults = allResults
      .map((place) => {
        if (!place.lat || !place.lng) return { ...place, distanceKm: Infinity };
        const distanceKm = haversineKm(userLat, userLng, place.lat, place.lng);
        return { ...place, distanceKm };
      })
      .filter((place) => place.distanceKm <= MAX_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .map(({ distanceKm: _, ...place }) => place);
  }

  return NextResponse.json(allResults.slice(0, 10));
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
