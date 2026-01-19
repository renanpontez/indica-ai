import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: Request) {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { display_name, username, avatar_url } = body;

    // Validate input
    if (!display_name || !username) {
      return NextResponse.json({ error: 'Display name and username are required' }, { status: 400 });
    }

    // Check if username is already taken by another user
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .neq('id', authUser.id)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    // Build update object
    const updateData: { display_name: string; username: string; avatar_url?: string } = {
      display_name,
      username,
    };
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    // Update user profile
    const { data: updatedProfile, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', authUser.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      id: updatedProfile.id,
      display_name: updatedProfile.display_name,
      username: updatedProfile.username,
      avatar_url: updatedProfile.avatar_url,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
