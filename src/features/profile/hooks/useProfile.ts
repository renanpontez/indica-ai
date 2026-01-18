import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => api.getUserProfile(userId),
    enabled: !!userId,
  });
}
