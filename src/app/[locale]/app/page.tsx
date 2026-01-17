'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceList } from '@/features/feed/components/ExperienceList';
import { useFeed } from '@/features/feed/hooks/useFeed';
import { useTranslations } from 'next-intl';

export default function FeedPage() {
  const { data: experiences, isLoading, error } = useFeed();
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
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
                  : t('common.error')
              }
            />
          </div>
        )}

        {experiences && <ExperienceList experiences={experiences} />}
      </div>
    </div>
  );
}
