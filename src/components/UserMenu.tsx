'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar } from './Avatar';
import { routes, type Locale } from '@/lib/routes';

export function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!user) return null;

  const typedLocale = locale as Locale;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (response.ok) {
        router.push(routes.auth.signin(typedLocale));
        router.refresh();
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const menuLinkClass = 'flex items-center gap-3 w-full px-3 py-2.5 text-dark-grey hover:bg-surface rounded-lg transition-colors text-[0.85rem]';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        <Avatar
          src={user.avatar_url}
          alt={user.display_name}
          size="sm"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-[14px] shadow-lg border border-divider overflow-hidden z-50">
          {/* User info */}
          <div className="p-4 border-b border-divider">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.avatar_url}
                alt={user.display_name}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-dark-grey font-medium truncate">
                  {user.display_name}
                </p>
                <p className="text-medium-grey text-[0.85rem] truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="p-2 border-b border-divider">
            <Link
              href={routes.app.profile.me(typedLocale)}
              onClick={() => setIsOpen(false)}
              className={menuLinkClass}
            >
              <svg className="h-5 w-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {t('menu.viewProfile')}
            </Link>
            <Link
              href={routes.app.profile.me(typedLocale, { tab: 'bookmarks' })}
              onClick={() => setIsOpen(false)}
              className={menuLinkClass}
            >
              <svg className="h-5 w-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              {t('menu.bookmarks')}
            </Link>
            <Link
              href={routes.app.settings.blockedUsers(typedLocale)}
              onClick={() => setIsOpen(false)}
              className={menuLinkClass}
            >
              <svg className="h-5 w-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              {t('menu.blockedUsers')}
            </Link>
          </div>

          {/* Sign out */}
          <div className="p-2">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-dark-grey hover:bg-surface rounded-lg transition-colors text-[0.85rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              {isSigningOut ? '...' : t('signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
