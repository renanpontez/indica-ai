import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useFeed() {
  return useQuery({
    queryKey: ['feed'],
    queryFn: api.getFeed,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
