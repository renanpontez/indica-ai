'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';
import { Avatar } from './Avatar';

export function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
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

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (response.ok) {
        router.push(`/${locale}/auth/signin`);
        router.refresh();
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

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

          <div className="p-2">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-3 py-2 text-dark-grey hover:bg-surface rounded-lg transition-colors text-[0.85rem] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
