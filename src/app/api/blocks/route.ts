import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

// GET /api/blocks - List blocked users
export async function GET() {
  const supabase = await createClient();
  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: blocks, error } = await supabase
    .from('blocks')
    .select('blocked_id, created_at, users!blocks_blocked_id_fkey(id, display_name, username, avatar_url)')
    .eq('blocker_id', authUser.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('List blocks error:', error);
    return NextResponse.json({ error: 'Failed to fetch blocked users' }, { status: 500 });
  }

  const users = (blocks || []).map((b: any) => ({
    id: b.users.id,
    display_name: b.users.display_name,
    username: b.users.username,
    avatar_url: b.users.avatar_url,
    blocked_at: b.created_at,
  }));

  return NextResponse.json({ users });
}

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

  // Remove follow relationships in both directions
  await Promise.all([
    // Stop following the blocked user
    supabase
      .from('follows')
      .delete()
      .eq('follower_id', authUser.id)
      .eq('following_id', blocked_id),
    // Remove the blocked user as a follower
    supabase
      .from('follows')
      .delete()
      .eq('follower_id', blocked_id)
      .eq('following_id', authUser.id),
  ]);

  return NextResponse.json({ success: true });
}
