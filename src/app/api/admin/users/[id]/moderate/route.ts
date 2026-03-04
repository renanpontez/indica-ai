import { NextResponse } from 'next/server';
import { createAuthClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params;

  const authSupabase = await createAuthClient();
  const { data: { user: authUser } } = await authSupabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single();

  if (!userProfile || userProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { action, reason } = body as { action: string; reason?: string };

  if (!['suspend', 'unsuspend', 'ban'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Get target user
  const { data: targetUser } = await supabase
    .from('users')
    .select('id, display_name, status')
    .eq('id', targetUserId)
    .single();

  if (!targetUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (action === 'suspend') {
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Reason is required for suspension' }, { status: 400 });
    }

    // Update user status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        status: 'suspended',
        suspended_at: now,
        suspended_by: authUser.id,
        suspension_reason: reason.trim(),
      })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Suspend user error:', updateError);
      return NextResponse.json({ error: 'Failed to suspend user' }, { status: 500 });
    }

    // Hide all their experiences
    await supabase
      .from('experiences')
      .update({ status: 'inactive' })
      .eq('user_id', targetUserId)
      .eq('status', 'active');

    // Mark pending reports on their content as actioned
    const { data: userExps } = await supabase
      .from('experiences')
      .select('id')
      .eq('user_id', targetUserId);

    if (userExps && userExps.length > 0) {
      await supabase
        .from('reports')
        .update({
          status: 'actioned',
          reviewed_at: now,
          reviewed_by: authUser.id,
        })
        .in('experience_id', userExps.map(e => e.id))
        .eq('status', 'pending');
    }

    return NextResponse.json({ success: true, status: 'suspended' });
  }

  if (action === 'unsuspend') {
    // Restore user status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        status: 'active',
        suspended_at: null,
        suspended_by: null,
        suspension_reason: null,
      })
      .eq('id', targetUserId);

    if (updateError) {
      console.error('Unsuspend user error:', updateError);
      return NextResponse.json({ error: 'Failed to unsuspend user' }, { status: 500 });
    }

    // Reactivate their experiences
    await supabase
      .from('experiences')
      .update({ status: 'active' })
      .eq('user_id', targetUserId)
      .eq('status', 'inactive');

    return NextResponse.json({ success: true, status: 'active' });
  }

  if (action === 'ban') {
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Reason is required for ban' }, { status: 400 });
    }

    // Mark all their experiences as inactive first
    await supabase
      .from('experiences')
      .update({ status: 'inactive' })
      .eq('user_id', targetUserId);

    // Mark pending reports as actioned
    const { data: userExps } = await supabase
      .from('experiences')
      .select('id')
      .eq('user_id', targetUserId);

    if (userExps && userExps.length > 0) {
      await supabase
        .from('reports')
        .update({
          status: 'actioned',
          reviewed_at: now,
          reviewed_by: authUser.id,
        })
        .in('experience_id', userExps.map(e => e.id))
        .eq('status', 'pending');
    }

    // Update user status to banned
    await supabase
      .from('users')
      .update({
        status: 'banned',
        suspended_at: now,
        suspended_by: authUser.id,
        suspension_reason: reason.trim(),
      })
      .eq('id', targetUserId);

    // Delete the auth user (permanently removes their ability to sign in)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUserId);
    if (deleteError) {
      console.error('Ban user auth delete error:', deleteError);
      // Don't fail — the user is already marked as banned in the DB
    }

    return NextResponse.json({ success: true, status: 'banned' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
