'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/lib/hooks/useAuth';

const CATEGORIES = [
  {
    key: 'hotel',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    key: 'bar',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'cafe',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 8h.5a2 2 0 012 2v1a2 2 0 01-2 2h-.5M4 8h12v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8zm4-5v2m4-2v2" />
      </svg>
    ),
  },
  {
    key: 'experience',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="5" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="19" cy="12" r="2" />
      </svg>
    ),
  },
];

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div ref={containerRef} className="fixed bottom-12 right-6 z-50">
      {/* Category menu - vertical list */}
      <div
        className={`
          absolute bottom-16 right-0 mb-2
          flex flex-col gap-2
          transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        {CATEGORIES.map((category, index) => (
          <Link
            key={category.key}
            href={`/${locale}/app/add?category=${category.key}`}
            className={`
              flex items-center gap-3 px-3 py-3
              bg-white rounded-full
              transition-all duration-200 ease-out
              hover:shadow-xl hover:scale-[1.02]
              ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
            `}
            style={{
              transitionDelay: isOpen ? `${(CATEGORIES.length - 1 - index) * 40}ms` : '0ms',
            }}
            onClick={() => setIsOpen(false)}
          >
            {/* Icon */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              {category.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-primary shadow-lg
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          hover:bg-primary/90 hover:shadow-xl hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
        aria-label={isOpen ? t('fab.close') : t('fab.open')}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Image
            src="/assets/indica-ai-icon-white.svg"
            alt="indica aí"
            width={28}
            height={28}
            className="w-7 h-7"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        )}
        {/* Fallback plus icon */}
        <svg
          className={`w-6 h-6 text-white ${isOpen ? 'hidden' : 'hidden'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
