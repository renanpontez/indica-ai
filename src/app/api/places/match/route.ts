import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const city = searchParams.get('city');
  const country = searchParams.get('country');

  if (!name || !city || !country) {
    return NextResponse.json(
      { error: 'name, city, and country are required' },
      { status: 400 }
    );
  }

  // Look for exact match (case-insensitive) on custom places
  const { data: exactMatch } = await supabase
    .from('places')
    .select('*')
    .ilike('name', name.trim())
    .ilike('city', city.trim())
    .ilike('country', country.trim())
    .eq('custom', true)
    .single();

  // Also look for similar matches (partial name match in same city)
  const { data: similarMatches } = await supabase
    .from('places')
    .select('*')
    .ilike('name', `%${name.trim()}%`)
    .ilike('city', city.trim())
    .neq('id', exactMatch?.id || '')
    .limit(5);

  // Get recommendation counts for all matched places
  const allPlaceIds = [
    ...(exactMatch ? [exactMatch.id] : []),
    ...(similarMatches || []).map(p => p.id),
  ];

  let recommendationCounts = new Map<string, number>();
  if (allPlaceIds.length > 0) {
    const { data: experiences } = await supabase
      .from('experiences')
      .select('place_id')
      .eq('status', 'active')
      .in('place_id', allPlaceIds);

    for (const exp of experiences || []) {
      recommendationCounts.set(exp.place_id, (recommendationCounts.get(exp.place_id) || 0) + 1);
    }
  }

  // Add recommendation_count to places
  const enrichPlace = (place: any) => ({
    ...place,
    recommendation_count: recommendationCounts.get(place.id) || 0,
  });

  return NextResponse.json({
    exact_match: exactMatch ? enrichPlace(exactMatch) : null,
    similar_matches: (similarMatches || []).map(enrichPlace),
  });
}
