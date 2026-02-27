import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

const VALID_REASONS = ['spam', 'inappropriate', 'misleading', 'other'] as const;

// POST /api/reports - Report an experience
export async function POST(request: Request) {
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { experience_id, reason, description } = body;

  if (!experience_id) {
    return NextResponse.json({ error: 'experience_id is required' }, { status: 400 });
  }

  if (!reason || !VALID_REASONS.includes(reason)) {
    return NextResponse.json(
      { error: `reason must be one of: ${VALID_REASONS.join(', ')}` },
      { status: 400 }
    );
  }

  // Verify the experience exists
  const { data: experience, error: expError } = await supabase
    .from('experiences')
    .select('id')
    .eq('id', experience_id)
    .single();

  if (expError || !experience) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }

  // Insert report (ignore if already exists)
  const { error: insertError } = await supabase
    .from('reports')
    .insert({
      reporter_id: authUser.id,
      experience_id,
      reason,
      description: description || null,
    });

  if (insertError) {
    // Unique constraint violation means already reported — treat as success
    if (insertError.code === '23505') {
      return NextResponse.json({ success: true });
    }
    console.error('Report insert error:', JSON.stringify(insertError, null, 2));
    return NextResponse.json(
      { error: 'Failed to submit report', details: insertError.message, code: insertError.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
