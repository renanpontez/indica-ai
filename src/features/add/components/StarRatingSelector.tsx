'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import type { StarRating } from '@/lib/models';

interface StarRatingSelectorProps {
  value: StarRating | null;
  onChange: (value: StarRating) => void;
  error?: string;
  addonSlot?: ReactNode;
}

const STARS = [1, 2, 3, 4, 5] as const;
const SELECTABLE_RATINGS: StarRating[] = [3, 4, 5];

export function StarRatingSelector({ value, onChange, error, addonSlot }: StarRatingSelectorProps) {
  const t = useTranslations('add');

  const tierLabel = value
    ? value === 3
      ? t('ratingTier.neutral')
      : value === 4
        ? t('ratingTier.good')
        : t('ratingTier.excellent')
    : null;

  return (
    <div>
      <div className="flex items-center gap-1">
        {STARS.map((star) => {
          const isSelectable = SELECTABLE_RATINGS.includes(star as StarRating);
          const isFilled = value !== null && star <= value;

          return (
            <button
              key={star}
              type="button"
              disabled={!isSelectable}
              onClick={() => isSelectable && onChange(star as StarRating)}
              className={`transition-colors ${
                isSelectable
                  ? 'cursor-pointer hover:scale-110 transition-transform'
                  : 'cursor-not-allowed opacity-30'
              }`}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill={isFilled ? '#FD512E' : 'none'}
                stroke={isFilled ? '#FD512E' : '#D1D5DB'}
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          );
        })}
        {tierLabel && (
          <span className="ml-1 text-sm font-medium text-primary">{tierLabel}</span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-small text-red-500" role="alert">{error}</p>
      )}
      <div className="mt-2 min-h-[36px]">
        {addonSlot}
      </div>
    </div>
  );
}
