'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ExploreResponse } from '@/lib/api/endpoints';

interface UseExploreOptions {
  city?: string;
  category?: string;
  limit?: number;
}

export function useExplore(options: UseExploreOptions = {}) {
  const [data, setData] = useState<ExploreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchExplore = useCallback(async (newOffset = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.getExplore({
        city: options.city,
        category: options.category,
        limit: options.limit || 20,
        offset: newOffset,
      });

      if (newOffset === 0) {
        setData(result);
      } else {
        setData(prev => prev ? {
          ...result,
          experiences: [...prev.experiences, ...result.experiences],
        } : result);
      }
      setOffset(newOffset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load explore data');
    } finally {
      setIsLoading(false);
    }
  }, [options.city, options.category, options.limit]);

  useEffect(() => {
    fetchExplore(0);
  }, [fetchExplore]);

  const loadMore = useCallback(() => {
    if (data && data.experiences.length < data.total) {
      fetchExplore(offset + (options.limit || 20));
    }
  }, [data, offset, options.limit, fetchExplore]);

  const hasMore = data ? data.experiences.length < data.total : false;

  return {
    experiences: data?.experiences || [],
    cities: data?.cities || [],
    categories: data?.categories || [],
    total: data?.total || 0,
    isLoading,
    error,
    loadMore,
    hasMore,
    refetch: () => fetchExplore(0),
  };
}
