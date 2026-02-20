import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/getAdminUser';
import { routes, type Locale } from '@/lib/routes';
import { getLocale } from 'next-intl/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  const locale = await getLocale() as Locale;

  if (!admin) {
    redirect(routes.app.feed(locale));
  }

  return <>{children}</>;
}
