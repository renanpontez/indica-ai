import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useFollowStatus(userId: string, currentUserId?: string) {
  return useQuery({
    queryKey: ['follow-status', userId, currentUserId],
    queryFn: () => api.getFollowStatus(userId),
    enabled: !!userId && !!currentUserId && userId !== currentUserId,
  });
}

export function useFollow() {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: (userId: string) => api.followUser(userId),
    onMutate: async (userId) => {
      // Cancel any outgoing refetches for this user's follow status
      await queryClient.cancelQueries({ queryKey: ['follow-status', userId] });

      // Snapshot all matching queries for rollback
      const previousEntries: [readonly unknown[], unknown][] = [];
      queryClient.getQueriesData({ queryKey: ['follow-status', userId] }).forEach(([key, data]) => {
        previousEntries.push([key, data]);
      });

      // Optimistically set all matching queries to isFollowing: true
      queryClient.setQueriesData({ queryKey: ['follow-status', userId] }, (old: any) => ({
        ...old,
        isFollowing: true,
      }));

      return { previousEntries, userId };
    },
    onError: (_err, _userId, context) => {
      // Rollback all queries to their previous values
      context?.previousEntries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: (_, __, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (userId: string) => api.unfollowUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['follow-status', userId] });

      const previousEntries: [readonly unknown[], unknown][] = [];
      queryClient.getQueriesData({ queryKey: ['follow-status', userId] }).forEach(([key, data]) => {
        previousEntries.push([key, data]);
      });

      queryClient.setQueriesData({ queryKey: ['follow-status', userId] }, (old: any) => ({
        ...old,
        isFollowing: false,
      }));

      return { previousEntries, userId };
    },
    onError: (_err, _userId, context) => {
      context?.previousEntries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: (_, __, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
    isPending: followMutation.isPending || unfollowMutation.isPending,
  };
}
