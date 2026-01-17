'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import Image from 'next/image';
import { Avatar } from './Avatar';

export function DesktopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { user, isAuthenticated } = useAuth();

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === `/${locale}/app` || pathname.startsWith(`/${locale}/app`);
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-divider">
      <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href={`/${locale}/app`} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/indica-ai.svg"
              alt="indica aí logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary hidden lg:block">
              {t('nav.logo')}
            </span>
          </Link>

          {/* TODO: Extract to SearchBar component and fix functionality
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-2xl mx-8">
            <div className="flex items-center border border-divider rounded-full shadow-sm hover:shadow-md transition-shadow bg-white">
              <button className="flex flex-col items-start px-6 py-2 rounded-full hover:bg-surface transition-colors">
                <span className="text-xs font-semibold text-dark-grey">{t('nav.search.where')}</span>
                <span className="text-sm text-medium-grey">{t('nav.search.whereSubtext')}</span>
              </button>
              <div className="h-8 w-[1px] bg-divider"></div>
              <button className="flex flex-col items-start px-6 py-2 hover:bg-surface transition-colors">
                <span className="text-xs font-semibold text-dark-grey">{t('nav.search.who')}</span>
                <span className="text-sm text-medium-grey">{t('nav.search.whoSubtext')}</span>
              </button>
              <button className="flex items-center gap-2 bg-[#FF385C] text-white rounded-full px-4 py-2 ml-2 mr-2 hover:bg-[#E31C5F] transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm font-medium">{t('nav.search.searchButton')}</span>
              </button>
            </div>
          </div>
          */}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={`/${locale}/app/add`}
                  className="hidden lg:block px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                >
                  {t('nav.addPlace')}
                </Link>
                <button
                  onClick={() => router.push(`/${locale}/app/profile/me`)}
                  className="flex items-center"
                >
                  <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
                </button>
              </>
            ) : (
              <Link
                href={`/${locale}/auth/signup`}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
              >
                {t('nav.signUp')}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-divider">
          <div className="flex items-center justify-around py-2">
            <Link
              href={`/${locale}/app`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/app')
                  ? 'text-primary'
                  : 'text-medium-grey hover:text-dark-grey'
              )}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>{t('nav.feed')}</span>
            </Link>
            <Link
              href={`/${locale}/explore`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/explore')
                  ? 'text-primary'
                  : 'text-medium-grey hover:text-dark-grey'
              )}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>{t('nav.explore')}</span>
            </Link>
            <Link
              href={`/${locale}/app/add`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/app/add')
                  ? 'text-primary'
                  : 'text-medium-grey hover:text-dark-grey'
              )}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>{t('nav.add')}</span>
            </Link>
            <Link
              href={`/${locale}/app/profile/me`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/app/profile')
                  ? 'text-primary'
                  : 'text-medium-grey hover:text-dark-grey'
              )}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{t('nav.profile')}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
