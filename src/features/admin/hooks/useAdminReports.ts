'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api, type AdminReportGroup } from '@/lib/api/endpoints';

interface UseAdminReportsParams {
  status?: string;
}

export function useAdminReports(params: UseAdminReportsParams = {}) {
  const [groups, setGroups] = useState<AdminReportGroup[]>([]);
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
        const data = await api.admin.getReports(paramsRef.current);
        if (!cancelled) {
          setGroups(data.groups);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch reports');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [params.status, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return { groups, isLoading, error, refetch };
}

export function useDismissReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dismiss = async (id: string, scope: 'single' | 'all' = 'single') => {
    setIsLoading(true);
    setError(null);
    try {
      await api.admin.dismissReport(id, scope);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss report');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { dismiss, isLoading, error };
}
