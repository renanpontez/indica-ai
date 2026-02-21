import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

export async function GET() {
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);
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
