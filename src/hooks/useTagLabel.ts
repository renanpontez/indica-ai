'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Tag } from '@/lib/models';

export function useTagLabel() {
  const queryClient = useQueryClient();

  const getTagLabel = useCallback(
    (slug: string): string => {
      // Try to get display_name from cached tags
      const cachedTags = queryClient.getQueryData<Tag[]>(['tags']);
      const tag = cachedTags?.find((t) => t.slug === slug);

      if (tag?.display_name) {
        return tag.display_name;
      }

      // Fallback: format slug nicely (capitalize first letter, replace hyphens with spaces)
      return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    [queryClient]
  );

  return { getTagLabel };
}
