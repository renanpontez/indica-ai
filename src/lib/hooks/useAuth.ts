'use client';

import { useAuthContext, type AuthUser } from '@/lib/auth/AuthContext';

// Re-export useAuthContext as useAuth for backward compatibility
// All existing components continue to work without changes
export function useAuth() {
  return useAuthContext();
}

// Re-export types for consumers
export type { AuthUser };
