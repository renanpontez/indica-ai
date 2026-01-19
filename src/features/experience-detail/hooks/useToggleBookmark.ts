import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type FeedResponse } from '@/lib/api/endpoints';
import type { ExperienceFeedItem } from '@/lib/models';

interface ToggleBookmarkParams {
  experienceId: string;
  bookmarkId?: string;
  isBookmarked: boolean;
}

// Helper to update bookmark state in an experience
function updateExperienceBookmark(
  experience: ExperienceFeedItem,
  experienceId: string,
  newIsBookmarked: boolean,
  newBookmarkId?: string
): ExperienceFeedItem {
  if (experience.experience_id === experienceId) {
    return {
      ...experience,
      isBookmarked: newIsBookmarked,
      bookmarkId: newBookmarkId,
    };
  }
  return experience;
}

// Helper to update feed data
function updateFeedData(
  oldData: FeedResponse | undefined,
  experienceId: string,
  newIsBookmarked: boolean,
  newBookmarkId?: string
): FeedResponse | undefined {
  if (!oldData) return oldData;
  return {
    ...oldData,
    mySuggestions: oldData.mySuggestions.map(exp =>
      updateExperienceBookmark(exp, experienceId, newIsBookmarked, newBookmarkId)
    ),
    communitySuggestions: oldData.communitySuggestions.map(exp =>
      updateExperienceBookmark(exp, experienceId, newIsBookmarked, newBookmarkId)
    ),
    nearbyPlaces: oldData.nearbyPlaces.map(exp =>
      updateExperienceBookmark(exp, experienceId, newIsBookmarked, newBookmarkId)
    ),
  };
}

// Helper to update bookmarks list
function updateBookmarksList(
  oldData: ExperienceFeedItem[] | undefined,
  experienceId: string,
  isRemoving: boolean
): ExperienceFeedItem[] | undefined {
  if (!oldData) return oldData;
  if (isRemoving) {
    return oldData.filter(exp => exp.experience_id !== experienceId);
  }
  return oldData;
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ experienceId, bookmarkId, isBookmarked }: ToggleBookmarkParams) => {
      if (isBookmarked && bookmarkId) {
        await api.deleteBookmark(bookmarkId);
        return { action: 'removed' as const, experienceId };
      } else {
        const bookmark = await api.createBookmark(experienceId);
        return { action: 'added' as const, experienceId, bookmarkId: bookmark.id };
      }
    },
    onMutate: async ({ experienceId, isBookmarked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

      // Snapshot previous values
      const previousFeed = queryClient.getQueryData<FeedResponse>(['feed']);
      const previousBookmarks = queryClient.getQueryData<ExperienceFeedItem[]>(['bookmarks']);

      // Optimistically update feed
      queryClient.setQueryData<FeedResponse>(['feed'], oldData =>
        updateFeedData(oldData, experienceId, !isBookmarked, isBookmarked ? undefined : 'optimistic')
      );

      // Optimistically update bookmarks list (remove if unbookmarking)
      if (isBookmarked) {
        queryClient.setQueryData<ExperienceFeedItem[]>(['bookmarks'], oldData =>
          updateBookmarksList(oldData, experienceId, true)
        );
      }

      return { previousFeed, previousBookmarks };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
      if (context?.previousBookmarks) {
        queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      }
    },
    onSettled: () => {
      // Refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}
