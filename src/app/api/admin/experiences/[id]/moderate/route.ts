import { NextResponse } from 'next/server';
import { createAuthClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Use auth client for authentication
  const authSupabase = await createAuthClient();
  const { data: { user: authUser } } = await authSupabase.auth.getUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Use admin client (bypasses RLS) for database operations
  const supabase = createAdminClient();

  // Verify admin role
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

  if (action !== 'deactivate' && action !== 'reactivate') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  if (action === 'deactivate' && !reason?.trim()) {
    return NextResponse.json({ error: 'Reason is required for deactivation' }, { status: 400 });
  }

  // Update experience
  const updateData = action === 'deactivate'
    ? {
        status: 'inactive',
        moderation_reason: reason!.trim(),
        moderated_at: new Date().toISOString(),
        moderated_by: authUser.id,
      }
    : {
        status: 'active',
        moderation_reason: null,
        moderated_at: new Date().toISOString(),
        moderated_by: authUser.id,
      };

  const { data: updated, error: updateError } = await supabase
    .from('experiences')
    .update(updateData)
    .eq('id', id)
    .select('id, status')
    .single();

  if (updateError) {
    console.error('Moderation update error:', updateError);
    return NextResponse.json({ error: 'Failed to moderate experience' }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, status: updated.status });
}
