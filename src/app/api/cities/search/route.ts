import { NextRequest, NextResponse } from 'next/server';

interface GoogleAutocompleteResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: Array<{
    offset: number;
    value: string;
  }>;
}

interface GoogleAutocompleteResponse {
  predictions: GoogleAutocompleteResult[];
  status: string;
  error_message?: string;
}

interface GooglePlaceDetails {
  place_id: string;
  formatted_address: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlaceDetailsResponse {
  result: GooglePlaceDetails;
  status: string;
  error_message?: string;
}

export interface AddressSearchResult {
  place_id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  lat?: number;
  lng?: number;
}

function extractLocationDetails(
  addressComponents?: GooglePlaceDetails['address_components']
): { city: string; state: string; country: string } {
  let city = '';
  let state = '';
  let country = '';

  if (addressComponents) {
    for (const component of addressComponents) {
      // City: locality or administrative_area_level_2
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_2') && !city) {
        city = component.long_name;
      }
      // State: administrative_area_level_1
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      // Country
      if (component.types.includes('country')) {
        country = component.long_name;
      }
    }
  }

  return { city, state, country };
}

async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<GooglePlaceDetails | null> {
  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'address_components,formatted_address,geometry',
      key: apiKey,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`
    );

    if (!response.ok) {
      return null;
    }

    const data: GooglePlaceDetailsResponse = await response.json();

    if (data.status !== 'OK') {
      return null;
    }

    return data.result;
  } catch (error) {
    console.error('Place details error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('GOOGLE_PLACES_API_KEY is not configured');
    return NextResponse.json([]);
  }

  try {
    // Use Place Autocomplete API for address suggestions
    const params = new URLSearchParams({
      input: query,
      key: apiKey,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`
    );

    if (!response.ok) {
      console.error('Google Places Autocomplete error:', response.status);
      return NextResponse.json([]);
    }

    const data: GoogleAutocompleteResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places Autocomplete status:', data.status, data.error_message);
      return NextResponse.json([]);
    }

    // Get details for each prediction to extract city/state/country
    const predictions = data.predictions || [];
    const results: AddressSearchResult[] = [];

    for (const prediction of predictions.slice(0, 5)) {
      const details = await getPlaceDetails(prediction.place_id, apiKey);
      const { city, state, country } = extractLocationDetails(details?.address_components);

      results.push({
        place_id: prediction.place_id,
        address: prediction.structured_formatting.main_text,
        city,
        state,
        country,
        description: prediction.description,
        lat: details?.geometry?.location.lat,
        lng: details?.geometry?.location.lng,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Address search error:', error);
    return NextResponse.json([]);
  }
}
