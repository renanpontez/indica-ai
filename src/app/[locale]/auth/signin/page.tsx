import SignInContent from './SignInContent';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignInPage({ params }: SignInPageProps) {
  const { locale } = await params;

  return <SignInContent locale={locale} />;
}
