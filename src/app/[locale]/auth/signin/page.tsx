import SignInContent from './SignInContent';
import type { Locale } from '@/lib/routes';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;

  return <SignInContent locale={locale as Locale} />;
}
