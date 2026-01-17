'use client';

import { useEffect } from 'react';
import { useRouter} from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { useAuth } from '@/lib/hooks/useAuth';
import SignInForm from './SignInForm';

export default function SignInPage() {
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect authenticated users to /app
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${locale}/app`);
    }
  }, [isAuthenticated, router, locale]);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-medium-grey text-[0.85rem]">
            Entre para compartilhar suas experiências com seus amigos
          </p>
        </div>

        <SignInForm />

        <p className="text-center text-[0.85rem] text-medium-grey">
          Não tem uma conta? {' '}
          <Link
            href={`/${locale}/auth/signup`}
            className="text-primary font-medium hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
