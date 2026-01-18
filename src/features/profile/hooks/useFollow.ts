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
    onSuccess: (_, userId) => {
      // Invalidate follow status and profile queries
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (userId: string) => api.unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate follow status and profile queries
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
