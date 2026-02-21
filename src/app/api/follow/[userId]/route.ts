import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

// GET /api/follow/[userId] - Check if current user follows the target user
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ isFollowing: false });
  }

  const { data: follow } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', authUser.id)
    .eq('following_id', userId)
    .single();

  return NextResponse.json({ isFollowing: !!follow });
}

// POST /api/follow/[userId] - Follow a user
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Cannot follow yourself
  if (authUser.id === userId) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
  }

  // Check if the target user exists
  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if already following
  const { data: existingFollow } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', authUser.id)
    .eq('following_id', userId)
    .single();

  if (existingFollow) {
    return NextResponse.json({ error: 'Already following this user' }, { status: 400 });
  }

  // Create the follow relationship
  const { error: insertError } = await supabase
    .from('follows')
    .insert({
      follower_id: authUser.id,
      following_id: userId,
    });

  if (insertError) {
    console.error('Follow insert error:', insertError);
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/follow/[userId] - Unfollow a user
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Delete the follow relationship
  const { error: deleteError } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', authUser.id)
    .eq('following_id', userId);

  if (deleteError) {
    console.error('Unfollow delete error:', deleteError);
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
