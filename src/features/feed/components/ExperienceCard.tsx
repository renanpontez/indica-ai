'use client';

import { Avatar } from '@/components/Avatar';
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
  const { user, place, price_range, categories, time_ago, description } = experience;

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
            <p className="text-sm font-semibold text-text-primary">
              {user.display_name}
            </p>
            <p className="text-xs text-text-secondary">{time_ago}</p>
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
              className="h-5 w-5 text-text-secondary"
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
        <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-surface">
          <img
            src={place.thumbnail_image_url || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop`}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Price Badge */}
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
            <span className="text-xs font-semibold text-text-primary">{price_range}</span>
          </div>
        </div>

        {/* Place Info */}
        <div className="flex-1 min-w-0">
          {/* Place Name */}
          <h3 className="text-base font-semibold text-text-primary mb-1 line-clamp-1 group-hover:underline">
            {place.name}
          </h3>

          {/* Instagram Handle */}
          {place.instagram && (
            <p className="text-sm text-text-secondary mb-1">
              @{place.instagram}
            </p>
          )}

          {/* Location */}
          <p className="text-sm text-text-secondary mb-2">
            {place.city_short}, {place.country}
          </p>

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-accent border border-accent"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
