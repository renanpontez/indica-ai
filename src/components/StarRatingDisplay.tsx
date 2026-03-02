'use client';

import { useTranslations } from 'next-intl';
import { Chip } from '@/components/Chip';

interface StarRatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md';
  showAddons?: boolean;
  addons?: string[];
}

export function StarRatingDisplay({
  rating,
  size = 'sm',
  showAddons = false,
  addons = [],
}: StarRatingDisplayProps) {
  const t = useTranslations('add');
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={starSize}
            viewBox="0 0 24 24"
            fill={star <= rating ? '#FD512E' : '#D1D5DB'}
            stroke="none"
          >
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>
      {showAddons && addons.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {addons.map((slug) => (
            <Chip key={slug} label={t(`ratingAddons.${slug}`)} variant="outlined" />
          ))}
        </div>
      )}
    </div>
  );
}
