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
      <div className="flex items-center justify-around gap-5 py-3 px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white border-t border-divider md:bg-white md:border md:rounded-2xl md:shadow-lg">
        {navItems.map((item) => {
          const active = isActive(item);
          const href = `/${locale}${item.path}`;
          const isMainButton = item.key === 'add';

          if (isMainButton) {
            return (
              <Link
                key={item.key}
                href={href}
                className="relative flex items-center justify-center -mt-8 md:-mt-0 border-8 border-white rounded-full md:border-0"
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200',
                    !active
                      ? 'bg-primary border-primary shadow-[0_0_16px_rgba(253,81,46,0.3)]'
                      : 'bg-white border-primary shadow-[0_0_16px_rgba(255,255,255,0.8)]'
                  )}
                >
                  <svg
                    className={cn(
                      'w-7 h-7 transition-colors',
                      !active ? 'text-white' : 'text-primary'
                    )}
                    fill="none"
                    viewBox={item.icon.viewBox}
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.icon.path}
                    />
                  </svg>
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.key}
              href={href}
              className={linkStyles(active)}
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
