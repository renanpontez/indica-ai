'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api.getBookmarks(),
  });
}
