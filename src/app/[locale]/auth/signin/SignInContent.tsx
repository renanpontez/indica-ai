'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SignInForm from './SignInForm';
import { routes, type Locale } from '@/lib/routes';

interface SignInContentProps {
  locale: Locale;
}

export default function SignInContent({ locale }: SignInContentProps) {
  const t = useTranslations('auth.signIn');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
          {t('title')}
        </h1>
        <p className="text-medium-grey text-[0.85rem]">
          {t('subtitle')}
        </p>
      </div>

      <SignInForm />

      <p className="text-center text-[0.85rem] text-medium-grey">
        {t('noAccount')}{' '}
        <Link
          href={routes.auth.signup(locale)}
          className="text-primary font-medium hover:underline"
        >
          {t('createAccount')}
        </Link>
      </p>
    </>
  );
}
