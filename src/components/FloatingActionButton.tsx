'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar } from './Avatar';
import { navItems } from '@/lib/routes';

export function FloatingActionButton() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { user } = useAuth();

  const isActive = (item: (typeof navItems)[number]) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    switch (item.key) {
      case 'explore':
        return pathWithoutLocale.startsWith('/app/explore');
      case 'feed':
        return pathWithoutLocale.startsWith('/app/feed') || pathWithoutLocale === '/app';
      case 'profile':
        return pathWithoutLocale.startsWith('/app/profile');
      default:
        return pathWithoutLocale.startsWith(item.path);
    }
  };

  const linkStyles = (active: boolean) =>
    cn(
      'relative flex flex-col items-center justify-center p-2 transition-all duration-200 group w-16',
      active ? 'text-primary' : 'text-medium-grey hover:text-dark-grey'
    );

  const iconStyles = (active: boolean) =>
    cn('w-6 h-6 transition-transform', active ? 'scale-110' : 'group-hover:scale-105');

  return (
    <nav className="fixed bottom-0 md:bottom-6 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:right-auto z-20">
      <div className="flex items-center justify-around gap-5 py-3 px-6 bg-white border-t md:border border-divider md:rounded-2xl md:shadow-lg">
        {navItems.map((item) => {
          const active = isActive(item);
          const href = `/${locale}${item.path}`;
          const isMainButton = item.key === 'add';

          return (
            <Link
              key={item.key}
              href={href}
              className={
                cn(
                  linkStyles(active),
                  isMainButton && 'bg-primary border-transparent border text-white rounded-md px-4 py-2 font-medium hover:text-primary hover:bg-white hover:border hover:border-primary',
                  isMainButton && active && 'bg-white text-primary'
                )
              }
            >
              {item.useAvatar ? (
                <Avatar
                  src={user?.avatar_url ?? null}
                  alt={user?.display_name ?? ''}
                  size="sm"
                  className="w-6 h-6"
                />
              ) : (
                <svg
                  className={iconStyles(active)}
                  fill="none"
                  viewBox={item.icon.viewBox}
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon.path}
                  />
                </svg>
              )}
              <span className="text-[10px] mt-1 font-medium">
                {t(item.translationKey)}
              </span>
              {active && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
