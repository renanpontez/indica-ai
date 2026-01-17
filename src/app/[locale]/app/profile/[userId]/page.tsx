'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Avatar } from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ExperienceCard } from '@/features/feed/components/ExperienceCard';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { cn } from '@/lib/utils/cn';

import type { ExperienceFeedItem } from '@/lib/models';

// Mock data for demonstration
const mockUser = {
  id: 'me',
  display_name: 'John Doe',
  username: 'johndoe',
  avatar_url: null,
  bio: 'Food enthusiast exploring the best spots around the world.',
};

const mockExperiences: ExperienceFeedItem[] = [
  {
    id: '1',
    experience_id: 'exp-1',
    user: { id: 'me', display_name: 'John Doe', avatar_url: null },
    place: {
      id: 'place-1',
      name: 'Osteria Francescana',
      city_short: 'Modena',
      country: 'Italy',
      thumbnail_image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
      instagram: 'osteriafrancescana',
    },
    price_range: '$$$$',
    categories: ['Fine Dining', 'Italian'],
    time_ago: '2 weeks ago',
    description: 'An incredible culinary journey through traditional Italian flavors reimagined.',
  },
  {
    id: '2',
    experience_id: 'exp-2',
    user: { id: 'me', display_name: 'John Doe', avatar_url: null },
    place: {
      id: 'place-2',
      name: 'Café de Flore',
      city_short: 'Paris',
      country: 'France',
      thumbnail_image_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=400&fit=crop',
      instagram: 'cafedeflore',
    },
    price_range: '$$',
    categories: ['Café', 'French'],
    time_ago: '1 month ago',
    description: 'Classic Parisian café with the best croissants and people watching.',
  },
];

// Mock followers data
const mockFollowers = [
  { id: '1', display_name: 'Alice Smith', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: '2', display_name: 'Bob Johnson', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: '3', display_name: 'Carol Williams', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: '4', display_name: 'David Brown', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: '5', display_name: 'Eva Martinez', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
  { id: '6', display_name: 'Frank Garcia', avatar_url: null },
  { id: '7', display_name: 'Grace Lee', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'bookmarks'>('suggestions');

  // For "me", use mock data; for other users, fetch from API
  const { data: user, isLoading, error } = useProfile(userId);
  const displayUser = userId === 'me' ? mockUser : user;

  // Mock data for the profile
  const experiences = userId === 'me' ? mockExperiences : [];
  const followers = mockFollowers;
  const stats = {
    suggestions: mockExperiences.length,
    followers: followers.length,
    following: 24,
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoading && userId !== 'me' && (
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && userId !== 'me' && (
        <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10 py-8">
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
        <>

          {/* Profile Content */}
          <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
            {/* Profile Header */}
            <div className="relative mb-8 mt-10">
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-dark-grey">
                        {displayUser.display_name}
                      </h1>
                      <p className="text-medium-grey">@{displayUser.username}</p>
                      {userId === 'me' && mockUser.bio && (
                        <p className="text-dark-grey mt-2 max-w-xl">{mockUser.bio}</p>
                      )}
                    </div>

                    {userId === 'me' && (
                      <button className="self-start md:self-auto px-6 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-dark-grey">{stats.suggestions}</p>
                      <p className="text-sm text-medium-grey">Suggestions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-dark-grey">{stats.followers}</p>
                      <p className="text-sm text-medium-grey">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-dark-grey">{stats.following}</p>
                      <p className="text-sm text-medium-grey">Following</p>
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
                  Suggestions
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
                  Bookmarks
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
                          onClick={() => router.push(`/${locale}/app/experience/${experience.experience_id}`)}
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
                        No suggestions yet
                      </h2>
                      <p className="text-medium-grey max-w-sm">
                        Share your favorite places to help others discover great spots.
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
                    No bookmarks yet
                  </h2>
                  <p className="text-medium-grey max-w-sm">
                    Bookmark places to find them here later.
                  </p>
                </div>
              )}
            </div>

            {/* Followers Section */}
            {followers.length > 0 && (
              <div className="border-t border-divider pt-8 pb-12">
                <h3 className="text-lg font-semibold text-dark-grey mb-4">Followers</h3>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {followers.slice(0, 6).map((follower) => (
                      <Avatar
                        key={follower.id}
                        src={follower.avatar_url}
                        alt={follower.display_name}
                        size="sm"
                        className="h-10 w-10 border-2 border-white"
                      />
                    ))}
                  </div>
                  {followers.length > 6 && (
                    <span className="text-sm text-medium-grey">
                      +{followers.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
