import { NextResponse } from 'next/server';
import { createClient, createAuthClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

export async function DELETE() {
  const supabase = await createClient();
  const user = await getAuthUser(supabase);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delete user via admin API (cascades to all related data)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }

  // Sign out the session
  const authClient = await createAuthClient();
  await authClient.auth.signOut();

  return NextResponse.json({ success: true });
}
