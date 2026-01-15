'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { Avatar } from './Avatar';

export function DesktopNav() {
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === `/${locale}`;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `/${locale}/auth/signin` });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-divider">
      <div className="max-w-[1760px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/indica-ai.svg"
              alt="indica aí logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-accent hidden lg:block">
              {t('nav.logo')}
            </span>
          </Link>

          {/* Center: Segmented Search Bar (Airbnb Style) */}
          <div className="hidden lg:flex items-center flex-1 justify-center max-w-2xl mx-8">
            <div className="flex items-center border border-divider rounded-full shadow-sm hover:shadow-md transition-shadow bg-white">
              {/* Where */}
              <button className="flex flex-col items-start px-6 py-2 rounded-full hover:bg-surface transition-colors">
                <span className="text-xs font-semibold text-text-primary">{t('nav.search.where')}</span>
                <span className="text-sm text-text-secondary">{t('nav.search.whereSubtext')}</span>
              </button>

              {/* Divider */}
              <div className="h-8 w-[1px] bg-divider"></div>

              {/* Who */}
              <button className="flex flex-col items-start px-6 py-2 hover:bg-surface transition-colors">
                <span className="text-xs font-semibold text-text-primary">{t('nav.search.who')}</span>
                <span className="text-sm text-text-secondary">{t('nav.search.whoSubtext')}</span>
              </button>

              {/* Search Button */}
              <button className="flex items-center gap-2 bg-[#FF385C] text-white rounded-full px-4 py-2 ml-2 mr-2 hover:bg-[#E31C5F] transition-colors">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm font-medium">{t('nav.search.searchButton')}</span>
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Add Place Button */}
            <Link
              href={`/${locale}/add`}
              className="hidden lg:block px-3 py-2 text-sm font-semibold text-text-primary hover:bg-surface rounded-full transition-colors"
            >
              {t('nav.addPlace')}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 py-1 px-2 pl-3 border border-divider rounded-full hover:shadow-md transition-shadow"
              >
                <svg
                  className="h-4 w-4 text-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {isAuthenticated && user ? (
                  <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-text-secondary flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-divider overflow-hidden z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-3 border-b border-divider">
                        <p className="font-semibold text-text-primary">{user.display_name}</p>
                        <p className="text-sm text-text-secondary">@{user.username}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={`/${locale}/profile/me`}
                          className="block px-4 py-2 text-sm text-text-primary hover:bg-surface"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('nav.profile')}
                        </Link>
                        <Link
                          href={`/${locale}/add`}
                          className="block px-4 py-2 text-sm text-text-primary hover:bg-surface"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('nav.addPlace')}
                        </Link>
                        <hr className="my-1 border-divider" />
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Link
                        href={`/${locale}/auth/signin`}
                        className="block px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        href={`/${locale}/auth/signup`}
                        className="block px-4 py-2 text-sm text-text-primary hover:bg-surface"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-divider">
          <div className="flex items-center justify-around py-2">
            <Link
              href={`/${locale}`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/')
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary'
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
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary'
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
              href={`/${locale}/add`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/add')
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary'
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
              href={`/${locale}/profile/me`}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive('/profile')
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary'
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
