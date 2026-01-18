'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Avatar } from './Avatar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from './SearchBar';

export function DesktopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  const isActive = (href: string) => {
    if (href === '/app') {
      return pathname === `/${locale}/app` || pathname.startsWith(`/${locale}/app`);
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-divider">
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-4">
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

{/* Search Bar - only visible for authenticated users */}
          {isAuthenticated && <SearchBar />}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />

            {isLoading || isAuthenticated ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center"
                  >
                    <Avatar src={user?.avatar_url ?? null} alt={user?.display_name ?? ''} size="sm" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-divider py-1 z-50">
                      <Link
                        href={`/${locale}/app/profile/me`}
                        className="block px-4 py-2 text-sm text-dark-grey hover:bg-surface transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {t('nav.profile')}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-dark-grey hover:bg-surface transition-colors"
                      >
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
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
