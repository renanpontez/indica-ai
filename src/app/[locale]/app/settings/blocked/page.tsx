'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api/endpoints';

export default function BlockedUsersPage() {
  const router = useRouter();
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blocked-users'],
    queryFn: () => api.getBlockedUsers(),
  });

  const { mutate: unblockUser } = useMutation({
    mutationFn: (userId: string) => api.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      showToast(t('unblocked'), 'success');
      setUnblockingId(null);
    },
    onError: () => {
      showToast(tCommon('error'), 'error');
      setUnblockingId(null);
    },
  });

  const handleUnblock = (userId: string) => {
    setUnblockingId(userId);
    unblockUser(userId);
  };

  const blockedUsers = data?.users || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center gap-4 py-8">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-surface rounded-lg transition-colors"
          >
            <svg className="h-5 w-5 text-dark-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-dark-grey">
            {t('blockedUsers')}
          </h1>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-surface rounded-full mb-4">
              <svg className="h-8 w-8 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <p className="text-medium-grey">
              {t('noBlockedUsers')}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {blockedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-divider"
              >
                <Avatar
                  src={user.avatar_url}
                  alt={user.display_name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-dark-grey font-medium truncate">
                    {user.display_name}
                  </p>
                  <p className="text-medium-grey text-sm truncate">
                    @{user.username}
                  </p>
                </div>
                <button
                  onClick={() => handleUnblock(user.id)}
                  disabled={unblockingId === user.id}
                  className="px-4 py-2 text-sm font-medium text-dark-grey border border-divider rounded-lg hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unblockingId === user.id ? '...' : t('unblock')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
