'use client';

import { use, useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { Avatar } from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceList } from '@/features/feed/components/ExperienceList';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { cn } from '@/lib/utils/cn';

import type { ExperienceFeedItem } from '@/lib/models';

// Mock data for demonstration
const mockUser = {
  id: 'me',
  display_name: 'John Doe',
  username: 'johndoe',
  avatar_url: null,
};

const mockExperiences: ExperienceFeedItem[] = [];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [activeTab, setActiveTab] = useState<'experiences' | 'bookmarks'>('experiences');

  // For "me", use mock data; for other users, fetch from API
  const { data: user, isLoading, error } = useProfile(userId);
  const displayUser = userId === 'me' ? mockUser : user;

  return (
    <div>
      <TopBar title="Profile" />

      {isLoading && userId !== 'me' && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && userId !== 'me' && (
        <div className="p-md">
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : 'Failed to load profile. Please try again.'
            }
          />
        </div>
      )}

      {displayUser && (
        <div className="pb-24">
          {/* User Header Section - Surface bg */}
          <div className="bg-surface p-md">
            <div className="flex items-center gap-md">
              <Avatar
                src={displayUser.avatar_url}
                alt={displayUser.display_name}
                size="lg"
                className="h-20 w-20"
              />
              <div className="flex-1">
                <h1 className="text-title-m font-bold text-text-primary">
                  {displayUser.display_name}
                </h1>
                <p className="text-small text-text-secondary">
                  @{displayUser.username}
                </p>
                {userId === 'me' && (
                  <button className="text-small text-accent hover:underline mt-1">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border-b border-divider">
            <div className="flex">
              <button
                onClick={() => setActiveTab('experiences')}
                className={cn(
                  'flex-1 min-h-[44px] py-2 text-body font-medium transition-colors border-b-2',
                  activeTab === 'experiences'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Experiences
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={cn(
                  'flex-1 min-h-[44px] py-2 text-body font-medium transition-colors border-b-2',
                  activeTab === 'bookmarks'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                Bookmarks
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-background">
            {activeTab === 'experiences' && (
              <>
                {mockExperiences.length > 0 ? (
                  <div className="p-md">
                    <ExperienceList experiences={mockExperiences} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[50vh] px-md text-center">
                    <svg
                      className="h-12 w-12 text-text-secondary mb-md"
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
                    <h2 className="text-title-m font-bold text-text-primary mb-sm">
                      No places yet
                    </h2>
                    <p className="text-body text-text-secondary max-w-sm">
                      Save places to build your profile.
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'bookmarks' && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] px-md text-center">
                <svg
                  className="h-12 w-12 text-text-secondary mb-md"
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
                <h2 className="text-title-m font-bold text-text-primary mb-sm">
                  No bookmarks yet
                </h2>
                <p className="text-body text-text-secondary max-w-sm">
                  Bookmark places to find them here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
