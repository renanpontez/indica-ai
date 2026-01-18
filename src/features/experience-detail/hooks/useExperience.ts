import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useExperience(slugOrId: string) {
  return useQuery({
    queryKey: ['experience', slugOrId],
    queryFn: () => api.getExperience(slugOrId),
    enabled: !!slugOrId,
  });
}
