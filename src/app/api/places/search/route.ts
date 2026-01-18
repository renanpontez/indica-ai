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
  const allResults = [...localResults, ...googlePlaceResults];

  // If coordinates provided, sort by distance
  if (userLat !== undefined && userLng !== undefined) {
    allResults.sort((a, b) => {
      if (!a.lat || !a.lng) return 1;
      if (!b.lat || !b.lng) return -1;

      const distA = Math.sqrt(
        Math.pow(a.lat - userLat, 2) + Math.pow(a.lng - userLng, 2)
      );
      const distB = Math.sqrt(
        Math.pow(b.lat - userLat, 2) + Math.pow(b.lng - userLng, 2)
      );
      return distA - distB;
    });
  }

  return NextResponse.json(allResults.slice(0, 10));
}
