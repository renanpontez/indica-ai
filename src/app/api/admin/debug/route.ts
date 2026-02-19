import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' });
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, display_name, username, role')
    .eq('id', authUser.id)
    .single();

  return NextResponse.json({
    authEmail: authUser.email,
    authId: authUser.id,
    profile,
  });
}
