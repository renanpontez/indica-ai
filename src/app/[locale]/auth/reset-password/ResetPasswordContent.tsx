'use client';

import { useTranslations } from 'next-intl';
import ResetPasswordForm from './ResetPasswordForm';

interface ResetPasswordContentProps {
  locale: string;
}

export default function ResetPasswordContent({ locale }: ResetPasswordContentProps) {
  const t = useTranslations('auth.resetPassword');

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
          {t('title')}
        </h1>
        <p className="text-medium-grey text-[0.85rem]">
          {t('subtitle')}
        </p>
      </div>

      <ResetPasswordForm locale={locale} />
    </>
  );
}
