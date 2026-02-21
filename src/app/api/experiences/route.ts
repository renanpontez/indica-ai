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
  const { place_id, price_range, tags, brief_description, phone_number, images, visit_date } = body;

  // Validate required fields
  if (!place_id) {
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
      place_id,
      price_range,
      tags,
      brief_description: brief_description || null,
      phone_number: phone_number || null,
      images: images || null,
      visit_date: visit_date || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
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
    created_at: experience.created_at,
  });
}
