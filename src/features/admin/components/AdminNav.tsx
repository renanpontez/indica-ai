'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { routes, type Locale } from '@/lib/routes';

const tabs = [
  { key: 'dashboard', getHref: (locale: Locale) => routes.app.admin.dashboard(locale), exact: true },
  { key: 'experiences', getHref: (locale: Locale) => routes.app.admin.experiences(locale) },
  { key: 'reports', getHref: (locale: Locale) => routes.app.admin.reports(locale) },
  { key: 'flaggedUsers', getHref: (locale: Locale) => routes.app.admin.flaggedUsers(locale) },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations('admin.nav');

  return (
    <div className="flex gap-1 bg-surface rounded-lg p-1 w-fit">
      {tabs.map(({ key, getHref, ...rest }) => {
        const href = getHref(locale);
        const exact = 'exact' in rest && rest.exact;
        const isActive = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'));

        return (
          <Link
            key={key}
            href={href}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-white text-dark-grey shadow-sm'
                : 'text-medium-grey hover:text-dark-grey'
            }`}
          >
            {t(key)}
          </Link>
        );
      })}
    </div>
  );
}
