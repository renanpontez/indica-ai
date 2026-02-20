import { redirect } from 'next/navigation';
import { routes, type Locale } from '@/lib/routes';
import { getLocale } from 'next-intl/server';

export default async function AdminPage() {
  const locale = await getLocale() as Locale;
  redirect(routes.app.admin.experiences(locale));
}
