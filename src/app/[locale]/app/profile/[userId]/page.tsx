'use client';

import { use, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceCard } from '@/features/feed/components/ExperienceCard';
import { EditProfileModal } from '@/features/profile/components/EditProfileModal';
import { FollowButton } from '@/components/FollowButton';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useBookmarks } from '@/features/profile/hooks/useBookmarks';
import { useToggleBookmark } from '@/features/experience-detail/hooks/useToggleBookmark';
import { useDeleteExperience } from '@/features/experience-detail/hooks/useExperienceMutations';
import { useFollowStatus } from '@/features/profile/hooks/useFollow';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api/endpoints';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/useAuth';
import type { ExperienceFeedItem } from '@/lib/models';
import { routes, type Locale } from '@/lib/routes';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const tExperience = useTranslations('experience');
  const queryClient = useQueryClient();

  // Read initial tab from URL param
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'bookmarks' ? 'bookmarks' : 'suggestions';
  const [activeTab, setActiveTab] = useState<'suggestions' | 'bookmarks'>(initialTab);

  // Update tab when URL param changes
  useEffect(() => {
    if (tabParam === 'bookmarks') {
      setActiveTab('bookmarks');
    }
  }, [tabParam]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { refreshUser, user: currentUser } = useAuth();
  const { showToast } = useToast();
  const { mutate: toggleBookmark } = useToggleBookmark();
  const { mutateAsync: deleteExperience } = useDeleteExperience();

  // Fetch profile data from API (works for both 'me' and other user IDs)
  const { data, isLoading, error } = useProfile(userId);

  const displayUser = data?.user;
  const isOwnProfile = userId === 'me';

  // Check if current user follows this profile (for tab visibility)
  const { data: followStatus } = useFollowStatus(
    displayUser?.id || '',
    currentUser?.id
  );

  // Fetch bookmarks only for own profile
  const { data: bookmarks, isLoading: isLoadingBookmarks } = useBookmarks();

  // Determine if bookmarks tab should be visible
  // Show if: own profile OR current user follows this profile
  const showBookmarksTab = isOwnProfile || followStatus?.isFollowing;

  const handleBookmarkToggle = (experience: ExperienceFeedItem) => {
    const wasBookmarked = experience.isBookmarked || false;

    toggleBookmark(
      {
        experienceId: experience.experience_id,
        bookmarkId: experience.bookmarkId,
        isBookmarked: wasBookmarked,
      },
      {
        onSuccess: (result) => {
          if (result.action === 'removed') {
            showToast(t('bookmark.removedToast'), 'success');
          } else {
            // Only show "See now" link if not on own profile (they're likely already in the bookmarks tab)
            if (isOwnProfile) {
              showToast(t('bookmark.addedToast'), 'success');
            } else {
              showToast(t('bookmark.addedToast'), 'success', {
                label: t('bookmark.seeNow'),
                href: routes.app.profile.me(locale as Locale, { tab: 'bookmarks' }),
              });
            }
          }
        },
        onError: () => {
          showToast(tCommon('error'), 'error');
        },
      }
    );
  };

  const handleDelete = async (experienceId: string) => {
    await deleteExperience(experienceId);
    showToast(tExperience('deleteModal.success'), 'success');
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (response.ok) {
        router.push(routes.home(locale as Locale));
        router.refresh();
      }
    } catch (error) {
      setIsSigningOut(false);
      console.error('Sign out failed:', error);
    }
  };

  const experiences = data?.experiences || [];
  const stats = data?.stats || { suggestions: 0, followers: 0, following: 0 };

  const handleSaveProfile = async (profileData: {
    display_name: string;
    username: string;
    avatar_url?: string;
  }) => {
    await api.updateProfile(profileData);
    // Invalidate profile query to refetch updated data
    queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    // Refresh auth context so nav components update
    await refreshUser();
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10 py-8">
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : tCommon('error')
            }
          />
        </div>
      )}

      {displayUser && (
        <>
          {/* Profile Content */}
          <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
            {/* Profile Header */}
            <div className="relative mb-8 mt-10">
              <div className="flex flex-col items-center md:flex-row md:items-end gap-4 md:gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar
                    src={displayUser.avatar_url}
                    alt={displayUser.display_name}
                    size="lg"
                    className="h-40 w-40 md:h-36 md:size-54 border-4 border-white shadow-lg"
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 pb-2">
                  <div className="flex flex-col items-center md:flex-row md:justify-between gap-2">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-dark-grey">
                        {displayUser.display_name}
                      </h1>
                      <p className="text-medium-grey">@{displayUser.username}</p>
                    </div>

                    {userId === 'me' ? (
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="self-center md:self-auto px-6 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {t('editProfile')}
                        </button>
                          <button
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="self-center md:self-auto px-6 py-2 text-sm font-medium text-medium-grey border border-chip-bg rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSigningOut ? t('signingOut') : t('signOut')}
                        </button>
                      </div>
                    ) : (
                      <FollowButton
                        userId={displayUser.id}
                        className="self-center md:self-auto"
                      />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-dark-grey">{stats.suggestions}</p>
                      <p className="text-sm text-medium-grey">{t('stats.suggestions')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-dark-grey">{stats.followers}</p>
                      <p className="text-sm text-medium-grey">{t('stats.followers')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-dark-grey">{stats.following}</p>
                      <p className="text-sm text-medium-grey">{t('stats.following')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-divider mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={cn(
                    'pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                    activeTab === 'suggestions'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-medium-grey hover:text-dark-grey'
                  )}
                >
                  {t('tabs.suggestions')}
                </button>
                {showBookmarksTab && (
                  <button
                    onClick={() => setActiveTab('bookmarks')}
                    className={cn(
                      'pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                      activeTab === 'bookmarks'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-medium-grey hover:text-dark-grey'
                    )}
                  >
                    {t('tabs.bookmarks')}
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="pb-12">
              {activeTab === 'suggestions' && (
                <>
                  {experiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {experiences.map((experience) => (
                        <ExperienceCard
                          key={experience.id}
                          experience={experience}
                          onClick={() => router.push(routes.app.experience.detail(locale as Locale, experience.experience_id, experience.slug || ''))}
                          onEdit={isOwnProfile ? () => router.push(routes.app.experience.edit(locale as Locale, experience.experience_id)) : undefined}
                          onDelete={isOwnProfile ? () => handleDelete(experience.experience_id) : undefined}
                          onBookmarkToggle={!isOwnProfile ? () => handleBookmarkToggle(experience) : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 bg-surface rounded-full mb-4">
                        <svg
                          className="h-8 w-8 text-medium-grey"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold text-dark-grey mb-2">
                        {t('empty.suggestions.title')}
                      </h2>
                      <p className="text-medium-grey max-w-sm">
                        {t('empty.suggestions.subtitle')}
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'bookmarks' && showBookmarksTab && (
                <>
                  {isLoadingBookmarks ? (
                    <div className="flex justify-center items-center py-16">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : bookmarks && bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {bookmarks.map((experience) => (
                        <ExperienceCard
                          key={experience.id}
                          experience={experience}
                          onClick={() => router.push(routes.app.experience.detail(locale as Locale, experience.experience_id, experience.slug || ''))}
                          onBookmarkToggle={() => handleBookmarkToggle(experience)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="p-4 bg-surface rounded-full mb-4">
                        <svg
                          className="h-8 w-8 text-medium-grey"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-lg font-semibold text-dark-grey mb-2">
                        {t('empty.bookmarks.title')}
                      </h2>
                      <p className="text-medium-grey max-w-sm">
                        {t('empty.bookmarks.subtitle')}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Edit Profile Modal */}
          {userId === 'me' && (
            <EditProfileModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              user={displayUser}
              onSave={handleSaveProfile}
            />
          )}
        </>
      )}
    </div>
  );
}
