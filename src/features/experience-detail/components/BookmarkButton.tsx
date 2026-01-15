'use client';

import { IconButton } from '@/components/IconButton';
import { useToggleBookmark } from '../hooks/useToggleBookmark';

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
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();

  const handleToggle = () => {
    toggleBookmark({
      experienceId,
      bookmarkId,
      isBookmarked,
    });
  };

  if (showLabel) {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
          isBookmarked
            ? 'border-accent text-accent bg-accent/5'
            : 'border-divider text-text-secondary hover:border-accent hover:text-accent'
        } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isBookmarked ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
        <span className="text-small font-medium">
          {isBookmarked ? 'Following' : 'Follow'}
        </span>
        {isBookmarked && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}
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
      className={isBookmarked ? 'text-accent' : 'text-text-secondary'}
    />
  );
}
