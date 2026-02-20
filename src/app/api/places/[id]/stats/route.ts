import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Get all experiences for this place to count and aggregate tags
  const { data: experiences, error } = await supabase
    .from('experiences')
    .select('tags')
    .eq('place_id', id)
    .eq('status', 'active');

  if (error) {
    console.error('Place stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch place stats' }, { status: 500 });
  }

  const recommendation_count = experiences?.length ?? 0;

  // Aggregate tags and find the most common ones
  const tagCounts = new Map<string, number>();
  for (const exp of experiences || []) {
    for (const tag of exp.tags || []) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  // Sort by count and take top 5
  const top_tags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  return NextResponse.json({
    recommendation_count,
    top_tags,
  });
}
