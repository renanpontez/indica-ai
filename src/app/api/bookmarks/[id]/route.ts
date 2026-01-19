import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE /api/bookmarks/[id] - Delete a bookmark
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Verify the bookmark belongs to the current user
  const { data: bookmark, error: fetchError } = await supabase
    .from('bookmarks')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (fetchError || !bookmark) {
    return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
  }

  if (bookmark.user_id !== authUser.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  // Delete the bookmark
  const { error: deleteError } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Bookmark delete error:', deleteError);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
