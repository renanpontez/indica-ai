'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUnauthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
  initialUser: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  // Initialize with server-provided data - NO loading state on initial render
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  // Helper to fetch user profile from database
  const fetchUserProfile = useCallback(
    async (authUserId: string, authUserEmail: string | undefined, metadata: Record<string, unknown>): Promise<AuthUser> => {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (profile) {
        return {
          id: profile.id,
          email: authUserEmail || '',
          display_name: profile.display_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
        };
      }

      // Fallback for new users before database trigger runs
      return {
        id: authUserId,
        email: authUserEmail || '',
        display_name:
          (metadata?.full_name as string) ||
          (metadata?.name as string) ||
          authUserEmail?.split('@')[0] ||
          'User',
        username:
          (metadata?.username as string) ||
          authUserEmail?.split('@')[0] ||
          'user',
        avatar_url:
          (metadata?.avatar_url as string) ||
          (metadata?.picture as string) ||
          null,
      };
    },
    [supabase]
  );

  useEffect(() => {
    // Listen for auth changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip initial session - we already have server data
      if (event === 'INITIAL_SESSION') return;

      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoading(true);
        const profile = await fetchUserProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata
        );
        setUser(profile);
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // On token refresh, update user if needed (profile might have changed)
        const profile = await fetchUserProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata
        );
        setUser(profile);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchUserProfile]);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isUnauthenticated: !isLoading && !user,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
