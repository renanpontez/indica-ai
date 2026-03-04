import { NextResponse } from 'next/server';
import { createAuthClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
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

  // Get all blocks grouped by blocked_id with count
  const { data: blocks, error: blocksError } = await supabase
    .from('blocks')
    .select('blocked_id');

  if (blocksError) {
    console.error('Flagged users blocks fetch error:', blocksError);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }

  // Count blocks per user
  const blockCounts = new Map<string, number>();
  for (const block of blocks || []) {
    blockCounts.set(block.blocked_id, (blockCounts.get(block.blocked_id) || 0) + 1);
  }

  // Filter to users with 10+ blocks
  const flaggedUserIds = Array.from(blockCounts.entries())
    .filter(([, count]) => count >= 10)
    .map(([userId]) => userId);

  if (flaggedUserIds.length === 0) {
    return NextResponse.json({ users: [] });
  }

  // Fetch user details
  const { data: users } = await supabase
    .from('users')
    .select('id, display_name, username, avatar_url, status, created_at')
    .in('id', flaggedUserIds);

  // Get experience counts per user
  const { data: experiences } = await supabase
    .from('experiences')
    .select('user_id')
    .in('user_id', flaggedUserIds)
    .eq('status', 'active');

  const experienceCounts = new Map<string, number>();
  for (const exp of experiences || []) {
    experienceCounts.set(exp.user_id, (experienceCounts.get(exp.user_id) || 0) + 1);
  }

  // Get report counts per user (reports on their experiences)
  const { data: reportedExps } = await supabase
    .from('experiences')
    .select('id, user_id')
    .in('user_id', flaggedUserIds);

  const userExperienceIds = new Map<string, string[]>();
  for (const exp of reportedExps || []) {
    const ids = userExperienceIds.get(exp.user_id) || [];
    ids.push(exp.id);
    userExperienceIds.set(exp.user_id, ids);
  }

  const allExpIds = Array.from(userExperienceIds.values()).flat();
  const reportCounts = new Map<string, number>();

  if (allExpIds.length > 0) {
    const { data: reports } = await supabase
      .from('reports')
      .select('experience_id')
      .in('experience_id', allExpIds)
      .eq('status', 'pending');

    for (const report of reports || []) {
      // Find which user owns this experience
      for (const [userId, expIds] of userExperienceIds.entries()) {
        if (expIds.includes(report.experience_id)) {
          reportCounts.set(userId, (reportCounts.get(userId) || 0) + 1);
          break;
        }
      }
    }
  }

  // Build response
  const flaggedUsers = (users || [])
    .map(user => ({
      id: user.id,
      display_name: user.display_name,
      username: user.username,
      avatar_url: user.avatar_url,
      status: user.status || 'active',
      created_at: user.created_at,
      block_count: blockCounts.get(user.id) || 0,
      experience_count: experienceCounts.get(user.id) || 0,
      report_count: reportCounts.get(user.id) || 0,
    }))
    .sort((a, b) => b.block_count - a.block_count);

  return NextResponse.json({ users: flaggedUsers });
}
