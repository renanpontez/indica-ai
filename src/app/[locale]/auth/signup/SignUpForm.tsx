'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { routes, type Locale } from '@/lib/routes';

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const callbackUrl = searchParams.get('callbackUrl') || routes.app.feed(locale as Locale);
  const router = useRouter();
  const t = useTranslations('auth.signUp');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    display_name: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('errors.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('errors.passwordTooShort'));
      return;
    }

    if (formData.display_name.length < 2) {
      setError(t('errors.displayNameTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          display_name: formData.display_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('errors.generic'));
        setIsLoading(false);
        return;
      }

      // Handle different signup outcomes
      if (data.requiresEmailConfirmation) {
        setError(data.message || t('errors.generic'));
        setIsLoading(false);
        return;
      }

      if (data.requiresSignIn) {
        // Redirect to signin
        router.push(routes.auth.signin(locale as Locale));
        return;
      }

      // Success - redirect to app
      router.push(routes.app.feed(locale as Locale));
      router.refresh();
    } catch {
      setError(t('errors.generic'));
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError('');
    setIsLoading(true);

    const redirectTo = callbackUrl
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(callbackUrl)}`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    // Redirect to server-side OAuth endpoint
    window.location.href = `/api/auth/oauth/google?redirectTo=${encodeURIComponent(redirectTo)}`;
  };
  return (
    <div className="bg-surface rounded-[14px] p-6 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-[0.85rem]">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="display_name"
            className="block text-dark-grey text-[0.85rem] font-medium mb-2"
          >
            {t('displayName')}
          </label>
          <Input
            id="display_name"
            type="text"
            value={formData.display_name}
            onChange={(e) => handleChange('display_name', e.target.value)}
            placeholder={t('displayNamePlaceholder')}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-dark-grey text-[0.85rem] font-medium mb-2"
          >
            {t('email')}
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={t('emailPlaceholder')}
            required
            disabled={isLoading}
          />
        </div>

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
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            minLength={6}
          />
          {passwordFocused && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}>
                {formData.password.length >= 6 && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-[0.75rem] ${formData.password.length >= 6 ? 'text-green-600' : 'text-medium-grey'}`}>
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
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onFocus={() => setConfirmPasswordFocused(true)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          {confirmPasswordFocused && formData.confirmPassword.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${formData.password === formData.confirmPassword ? 'bg-green-500' : 'bg-red-500'}`}>
                {formData.password === formData.confirmPassword ? (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <span className={`text-[0.75rem] ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {formData.password === formData.confirmPassword ? t('validation.passwordsMatch') : t('validation.passwordsNoMatch')}
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
          {isLoading ? t('creatingAccount') : t('createAccountButton')}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-divider" />
        </div>
        <div className="relative flex justify-center text-[0.85rem]">
          <span className="px-4 bg-surface text-medium-grey">
            {t('orContinueWith')}
          </span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-divider rounded-lg px-4 py-3 text-dark-grey font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {t('googleButton')}
      </button>
    </div>
  )
}