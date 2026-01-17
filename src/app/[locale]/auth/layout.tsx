import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LandingNavbar from '@/components/LandingNavbar';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}/app`);
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar locale={locale} showActions={false} />
      <main className="flex items-center justify-center px-4 py-8" style={{ minHeight: 'calc(100vh - 73px)' }}>
        {children}
      </main>
    </div>
  );
}
