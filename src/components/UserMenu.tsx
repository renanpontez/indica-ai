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
              href={routes.app.profile.me(typedLocale)}
              onClick={() => setIsOpen(false)}
              className={menuLinkClass}
            >
              <svg className="h-5 w-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('menu.settings')}
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
