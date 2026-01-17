'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      setSupabaseUser(authUser);

      if (authUser) {
        // Fetch user profile from our users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: authUser.email || '',
            display_name: profile.display_name,
            username: profile.username,
            avatar_url: profile.avatar_url,
          });
        } else {
          // User exists in auth but not in users table yet
          // This can happen right after sign up before the trigger runs
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            display_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
            username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'user',
            avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
          });
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: session.user.email || '',
            display_name: profile.display_name,
            username: profile.username,
            avatar_url: profile.avatar_url,
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user',
            avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          });
        }
      } else {
        setSupabaseUser(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    user,
    supabaseUser,
    isAuthenticated: !!user,
    isLoading,
    isUnauthenticated: !isLoading && !user,
  };
}
