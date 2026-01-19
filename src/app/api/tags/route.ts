import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/tags - Fetch system tags + user's custom tags
export async function GET() {
  const supabase = await createClient();

  // Get current user (optional - for fetching custom tags)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Build query: system tags OR user's custom tags
  let query = supabase.from('tags').select('*').order('slug');

  if (user) {
    // Fetch system tags + user's custom tags
    query = query.or(`is_system.eq.true,created_by.eq.${user.id}`);
  } else {
    // Only system tags for unauthenticated users
    query = query.eq('is_system', true);
  }

  const { data: tags, error } = await query;

  if (error) {
    console.error('Fetch tags error:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }

  return NextResponse.json(tags);
}

// POST /api/tags - Create a custom tag
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Require authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name } = body; // Accept name (user's original input)

  // Validate name
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }

  // Normalize slug: lowercase, trim, replace spaces with hyphens
  const normalizedSlug = trimmedName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters

  if (!normalizedSlug) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }

  // Check if tag already exists (case-insensitive via slug matching)
  // This covers system tags and any user's custom tag with the same slug
  const { data: existingTag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', normalizedSlug)
    .limit(1)
    .single();

  if (existingTag) {
    // Return existing tag instead of creating duplicate
    return NextResponse.json(existingTag);
  }

  // Create new custom tag with display_name preserving original input
  const { data: tag, error } = await supabase
    .from('tags')
    .insert({
      slug: normalizedSlug,
      display_name: trimmedName, // Preserve original user input
      is_system: false,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Create tag error:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }

  return NextResponse.json(tag, { status: 201 });
}
