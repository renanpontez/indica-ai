'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { useFollow, useFollowStatus } from '@/features/profile/hooks/useFollow';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTranslations } from 'next-intl';

interface FollowButtonProps {
  userId: string;
  className?: string;
  showLabel?: boolean;
}

export function FollowButton({ userId, className, showLabel = true }: FollowButtonProps) {
  const t = useTranslations('profile');
  const { user: currentUser } = useAuth();
  const { data: followStatus } = useFollowStatus(userId, currentUser?.id);
  const { follow, unfollow, isPending } = useFollow();
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  // Don't show button if viewing own profile or not logged in
  if (!currentUser?.id || userId === currentUser.id) {
    return null;
  }

  const handleClick = () => {
    if (isFollowing) {
      setShowUnfollowModal(true);
    } else {
      follow(userId);
    }
  };

  const handleConfirmUnfollow = () => {
    unfollow(userId);
    setShowUnfollowModal(false);
  };

  // No data yet — show placeholder that reserves space but doesn't flash wrong state
  if (!followStatus) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={className}
      >
        {showLabel ? <span className="invisible">{t('follow')}</span> : (
          <svg className="w-5 h-5 invisible" viewBox="0 0 24 24" />
        )}
      </Button>
    );
  }

  const isFollowing = followStatus.isFollowing;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        loading={isPending}
        className={className}
      >
        {showLabel ? (isFollowing ? t('unfollow') : t('follow')) : (
          <svg
            className="w-5 h-5"
            fill={isFollowing ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isFollowing
                ? "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              }
            />
          </svg>
        )}
      </Button>

      {showUnfollowModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowUnfollowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-dark-grey mb-2">
              {t('unfollowModal.title')}
            </h3>
            <p className="text-medium-grey mb-6">
              {t('unfollowModal.message')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUnfollowModal(false)}
                className="px-4 py-2 text-sm font-medium text-medium-grey hover:text-dark-grey transition-colors"
              >
                {t('unfollowModal.cancel')}
              </button>
              <button
                onClick={handleConfirmUnfollow}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                {t('unfollowModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
