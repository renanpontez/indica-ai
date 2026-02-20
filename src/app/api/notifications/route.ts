import { NextResponse } from 'next/server';
import { createAuthClient, createClient } from '@/lib/supabase/server';

export async function GET() {
  const authSupabase = await createAuthClient();
  const { data: { user } } = await authSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const supabase = await createClient();

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }

  const unreadCount = (notifications ?? []).filter(n => !n.read).length;

  return NextResponse.json({ notifications: notifications ?? [], unreadCount });
}
