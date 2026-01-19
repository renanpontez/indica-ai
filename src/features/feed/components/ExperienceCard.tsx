'use client';

import { Avatar } from '@/components/Avatar';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import { useTagLabel } from '@/hooks/useTagLabel';
import { useTranslations } from 'next-intl';
import type { ExperienceFeedItem } from '@/lib/models';

interface ExperienceCardProps {
  experience: ExperienceFeedItem;
  onClick: () => void;
  onBookmarkToggle?: () => void;
}

export function ExperienceCard({
  experience,
  onClick,
  onBookmarkToggle,
}: ExperienceCardProps) {
  const { user, place, price_range, tags, time_ago, description } = experience;
  const { getTagLabel } = useTagLabel();
  const t = useTranslations('place');

  return (
    <article
      className="group cursor-pointer bg-white rounded-xl border border-divider overflow-hidden transition-all hover:shadow-lg"
      onClick={onClick}
    >
      {/* User Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
          <div>
            <p className="text-sm font-semibold text-dark-grey">
              {user.display_name}
            </p>
            <p className="text-xs text-medium-grey">{time_ago}</p>
          </div>
        </div>
        {onBookmarkToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle();
            }}
            className="p-2 hover:bg-surface rounded-full transition-colors"
            aria-label="Bookmark this place"
          >
            <svg
              className="h-5 w-5 text-medium-grey"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Horizontal Content */}
      <div className="flex px-4 pb-4 gap-4">
        {/* Image with Price Badge */}
        <div className="relative w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-surface">
          <img
            src={place.thumbnail_image_url || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop`}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Recommendation count */}
          {place.recommendation_count && place.recommendation_count > 1 && (
            <div className="flex items-center gap-1 text-xs text-white absolute left-2 top-2">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{t('recommendationCount', { count: place.recommendation_count })}</span>
            </div>
          )}
        </div>

        {/* Place Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0 mb-2">
            {/* Place Name */}
            <h3 className="text-base font-semibold text-dark-grey line-clamp-1">
              {place.name}
            </h3>
            {/* Location */}
            <p className="text-sm text-medium-grey">
              {place.city_short}, {place.country}
            </p>
          </div>

          {/* Instagram Handle */}
          {place.instagram && (
            <p className="text-sm text-medium-grey mb-1">
              @{place.instagram}
            </p>
          )}



          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-primary border border-primary"
              >
                {getTagLabel(tag)}
              </span>
            ))}
          </div>

          <div className="flex flex-row gap-2 items-center mb-2">
            {/* Visibility Badge */}
            {experience.visibility && (
              <div className="">
                <VisibilityBadge visibility={experience.visibility} />
              </div>
            )}

            {/* Price Badge */}
            <div className="backdrop-blur-sm py-1">
              <span className="text-xs font-semibold text-dark-grey">{price_range}</span>
            </div>

            {/* <span className="text-[10px] text-black/20 mx-1">●</span> */}


          </div>


          {/* Description */}
          {description && (
            <p className="text-sm text-medium-grey line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
