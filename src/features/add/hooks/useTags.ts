import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';
import type { Tag } from '@/lib/models';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: api.getTags,
    staleTime: 5 * 60 * 1000, // 5 minutes - tags don't change often
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => api.createTag(slug),
    onSuccess: (newTag) => {
      // Optimistically add to cache
      queryClient.setQueryData<Tag[]>(['tags'], (oldTags) => {
        if (!oldTags) return [newTag];
        // Check if tag already exists (shouldn't happen but be safe)
        if (oldTags.some((t) => t.slug === newTag.slug)) return oldTags;
        return [...oldTags, newTag].sort((a, b) => a.slug.localeCompare(b.slug));
      });
    },
  });
}
