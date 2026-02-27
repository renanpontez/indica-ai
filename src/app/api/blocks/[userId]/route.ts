import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

// DELETE /api/blocks/[userId] - Unblock a user
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

  const { error: deleteError } = await supabase
    .from('blocks')
    .delete()
    .eq('blocker_id', authUser.id)
    .eq('blocked_id', userId);

  if (deleteError) {
    console.error('Unblock delete error:', deleteError);
    return NextResponse.json({ error: 'Failed to unblock user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
