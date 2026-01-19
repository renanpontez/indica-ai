'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider, type AuthUser } from '@/lib/auth/AuthContext';
import { ToastProvider } from '@/lib/toast/ToastContext';
import { ToastContainer } from './ToastContainer';

interface ProvidersProps {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}

export function Providers({ children, initialUser }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={initialUser}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
