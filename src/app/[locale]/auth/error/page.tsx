import Link from 'next/link';
import { Button } from '@/components/Button';

interface AuthErrorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthErrorPage({ params, searchParams }: AuthErrorPageProps) {
  const { locale } = await params;
  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    OAuthCallbackError: 'There was a problem signing in with your account. Please try again.',
    AccessDenied: 'You do not have permission to sign in.',
    Configuration: 'There is a problem with the server configuration.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication. Please try again.',
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface rounded-[14px] p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-[1.4rem] font-semibold text-dark-grey mb-2">
            Authentication Error
          </h1>
          <p className="text-medium-grey text-[0.85rem] mb-6">
            {errorMessage}
          </p>

          <div className="space-y-3">
            <Link href={`/${locale}/auth/signin`} className="block">
              <Button className="w-full">
                Back to Sign In
              </Button>
            </Link>
            <Link href={`/${locale}`} className="block">
              <button className="w-full text-primary text-[0.85rem] font-medium hover:underline">
                Go to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
