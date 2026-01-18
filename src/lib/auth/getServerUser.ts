import { createClient } from '@/lib/supabase/server';
import type { AuthUser } from './AuthContext';

export async function getServerUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  // Fetch user profile from users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (profile) {
    return {
      id: profile.id,
      email: authUser.email || '',
      display_name: profile.display_name,
      username: profile.username,
      avatar_url: profile.avatar_url,
    };
  }

  // Fallback for new users before database trigger runs
  return {
    id: authUser.id,
    email: authUser.email || '',
    display_name:
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'User',
    username:
      authUser.user_metadata?.username ||
      authUser.email?.split('@')[0] ||
      'user',
    avatar_url:
      authUser.user_metadata?.avatar_url ||
      authUser.user_metadata?.picture ||
      null,
  };
}
