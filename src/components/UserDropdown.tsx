'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Avatar } from './Avatar';
import type { AuthUser } from '@/lib/auth/AuthContext';

interface UserDropdownProps {
  user: AuthUser;
  locale: string;
}

export function UserDropdown({ user, locale }: UserDropdownProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
      >
        <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-divider py-1 z-50">
          <Link
            href={`/${locale}/app/profile/me`}
            className="block px-4 py-2 text-sm text-dark-grey hover:bg-surface transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {t('nav.profile')}
          </Link>
        </div>
      )}
    </div>
  );
}
