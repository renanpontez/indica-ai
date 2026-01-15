import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      experienceId,
      bookmarkId,
      isBookmarked,
    }: {
      experienceId: string;
      bookmarkId?: string;
      isBookmarked: boolean;
    }) => {
      if (isBookmarked && bookmarkId) {
        return api.deleteBookmark(bookmarkId);
      } else {
        return api.createBookmark(experienceId);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
