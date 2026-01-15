'use client';

import { use, useMemo } from 'react';
import { TopBar } from '@/components/TopBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceDetailLayout } from '@/features/experience-detail/components/ExperienceDetailLayout';
import { useExperience } from '@/features/experience-detail/hooks/useExperience';
import {
  mockUsers,
  mockPlaces,
  mockFeedItems,
} from '@/lib/api/mock-data';

export default function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: experience, isLoading, error } = useExperience(id);

  // Find related data from mock data
  const user = useMemo(() => {
    if (!experience) return null;
    return mockUsers.find((u) => u.id === experience.user_id) || mockUsers[0];
  }, [experience]);

  const place = useMemo(() => {
    if (!experience) return null;
    return mockPlaces.find((p) => p.id === experience.place_id) || mockPlaces[0];
  }, [experience]);

  // Get more experiences from the same user (excluding current)
  const moreFromUser = useMemo(() => {
    if (!experience) return [];
    return mockFeedItems
      .filter(
        (item) =>
          item.user.id === experience.user_id &&
          item.experience_id !== experience.id
      )
      .slice(0, 3);
  }, [experience]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar showBack title="" />

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

      {experience && user && place && (
        <ExperienceDetailLayout
          experience={experience}
          user={user}
          place={place}
          isBookmarked={false}
          moreFromUser={moreFromUser}
        />
      )}
    </div>
  );
}
