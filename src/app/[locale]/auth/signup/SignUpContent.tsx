'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SignUpForm from './SignUpForm';

interface SignUpContentProps {
  locale: string;
}

export default function SignUpContent({ locale }: SignUpContentProps) {
  const t = useTranslations('landing');
  const tAuth = useTranslations('auth.signUp');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
          {t('cta.button')}
        </h1>
        <p className="text-medium-grey text-[0.85rem]">
          {t('cta.title')}
        </p>
      </div>

      <SignUpForm />

      <p className="text-center text-[0.85rem] text-medium-grey">
        {tAuth('hasAccount')}{' '}
        <Link
          href={`/${locale}/auth/signin`}
          className="text-primary font-medium hover:underline"
        >
          {tAuth('signIn')}
        </Link>
      </p>
    </>
  );
}
