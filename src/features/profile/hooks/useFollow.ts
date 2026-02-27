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
      await queryClient.cancelQueries({ queryKey: ['follow-status', userId] });
      const previous = queryClient.getQueryData(['follow-status', userId]);
      queryClient.setQueryData(['follow-status', userId], (old: any) => ({
        ...old,
        isFollowing: true,
      }));
      return { previous, userId };
    },
    onError: (_err, userId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['follow-status', userId], context.previous);
      }
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
      const previous = queryClient.getQueryData(['follow-status', userId]);
      queryClient.setQueryData(['follow-status', userId], (old: any) => ({
        ...old,
        isFollowing: false,
      }));
      return { previous, userId };
    },
    onError: (_err, userId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['follow-status', userId], context.previous);
      }
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
