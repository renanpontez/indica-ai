'use client';

import { useTranslations } from 'next-intl';
import type { ExperienceVisibility } from '@/lib/models';

interface VisibilityBadgeProps {
  visibility: ExperienceVisibility;
}

export function VisibilityBadge({ visibility }: VisibilityBadgeProps) {
  const t = useTranslations('add.visibility');

  const isPublic = visibility === 'public';

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
        isPublic ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
      }`}
    >
      {isPublic ? (
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
      <span>{isPublic ? t('public') : t('friendsOnly')}</span>
    </div>
  );
}
