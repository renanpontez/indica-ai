import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/supabase/getAuthUser';

// GET /api/blocks/[userId]/status - Check if current user has blocked the target user
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();

  const authUser = await getAuthUser(supabase);

  if (!authUser) {
    return NextResponse.json({ isBlocked: false });
  }

  const { data: block } = await supabase
    .from('blocks')
    .select('id')
    .eq('blocker_id', authUser.id)
    .eq('blocked_id', userId)
    .single();

  return NextResponse.json({ isBlocked: !!block });
}
