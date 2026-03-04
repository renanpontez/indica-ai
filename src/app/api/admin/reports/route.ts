import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || 'pending';

  // Fetch reports with experience and reporter info
  let query = supabase
    .from('reports')
    .select(`
      id,
      reporter_id,
      experience_id,
      reason,
      description,
      created_at,
      status,
      reviewed_at,
      reviewed_by,
      users:reporter_id (
        id,
        display_name,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: reports, error } = await query;

  if (error) {
    console.error('Admin reports fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }

  // Get unique experience IDs to fetch experience + place info
  const experienceIds = [...new Set((reports || []).map(r => r.experience_id))];

  const { data: experiences } = await supabase
    .from('experiences')
    .select(`
      id,
      status,
      user_id,
      images,
      users:user_id (
        id,
        display_name,
        username,
        avatar_url
      ),
      places:place_id (
        id,
        name,
        city,
        country
      )
    `)
    .in('id', experienceIds.length > 0 ? experienceIds : ['__none__']);

  const experienceMap = new Map((experiences || []).map((e: any) => [e.id, e]));

  // Group reports by experience
  const groupMap = new Map<string, {
    experience_id: string;
    experience: any;
    reports: any[];
    report_count: number;
    latest_report_at: string;
  }>();

  for (const report of reports || []) {
    const existing = groupMap.get(report.experience_id);
    const exp = experienceMap.get(report.experience_id);

    if (existing) {
      existing.reports.push(report);
      existing.report_count++;
      if (report.created_at && report.created_at > existing.latest_report_at) {
        existing.latest_report_at = report.created_at;
      }
    } else {
      groupMap.set(report.experience_id, {
        experience_id: report.experience_id,
        experience: exp ? {
          id: exp.id,
          status: exp.status,
          images: exp.images || [],
          user: {
            id: exp.users?.id || exp.user_id,
            display_name: exp.users?.display_name || 'Unknown',
            username: exp.users?.username || null,
            avatar_url: exp.users?.avatar_url || null,
          },
          place: {
            id: exp.places?.id,
            name: exp.places?.name || 'Unknown Place',
            city: exp.places?.city || '',
            country: exp.places?.country || '',
          },
        } : null,
        reports: [report],
        report_count: 1,
        latest_report_at: report.created_at || '',
      });
    }
  }

  // Sort groups by report count desc
  const groups = Array.from(groupMap.values()).sort((a, b) => b.report_count - a.report_count);

  // Transform reports within groups
  const transformedGroups = groups.map(group => ({
    ...group,
    reports: group.reports.map((r: any) => ({
      id: r.id,
      reason: r.reason,
      description: r.description,
      created_at: r.created_at,
      status: r.status,
      reporter: {
        id: r.users?.id || r.reporter_id,
        display_name: r.users?.display_name || 'Unknown',
        username: r.users?.username || null,
        avatar_url: r.users?.avatar_url || null,
      },
    })),
  }));

  return NextResponse.json({ groups: transformedGroups });
}
