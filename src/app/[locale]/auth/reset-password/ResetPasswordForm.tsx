'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Link from 'next/link';

interface ResetPasswordFormProps {
  locale: string;
}

export default function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const router = useRouter();
  const t = useTranslations('auth.resetPassword');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('errors.passwordTooShort'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('errors.passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'link_expired') {
          setIsExpired(true);
          setError(t('errors.linkExpired'));
        } else {
          setError(t('errors.generic'));
        }
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/auth/signin`);
      }, 2000);
    } catch {
      setError(t('errors.generic'));
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-surface rounded-[14px] p-6 mb-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-[1.1rem] font-semibold text-dark-grey mb-2">
            {t('successTitle')}
          </h2>
          <p className="text-medium-grey text-[0.85rem]">
            {t('successMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[14px] p-6 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-[0.85rem]">
            {error}
          </div>
        )}

        {isExpired && (
          <div className="text-center">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-primary font-medium hover:underline text-[0.85rem]"
            >
              {t('errors.linkExpired')}
            </Link>
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="block text-dark-grey text-[0.85rem] font-medium mb-2"
          >
            {t('password')}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            minLength={6}
          />
          {passwordFocused && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {password.length >= 6 && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-[0.75rem] ${password.length >= 6 ? 'text-green-600' : 'text-medium-grey'}`}>
                {t('validation.minChars')}
              </span>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-dark-grey text-[0.85rem] font-medium mb-2"
          >
            {t('confirmPassword')}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmPasswordFocused(true)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          {confirmPasswordFocused && confirmPassword.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`}>
                {password === confirmPassword ? (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <span className={`text-[0.75rem] ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {password === confirmPassword ? t('validation.passwordsMatch') : t('validation.passwordsNoMatch')}
              </span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('resetting') : t('resetButton')}
        </Button>
      </form>
    </div>
  );
}
