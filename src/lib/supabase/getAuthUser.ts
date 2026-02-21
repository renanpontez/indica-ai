import { headers } from 'next/headers';
import type { SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Gets the authenticated user from either cookies (web) or Bearer token (mobile).
 * Tries cookie-based auth first, then falls back to Authorization header.
 */
export async function getAuthUser(supabase: SupabaseClient): Promise<User | null> {
  // Try cookie-based auth first (web)
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user;

  // Fall back to Bearer token (mobile)
  const headerStore = await headers();
  const authHeader = headerStore.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const { data: { user: tokenUser } } = await supabase.auth.getUser(token);
    return tokenUser;
  }

  return null;
}
