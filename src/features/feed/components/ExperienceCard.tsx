'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/Avatar';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import { useTagLabel } from '@/hooks/useTagLabel';
import { useTranslations } from 'next-intl';
import type { ExperienceFeedItem } from '@/lib/models';

interface ExperienceCardProps {
  experience: ExperienceFeedItem;
  onClick: () => void;
  onBookmarkToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExperienceCard({
  experience,
  onClick,
  onBookmarkToggle,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  const { user, place, price_range, tags, time_ago, description } = experience;
  const { getTagLabel } = useTagLabel();
  const t = useTranslations('place');
  const tExperience = useTranslations('experience');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

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
            <div className="flex gap-2 items-center">
              <p className="text-xs text-medium-grey">{time_ago}</p>
              {/* Visibility Badge */}
              {experience.visibility && (
                <VisibilityBadge visibility={experience.visibility} />
              )}
            </div>
          </div>
        </div>
        {(onEdit || onDelete) ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 hover:bg-surface rounded-full transition-colors text-medium-grey"
              aria-label={tExperience('actions.menu')}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-divider py-1 z-10">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onEdit();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-dark-grey hover:bg-surface transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    {tExperience('actions.edit')}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    {tExperience('actions.delete')}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : onBookmarkToggle ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle();
            }}
            className={`p-2 hover:bg-surface rounded-full transition-colors ${
              experience.isBookmarked ? 'text-primary' : 'text-medium-grey'
            }`}
            aria-label={experience.isBookmarked ? 'Remove bookmark' : 'Bookmark this place'}
          >
            {experience.isBookmarked ? (
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
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
            )}
          </button>
        ) : null}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            if (!isDeleting) setIsDeleteModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-dark-grey mb-2">
              {tExperience('deleteModal.title')}
            </h3>
            <p className="text-medium-grey mb-1">
              {tExperience('deleteModal.message')}
            </p>
            <p className="text-dark-grey font-medium mb-6">
              {place.name}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(false);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-medium-grey hover:text-dark-grey transition-colors disabled:opacity-50"
              >
                {tExperience('deleteModal.cancel')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? tExperience('deleteModal.deleting') : tExperience('deleteModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
