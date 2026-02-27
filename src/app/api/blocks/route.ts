import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

// POST /api/blocks - Block a user
export async function POST(request: Request) {
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { blocked_id } = body;

  if (!blocked_id) {
    return NextResponse.json({ error: 'blocked_id is required' }, { status: 400 });
  }

  if (authUser.id === blocked_id) {
    return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });
  }

  // Verify the target user exists
  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', blocked_id)
    .single();

  if (userError || !targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Insert block (ignore if already exists)
  const { error: insertError } = await supabase
    .from('blocks')
    .insert({
      blocker_id: authUser.id,
      blocked_id,
    });

  if (insertError) {
    // Unique constraint violation means already blocked — treat as success
    if (insertError.code === '23505') {
      return NextResponse.json({ success: true });
    }
    console.error('Block insert error:', insertError);
    return NextResponse.json({ error: 'Failed to block user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
