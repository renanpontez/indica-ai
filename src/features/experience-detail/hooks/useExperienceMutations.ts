import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';
import type { Experience, ExperienceDetail } from '@/lib/models';

interface UpdateExperienceData {
  price_range?: Experience['price_range'];
  tags?: string[];
  brief_description?: string | null;
  phone_number?: string | null;
  images?: string[] | null;
  visibility?: Experience['visibility'];
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperienceData }) =>
      api.updateExperience(id, data),
    onSuccess: (updatedExperience: ExperienceDetail) => {
      queryClient.invalidateQueries({
        queryKey: ['experience', updatedExperience.id],
      });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['explore'] });
    },
  });
}
