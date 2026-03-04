import { NextResponse } from 'next/server';
import { createAuthClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
  const { scope } = body as { scope?: 'single' | 'all' };

  const now = new Date().toISOString();

  if (scope === 'all') {
    // First get the experience_id from this report
    const { data: report } = await supabase
      .from('reports')
      .select('experience_id')
      .eq('id', id)
      .single();

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Dismiss all pending reports for this experience
    const { error } = await supabase
      .from('reports')
      .update({
        status: 'dismissed',
        reviewed_at: now,
        reviewed_by: authUser.id,
      })
      .eq('experience_id', report.experience_id)
      .eq('status', 'pending');

    if (error) {
      console.error('Dismiss all reports error:', error);
      return NextResponse.json({ error: 'Failed to dismiss reports' }, { status: 500 });
    }
  } else {
    // Dismiss single report
    const { error } = await supabase
      .from('reports')
      .update({
        status: 'dismissed',
        reviewed_at: now,
        reviewed_by: authUser.id,
      })
      .eq('id', id)
      .eq('status', 'pending');

    if (error) {
      console.error('Dismiss report error:', error);
      return NextResponse.json({ error: 'Failed to dismiss report' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
