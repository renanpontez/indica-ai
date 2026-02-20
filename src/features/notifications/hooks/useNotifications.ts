import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';
import type { NotificationsResponse } from '@/lib/models';

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: api.getNotifications,
    refetchInterval: 60_000,
  });

  const markAllRead = async () => {
    // Optimistic update
    queryClient.setQueryData<NotificationsResponse>(['notifications'], (old) => {
      if (!old) return old;
      return {
        notifications: old.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      };
    });

    try {
      await api.markNotificationsRead();
    } catch {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  };

  return {
    notifications: query.data?.notifications ?? [],
    unreadCount: query.data?.unreadCount ?? 0,
    isLoading: query.isLoading,
    markAllRead,
  };
}
