import { NextRequest, NextResponse } from 'next/server';
import { createAuthClient, createAdminClient } from '@/lib/supabase/server';
import { formatTimeAgo } from '@/lib/utils/format';

export async function GET(request: NextRequest) {
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

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Build query
  let query = supabase
    .from('experiences')
    .select(`
      id,
      price_range,
      tags,
      brief_description,
      images,
      created_at,
      user_id,
      place_id,
      visibility,
      status,
      moderation_reason,
      moderated_at,
      moderated_by,
      users:user_id (
        id,
        display_name,
        avatar_url,
        username
      ),
      places:place_id (
        id,
        name,
        city,
        country
      )
    `)
    .order('created_at', { ascending: false });

  // Apply status filter
  if (status === 'active' || status === 'inactive') {
    query = query.eq('status', status);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data: experiences, error } = await query;

  if (error) {
    console.error('Admin experiences fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }

  // Get total count
  let countQuery = supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true });

  if (status === 'active' || status === 'inactive') {
    countQuery = countQuery.eq('status', status);
  }

  const { count: total } = await countQuery;

  // Transform
  const transformed = (experiences || []).map((exp: any) => ({
    id: exp.id,
    brief_description: exp.brief_description,
    images: exp.images || [],
    created_at: exp.created_at,
    time_ago: formatTimeAgo(exp.created_at),
    status: exp.status || 'active',
    moderation_reason: exp.moderation_reason,
    moderated_at: exp.moderated_at,
    visibility: exp.visibility,
    user: {
      id: exp.users?.id || exp.user_id,
      display_name: exp.users?.display_name || 'Unknown User',
      avatar_url: exp.users?.avatar_url || null,
      username: exp.users?.username || null,
    },
    place: {
      id: exp.places?.id || exp.place_id,
      name: exp.places?.name || 'Unknown Place',
      city: exp.places?.city || '',
      country: exp.places?.country || '',
    },
  }));

  return NextResponse.json({
    experiences: transformed,
    total: total || 0,
  });
}
