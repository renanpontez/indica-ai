'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ExperienceCard } from './ExperienceCard';
import { FeedEmptyState } from './FeedEmptyState';
import type { ExperienceFeedItem } from '@/lib/models';

interface SectionHeaderProps {
  icon: 'bookmark' | 'location' | 'users';
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

interface ExperienceListProps {
  mySuggestions: ExperienceFeedItem[];
  communitySuggestions: ExperienceFeedItem[];
  nearbyPlaces: ExperienceFeedItem[];
  userCity: string | null;
}

export function ExperienceList({
  mySuggestions,
  communitySuggestions,
  nearbyPlaces,
  userCity,
}: ExperienceListProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const isEmpty = mySuggestions.length === 0 && communitySuggestions.length === 0 && nearbyPlaces.length === 0;

  if (isEmpty) {
    return <FeedEmptyState />;
  }

  return (
    <div className="space-y-12">
      {/* Community Suggestions Section */}
      {communitySuggestions.length > 0 && (
        <section>
          <SectionHeader
            icon="users"
            title={t('home.sections.communitySuggestions')}
            subtitle={t('home.sections.communitySuggestionsSubtitle')}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {communitySuggestions.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onBookmarkToggle={() => {
                  console.log('Toggle bookmark for', experience.id);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Nearby Places Section */}
      {nearbyPlaces.length > 0 && (
        <section>
          <SectionHeader
            icon="location"
            title={userCity ? t('home.sections.nearbyPlacesCity', { city: userCity }) : t('home.sections.nearbyPlaces')}
            subtitle={t('home.sections.nearbyPlacesSubtitle')}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nearbyPlaces.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onBookmarkToggle={() => {
                  console.log('Toggle bookmark for', experience.id);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* My Suggestions Section */}
      {mySuggestions.length > 0 && (
        <section>
          <SectionHeader
            icon="bookmark"
            title={t('home.sections.mySuggestions')}
            subtitle={t('home.sections.mySuggestionsSubtitle')}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {mySuggestions.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}/${experience.slug}`)}
                onBookmarkToggle={() => {
                  console.log('Toggle bookmark for', experience.id);
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
