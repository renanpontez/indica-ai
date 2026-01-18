'use client';

import { useTranslations } from 'next-intl';
import type { PlaceStats } from '@/lib/models';

interface ExistingPlaceModalProps {
  isOpen: boolean;
  placeName: string;
  placeCity: string;
  stats: PlaceStats | null;
  isLoading: boolean;
  onUseExisting: () => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export function ExistingPlaceModal({
  isOpen,
  placeName,
  placeCity,
  stats,
  isLoading,
  onUseExisting,
  onCreateNew,
  onClose,
}: ExistingPlaceModalProps) {
  const t = useTranslations('add.existingPlace');
  const tTags = useTranslations('tags');

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTagLabel = (slug: string): string => {
    try {
      return tTags(slug);
    } catch {
      return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-dark-grey">{t('title')}</h2>
            <button
              onClick={onClose}
              className="text-medium-grey hover:text-dark-grey transition-colors"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Place info */}
            <div className="bg-surface rounded-xl p-4">
              <h3 className="font-medium text-dark-grey">{placeName}</h3>
              <p className="text-sm text-medium-grey">{placeCity}</p>
            </div>

            {/* Stats */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stats && stats.recommendation_count > 0 ? (
              <div className="space-y-3">
                {/* Recommendation count */}
                <div className="flex items-center gap-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    {t('recommendationCount', { count: stats.recommendation_count })}
                  </span>
                </div>

                {/* Top tags */}
                {stats.top_tags.length > 0 && (
                  <div>
                    <p className="text-sm text-medium-grey mb-2">{t('oftenTaggedAs')}</p>
                    <div className="flex flex-wrap gap-2">
                      {stats.top_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {getTagLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-medium-grey">{t('noExistingRecommendations')}</p>
            )}

            {/* Description */}
            <p className="text-sm text-medium-grey">{t('description')}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={onUseExisting}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('addMyExperience')}
            </button>
            <button
              onClick={onCreateNew}
              className="w-full px-4 py-3 text-sm font-medium text-medium-grey border border-divider rounded-lg hover:bg-surface transition-colors"
            >
              {t('differentPlace')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
