'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceCard } from '@/features/feed/components/ExperienceCard';
import { EditProfileModal } from '@/features/profile/components/EditProfileModal';
import { FollowButton } from '@/components/FollowButton';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { api } from '@/lib/api/endpoints';
import { cn } from '@/lib/utils/cn';

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'bookmarks'>('suggestions');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch profile data from API (works for both 'me' and other user IDs)
  const { data, isLoading, error } = useProfile(userId);

  const displayUser = data?.user;
  const experiences = data?.experiences || [];
  const stats = data?.stats || { suggestions: 0, followers: 0, following: 0 };

  const handleSaveProfile = async (profileData: { display_name: string; username: string }) => {
    await api.updateProfile(profileData);
    // Invalidate profile query to refetch updated data
    queryClient.invalidateQueries({ queryKey: ['profile', userId] });
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
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="self-center md:self-auto px-6 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        {t('editProfile')}
                      </button>
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
              </div>
            </div>

            {/* Tab Content */}
            <div className="pb-12">
              {activeTab === 'suggestions' && (
                <>
                  {experiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {experiences.map((experience) => (
                        <ExperienceCard
                          key={experience.id}
                          experience={experience}
                          onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
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

              {activeTab === 'bookmarks' && (
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
