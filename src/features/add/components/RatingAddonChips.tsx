'use client';

import { useTranslations } from 'next-intl';
import { Chip } from '@/components/Chip';
import { getRatingTier, RATING_ADDON_SLUGS } from '@/lib/constants/rating-addons';
import type { StarRating } from '@/lib/models';

interface RatingAddonChipsProps {
  rating: StarRating;
  value: string[];
  onChange: (value: string[]) => void;
}

export function RatingAddonChips({ rating, value, onChange }: RatingAddonChipsProps) {
  const t = useTranslations('add');
  const tier = getRatingTier(rating);
  const addons = RATING_ADDON_SLUGS[tier];

  const toggleAddon = (slug: string) => {
    if (value.includes(slug)) {
      onChange(value.filter((s) => s !== slug));
    } else {
      onChange([...value, slug]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {addons.map((slug) => (
        <Chip
          key={slug}
          label={t(`ratingAddons.${slug}`)}
          active={value.includes(slug)}
          onClick={() => toggleAddon(slug)}
        />
      ))}
    </div>
  );
}
