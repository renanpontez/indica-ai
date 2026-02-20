'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useNotifications } from '../hooks/useNotifications';
import { formatTimeAgo } from '@/lib/utils/format';
import type { Notification } from '@/lib/models';

function NotificationIcon({ type }: { type: Notification['type'] }) {
  if (type === 'experience_deactivated') {
    return (
      <svg className="w-5 h-5 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    );
  }
  return null;
}

function NotificationItem({ notification, t }: { notification: Notification; t: ReturnType<typeof useTranslations> }) {
  const placeName = notification.data?.place_name ?? '';

  return (
    <div className={`px-4 py-3 flex gap-3 ${!notification.read ? 'bg-orange-50/50' : ''}`}>
      <NotificationIcon type={notification.type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark-grey">
          {t(`notifications.types.${notification.type}`, { placeName })}
        </p>
        {notification.body && (
          <p className="text-xs text-medium-grey mt-0.5">
            {t('notifications.reason')}: {notification.body}
          </p>
        )}
        <p className="text-xs text-medium-grey mt-1">
          {formatTimeAgo(notification.created_at)}
        </p>
      </div>
      {!notification.read && (
        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="px-4 py-3 flex gap-3 animate-pulse">
      <div className="w-5 h-5 rounded-full bg-surface flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-surface rounded w-3/4" />
        <div className="h-3 bg-surface rounded w-1/2" />
      </div>
    </div>
  );
}

export function NotificationBell() {
  const t = useTranslations();
  const { notifications, unreadCount, isLoading, markAllRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        className="relative p-2 text-medium-grey hover:text-dark-grey transition-colors"
        aria-label={t('notifications.bell')}
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-primary rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-divider z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
            <h3 className="text-sm font-semibold text-dark-grey">
              {t('notifications.title')}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-divider">
            {isLoading ? (
              <>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg className="w-8 h-8 text-medium-grey mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-medium-grey">
                  {t('notifications.empty')}
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  t={t}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
