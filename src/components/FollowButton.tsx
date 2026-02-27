'use client';

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
  const { data: followStatus, isPending: isLoadingStatus } = useFollowStatus(userId, currentUser?.id);
  const { follow, unfollow, isPending } = useFollow();

  // Don't show button if viewing own profile or not logged in
  if (!currentUser?.id || userId === currentUser.id) {
    return null;
  }

  const isFollowing = followStatus?.isFollowing ?? false;

  const handleClick = () => {
    if (isFollowing) {
      unfollow(userId);
    } else {
      follow(userId);
    }
  };

  if (isLoadingStatus) {
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

  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
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
  );
}
