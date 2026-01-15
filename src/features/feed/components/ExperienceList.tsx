'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ExperienceCard } from './ExperienceCard';
import { FeedEmptyState } from './FeedEmptyState';
import type { ExperienceFeedItem } from '@/lib/models';

interface SectionHeaderProps {
  icon: 'bookmark' | 'location';
  title: string;
  subtitle: string;
}

function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-surface rounded-lg">
        {icon === 'bookmark' ? (
          <svg
            className="h-5 w-5 text-accent"
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
        ) : (
          <svg
            className="h-5 w-5 text-accent"
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
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <p className="text-sm text-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}

interface ExperienceListProps {
  experiences: ExperienceFeedItem[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  if (experiences.length === 0) {
    return <FeedEmptyState />;
  }

  // Split experiences into two sections for demo purposes
  const friendsSuggestions = experiences.slice(0, Math.ceil(experiences.length / 2));
  const nearbyPlaces = experiences.slice(Math.ceil(experiences.length / 2));

  return (
    <div className="space-y-12">
      {/* Friends Suggestions Section */}
      <section>
        <SectionHeader
          icon="bookmark"
          title={t('home.sections.friendsSuggestions')}
          subtitle={t('home.sections.friendsSuggestionsSubtitle')}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {friendsSuggestions.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onClick={() => router.push(`/${locale}/experience/${experience.experience_id}`)}
              onBookmarkToggle={() => {
                console.log('Toggle bookmark for', experience.id);
              }}
            />
          ))}
        </div>
      </section>

      {/* Nearby Places Section */}
      {nearbyPlaces.length > 0 && (
        <section>
          <SectionHeader
            icon="location"
            title={t('home.sections.nearbyPlaces')}
            subtitle={t('home.sections.nearbyPlacesSubtitle')}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {nearbyPlaces.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onClick={() => router.push(`/${locale}/experience/${experience.experience_id}`)}
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
