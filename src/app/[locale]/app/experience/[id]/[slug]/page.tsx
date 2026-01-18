'use client';

import { use } from 'react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceDetailLayout } from '@/features/experience-detail/components/ExperienceDetailLayout';
import { useExperience } from '@/features/experience-detail/hooks/useExperience';
import { useTranslations } from 'next-intl';

export default function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = use(params);
  const { data: experience, isLoading, error } = useExperience(id);
  const t = useTranslations();

  const breadcrumbItems = [
    { label: t('nav.feed'), href: '/app' },
    { label: experience?.place?.name || t('common.loading') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />

      {isLoading && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="p-md">
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : 'Failed to load experience. Please try again.'
            }
          />
        </div>
      )}

      {experience && (
        <ExperienceDetailLayout
          experience={experience}
          user={experience.user}
          place={experience.place}
          isBookmarked={false}
          moreFromUser={[]}
        />
      )}
    </div>
  );
}
