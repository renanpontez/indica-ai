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
  const { slug } = body;

  // Validate slug
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  // Normalize slug: lowercase, trim, replace spaces with hyphens
  const normalizedSlug = slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, ''); // Remove special characters

  if (!normalizedSlug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  // Check if tag already exists (system or user's own)
  const { data: existingTag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', normalizedSlug)
    .or(`is_system.eq.true,created_by.eq.${user.id}`)
    .single();

  if (existingTag) {
    // Return existing tag instead of error (idempotent)
    return NextResponse.json(existingTag);
  }

  // Create new custom tag
  const { data: tag, error } = await supabase
    .from('tags')
    .insert({
      slug: normalizedSlug,
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
