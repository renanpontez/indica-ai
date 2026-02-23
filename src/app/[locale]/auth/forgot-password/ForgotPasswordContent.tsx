'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ForgotPasswordForm from './ForgotPasswordForm';

interface ForgotPasswordContentProps {
  locale: string;
}

export default function ForgotPasswordContent({ locale }: ForgotPasswordContentProps) {
  const t = useTranslations('auth.forgotPassword');

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
          {t('title')}
        </h1>
        <p className="text-medium-grey text-[0.85rem]">
          {t('subtitle')}
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-[0.85rem] text-medium-grey">
        <Link
          href={`/${locale}/auth/signin`}
          className="text-primary font-medium hover:underline"
        >
          {t('backToSignIn')}
        </Link>
      </p>
    </div>
  );
}
