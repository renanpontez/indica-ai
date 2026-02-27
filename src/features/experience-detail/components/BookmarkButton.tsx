'use client';

import { useState } from 'react';
import { IconButton } from '@/components/IconButton';
import { useTranslations } from 'next-intl';
import { useToggleBookmark } from '../hooks/useToggleBookmark';
import { useToast } from '@/lib/hooks/useToast';

interface BookmarkButtonProps {
  experienceId: string;
  isBookmarked?: boolean;
  bookmarkId?: string;
  showLabel?: boolean;
}

export function BookmarkButton({
  experienceId,
  isBookmarked = false,
  bookmarkId,
  showLabel = false,
}: BookmarkButtonProps) {
  const t = useTranslations('bookmark');
  const tCommon = useTranslations('common');
  const { showToast } = useToast();
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();
  const [localIsBookmarked, setLocalIsBookmarked] = useState(isBookmarked);
  const [localBookmarkId, setLocalBookmarkId] = useState(bookmarkId);

  const handleToggle = () => {
    toggleBookmark(
      {
        experienceId,
        bookmarkId: localBookmarkId,
        isBookmarked: localIsBookmarked,
      },
      {
        onSuccess: (result) => {
          if (result.action === 'removed') {
            setLocalIsBookmarked(false);
            setLocalBookmarkId(undefined);
            showToast(t('removedToast'), 'success');
          } else {
            setLocalIsBookmarked(true);
            setLocalBookmarkId(result.bookmarkId);
            showToast(t('addedToast'), 'success');
          }
        },
        onError: () => {
          showToast(tCommon('error'), 'error');
        },
      }
    );
  };

  if (showLabel) {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          localIsBookmarked
            ? 'border-primary text-primary bg-primary/5'
            : 'border-divider text-medium-grey hover:border-primary hover:text-primary'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {localIsBookmarked ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
        <span className="text-small font-medium">
          {localIsBookmarked ? t('saved') : t('add')}
        </span>
      </button>
    );
  }

  return (
    <IconButton
      icon={
        isBookmarked ? (
          <svg
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        )
      }
      label={isBookmarked ? 'Remove bookmark' : 'Bookmark this place'}
      onClick={handleToggle}
      disabled={isPending}
      className={isBookmarked ? 'text-primary' : 'text-medium-grey'}
    />
  );
}
