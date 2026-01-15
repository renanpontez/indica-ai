import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: () => api.getExperience(id),
    enabled: !!id,
  });
}
