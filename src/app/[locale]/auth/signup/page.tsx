'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

import { useAuth } from '@/lib/hooks/useAuth';
import SignInForm from './SignUpForm';

export default function SignUpPage() {
  const t = useTranslations('landing');
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect authenticated users to /app
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${locale}/app`);
    }
  }, [authLoading, isAuthenticated, router, locale]);


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
            {t('cta.button')}
          </h1>
          <p className="text-medium-grey text-[0.85rem]">
            {t('cta.title')}
          </p>
        </div>

        <SignInForm />

        <p className="text-center text-[0.85rem] text-medium-grey">
          Já possui uma conta?{' '}
          <Link
            href={`/${locale}/auth/signin`}
            className="text-primary font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div >
  );
}
