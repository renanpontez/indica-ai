'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, type AdminExperience } from '@/lib/api/endpoints';

interface UseAdminExperiencesParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export function useAdminExperiences(params: UseAdminExperiencesParams = {}) {
  const [experiences, setExperiences] = useState<AdminExperience[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.admin.getExperiences(paramsRef.current);
        if (!cancelled) {
          setExperiences(data.experiences);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [params.status, params.limit, params.offset, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return { experiences, total, isLoading, error, refetch };
}

export function useModerateExperience() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moderate = async (
    id: string,
    action: 'deactivate' | 'reactivate',
    reason?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.admin.moderateExperience(id, action, reason);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate experience');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { moderate, isLoading, error };
}
