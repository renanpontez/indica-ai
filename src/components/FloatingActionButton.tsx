'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar } from './Avatar';

export function FloatingActionButton() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/app') {
      return (
        pathname === `/${locale}/app` ||
        (pathname.startsWith(`/${locale}/app`) &&
          !pathname.includes('/add') &&
          !pathname.includes('/explore') &&
          !pathname.includes('/profile'))
      );
    }
    return pathname.startsWith(`/${locale}${path}`);
  };

  const linkStyles = (active: boolean) =>
    cn(
      'flex flex-col items-center justify-center p-2 transition-all duration-200 group',
      active ? 'text-primary' : 'text-medium-grey hover:text-dark-grey'
    );

  const iconStyles = (active: boolean) =>
    cn('w-6 h-6 transition-transform', active ? 'scale-110' : 'group-hover:scale-105');

  return (
    <nav className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto z-50">
      <div className="flex items-center justify-around gap-5 py-3 px-6 bg-white border-t md:border border-divider md:rounded-2xl md:shadow-lg">
        {/* Home */}
        <Link href={`/${locale}/app`} className={linkStyles(isActive('/app'))}>
          <svg
            className={iconStyles(isActive('/app'))}
            fill={isActive('/app') ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={isActive('/app') ? 0 : 1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="text-[10px] mt-1 font-medium">{t('feed')}</span>
        </Link>

        {/* Explore */}
        <Link
          href={`/${locale}/app/explore`}
          className={linkStyles(isActive('/app/explore'))}
        >
          <svg
            className={iconStyles(isActive('/app/explore'))}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span className="text-[10px] mt-1 font-medium">{t('explore')}</span>
        </Link>

        {/* Add */}
        <Link
          href={`/${locale}/app/add`}
          className={linkStyles(isActive('/app/add'))}
        >
          <svg
            className={iconStyles(isActive('/app/add'))}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-[10px] mt-1 font-medium">{t('add')}</span>
        </Link>

        {/* Profile */}
        <Link
          href={`/${locale}/app/profile/me`}
          className={linkStyles(isActive('/app/profile'))}
        >
          <Avatar
            src={user?.avatar_url ?? null}
            alt={user?.display_name ?? ''}
            size="sm"
            className={cn(
              'w-6 h-6 ring-2 transition-all',
              isActive('/app/profile') ? 'ring-primary' : 'ring-transparent'
            )}
          />
          <span className="text-[10px] mt-1 font-medium">{t('profile')}</span>
        </Link>
      </div>
    </nav>
  );
}
