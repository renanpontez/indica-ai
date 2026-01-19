'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceList } from '@/features/feed/components/ExperienceList';
import { useFeed } from '@/features/feed/hooks/useFeed';
import { useTranslations } from 'next-intl';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function FeedPage() {
  const { data: feedData, isLoading, error } = useFeed();
  const t = useTranslations();
  const breadcrumbItems = [
    { label: t('nav.feed') },
  ];
  return (
    <div className="min-h-screen bg-background">
      {/* <Breadcrumb items={breadcrumbItems} /> */}

      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto p-4">

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

        {feedData && (
          <ExperienceList
            mySuggestions={feedData.mySuggestions}
            communitySuggestions={feedData.communitySuggestions}
            nearbyPlaces={feedData.nearbyPlaces}
            userCity={feedData.userCity}
          />
        )}
      </div>
    </div>
  );
}
