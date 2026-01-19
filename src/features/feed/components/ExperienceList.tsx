'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ExperienceCard } from './ExperienceCard';
import { FeedEmptyState } from './FeedEmptyState';
import { useToggleBookmark } from '@/features/experience-detail/hooks/useToggleBookmark';
import { useDeleteExperience } from '@/features/experience-detail/hooks/useExperienceMutations';
import { useToast } from '@/lib/hooks/useToast';
import { useAuth } from '@/lib/hooks/useAuth';
import type { ExperienceFeedItem } from '@/lib/models';

interface SectionHeaderProps {
  icon: 'bookmark' | 'location' | 'users' | 'friends';
  title: string;
  subtitle: string;
}

function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-surface rounded-lg">
        {icon === 'bookmark' ? (
          <svg
            className="h-5 w-5 text-primary"
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
        ) : icon === 'friends' ? (
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        ) : icon === 'users' ? (
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
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
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-dark-grey">{title}</h2>
        <p className="text-sm text-medium-grey">{subtitle}</p>
      </div>
    </div>
  );
}

interface SeeMoreButtonProps {
  href: string;
  label: string;
}

function SeeMoreButton({ href, label }: SeeMoreButtonProps) {
  return (
    <div className="mt-6 text-center">
      <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {label}
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </div>
  );
}

interface ExperienceListProps {
  mySuggestions: ExperienceFeedItem[];
  friendsSuggestions: ExperienceFeedItem[];
  communitySuggestions: ExperienceFeedItem[];
  nearbyPlaces: ExperienceFeedItem[];
  userCity: string | null;
}

export function ExperienceList({
  mySuggestions,
  friendsSuggestions,
  communitySuggestions,
  nearbyPlaces,
  userCity,
}: ExperienceListProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { mutate: toggleBookmark } = useToggleBookmark();
  const { mutateAsync: deleteExperience } = useDeleteExperience();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleDelete = async (experienceId: string) => {
    await deleteExperience(experienceId);
    showToast(t('experience.deleteModal.success'), 'success');
  };

  const handleBookmarkToggle = (experience: ExperienceFeedItem) => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

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
            showToast(t('bookmark.addedToast'), 'success', {
              label: t('bookmark.seeNow'),
              href: `/${locale}/app/profile/me?tab=bookmarks`,
            });
          }
        },
        onError: () => {
          showToast(t('common.error'), 'error');
        },
      }
    );
  };

  const isEmpty = mySuggestions.length === 0 && friendsSuggestions.length === 0 && communitySuggestions.length === 0 && nearbyPlaces.length === 0;

  if (isEmpty) {
    return <FeedEmptyState />;
  }

  // Limit display counts
  const displayedMySuggestions = mySuggestions.slice(0, 3);
  const displayedCommunitySuggestions = communitySuggestions.slice(0, 3);
  const hasMoreMySuggestions = mySuggestions.length > 3;
  const hasMoreCommunitySuggestions = communitySuggestions.length > 3;

  return (
    <div className="space-y-12">
      {/* 1. Friends' Suggestions Section (always shown) */}
      <section>
        <SectionHeader
          icon="friends"
          title={t('home.sections.friendsSuggestions')}
          subtitle={t('home.sections.friendsSuggestionsSubtitle')}
        />
        {friendsSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {friendsSuggestions.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onBookmarkToggle={() => handleBookmarkToggle(experience)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg p-6 text-center">
            <p className="text-medium-grey">{t('home.sections.friendsEmpty')}</p>
          </div>
        )}
      </section>

      {/* 2. Nearby Places Section */}
      {nearbyPlaces.length > 0 && (
        <section>
          <SectionHeader
            icon="location"
            title={userCity ? t('home.sections.nearbyPlacesCity', { city: userCity }) : t('home.sections.nearbyPlaces')}
            subtitle={t('home.sections.nearbyPlacesSubtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {nearbyPlaces.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onBookmarkToggle={() => handleBookmarkToggle(experience)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. My Suggestions Section (max 3, with see more) */}
      {mySuggestions.length > 0 && (
        <section>
          <SectionHeader
            icon="bookmark"
            title={t('home.sections.mySuggestions')}
            subtitle={t('home.sections.mySuggestionsSubtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {displayedMySuggestions.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onEdit={() => router.push(`/${locale}/app/experience/${experience.experience_id}/edit`)}
                onDelete={() => handleDelete(experience.experience_id)}
              />
            ))}
          </div>
          {hasMoreMySuggestions && (
            <SeeMoreButton
              href={`/${locale}/app/profile/me`}
              label={t('home.sections.seeAllMySuggestions')}
            />
          )}
        </section>
      )}

      {/* 4. Community Suggestions Section (max 3, with see more) */}
      {communitySuggestions.length > 0 && (
        <section>
          <SectionHeader
            icon="users"
            title={t('home.sections.communitySuggestions')}
            subtitle={t('home.sections.communitySuggestionsSubtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {displayedCommunitySuggestions.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onBookmarkToggle={() => handleBookmarkToggle(experience)}
              />
            ))}
          </div>
          {hasMoreCommunitySuggestions && (
            <SeeMoreButton
              href={`/${locale}/app/explore`}
              label={t('home.sections.seeAllCommunity')}
            />
          )}
        </section>
      )}
    </div>
  );
}
