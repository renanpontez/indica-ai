import ResetPasswordContent from './ResetPasswordContent';

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale } = await params;

  return <ResetPasswordContent locale={locale} />;
}
