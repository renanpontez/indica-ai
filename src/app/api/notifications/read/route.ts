import { NextResponse } from 'next/server';
import { createAuthClient, createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const authSupabase = await createAuthClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { notificationIds } = body as { notificationIds?: string[] };

  const supabase = await createClient();

  let query = supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.id);

  if (notificationIds && notificationIds.length > 0) {
    query = query.in('id', notificationIds);
  } else {
    query = query.eq('read', false);
  }

  const { error } = await query;

  if (error) {
    console.error('Failed to mark notifications as read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
