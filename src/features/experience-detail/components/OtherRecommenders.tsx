'use client';

import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { useTranslations } from 'next-intl';
import type { OtherRecommender } from '@/lib/models';
import { generateExperienceSlug } from '@/lib/utils/format';

interface OtherRecommendersProps {
  recommenders: OtherRecommender[];
  placeName: string;
  placeCity: string;
}

export function OtherRecommenders({
  recommenders,
  placeName,
  placeCity,
}: OtherRecommendersProps) {
  const t = useTranslations('experience');

  if (recommenders.length === 0) {
    return null;
  }

  const slug = generateExperienceSlug(placeName, placeCity);

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        {t('otherRecommenders.title', { count: recommenders.length })}
      </h2>
      <div className="flex flex-wrap gap-3">
        {recommenders.map((recommender) => (
          <Link
            key={recommender.id}
            href={`/app/experience/${recommender.experience_id}/${slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface hover:bg-divider transition-colors"
          >
            <Avatar
              src={recommender.avatar_url}
              alt={recommender.display_name}
              size="xs"
            />
            <span className="text-sm font-medium text-text-primary">
              {recommender.display_name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
