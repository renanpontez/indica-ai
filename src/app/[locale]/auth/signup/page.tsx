import SignUpContent from './SignUpContent';

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;

  return <SignUpContent locale={locale} />;
}
