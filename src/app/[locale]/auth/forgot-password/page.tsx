import ForgotPasswordContent from './ForgotPasswordContent';

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params;

  return <ForgotPasswordContent locale={locale} />;
}
