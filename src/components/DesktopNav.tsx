'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import Image from 'next/image';
import { Avatar } from './Avatar';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from './SearchBar';

export function DesktopNav() {
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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-divider">
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-4">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href={`/${locale}/app`} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/indica-ai.svg"
              alt="Indica Aí logo"
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
                  </div>
                )}
              </div>
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
      </div>
    </nav>
  );
}
