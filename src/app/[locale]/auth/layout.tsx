import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import LandingNavbar from '@/components/LandingNavbar';
import { routes, type Locale } from '@/lib/routes';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow authenticated users through if they're in a password recovery flow
  const cookieStore = await cookies();
  const isPasswordRecovery = cookieStore.get('password_recovery')?.value === 'true';

  if (user && !isPasswordRecovery) {
    redirect(routes.app.feed(typedLocale));
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar locale={typedLocale} showActions={false} />
      <main className="flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
