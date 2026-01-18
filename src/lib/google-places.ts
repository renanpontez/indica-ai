interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
}

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  url?: string;
  website?: string;
  formatted_phone_number?: string;
}

interface GooglePlaceDetailsResponse {
  result: GooglePlaceDetails;
  status: string;
  error_message?: string;
}

export interface PlaceSearchResult {
  google_place_id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  google_maps_url?: string;
}

function extractCityAndCountry(
  addressComponents?: GooglePlaceDetails['address_components'],
  formattedAddress?: string
): { city: string; country: string } {
  let city = '';
  let country = '';

  if (addressComponents) {
    for (const component of addressComponents) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1') && !city) {
        city = component.long_name;
      }
      if (component.types.includes('country')) {
        country = component.long_name;
      }
    }
  }

  // Fallback: try to extract from formatted address
  if ((!city || !country) && formattedAddress) {
    const parts = formattedAddress.split(',').map((p) => p.trim());
    if (parts.length >= 2) {
      if (!country) country = parts[parts.length - 1];
      if (!city && parts.length >= 3) city = parts[parts.length - 2];
    }
  }

  return { city: city || 'Unknown', country: country || 'Unknown' };
}

export async function searchGooglePlaces(
  query: string,
  lat?: number,
  lng?: number
): Promise<PlaceSearchResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('GOOGLE_PLACES_API_KEY is not configured');
    return [];
  }

  try {
    // Use Text Search API for better results with location bias
    const params = new URLSearchParams({
      query,
      key: apiKey,
    });

    // Add location bias if coordinates are provided
    if (lat !== undefined && lng !== undefined) {
      params.append('location', `${lat},${lng}`);
      params.append('radius', '50000'); // 50km radius for location bias
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`
    );

    if (!response.ok) {
      console.error('Google Places API error:', response.status);
      return [];
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API status:', data.status, data.error_message);
      return [];
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Get place details for each result to extract city/country
    const detailedResults = await Promise.all(
      data.results.slice(0, 10).map(async (place) => {
        const details = await getPlaceDetails(place.place_id, apiKey);
        const { city, country } = extractCityAndCountry(
          details?.address_components,
          details?.formatted_address || place.formatted_address
        );

        return {
          google_place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          city,
          country,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          google_maps_url: details?.url,
        };
      })
    );

    return detailedResults;
  } catch (error) {
    console.error('Google Places search error:', error);
    return [];
  }
}

async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<GooglePlaceDetails | null> {
  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'address_components,formatted_address,geometry,name,url',
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
