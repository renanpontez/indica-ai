'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, type AdminFlaggedUser } from '@/lib/api/endpoints';

export function useAdminFlaggedUsers() {
  const [users, setUsers] = useState<AdminFlaggedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.admin.getFlaggedUsers();
        if (!cancelled) {
          setUsers(data.users);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch flagged users');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return { users, isLoading, error, refetch };
}

export function useModerateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moderate = async (
    userId: string,
    action: 'suspend' | 'unsuspend' | 'ban',
    reason?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.admin.moderateUser(userId, action, reason);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to moderate user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { moderate, isLoading, error };
}
