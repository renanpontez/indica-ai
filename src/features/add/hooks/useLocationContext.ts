'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api/endpoints';

type LocationState =
  | { status: 'idle' }
  | { status: 'requesting' }
  | { status: 'success'; lat: number; lng: number; city?: string }
  | { status: 'gps_denied' }
  | { status: 'ip_failed' }
  | { status: 'manual_required' };

export function useLocationContext() {
  const [locationState, setLocationState] = useState<LocationState>({
    status: 'idle',
  });

  // Auto-request GPS on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      // No geolocation support, fall back to IP
      fallbackToIP();
      return;
    }

    setLocationState({ status: 'requesting' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          status: 'success',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // GPS denied or failed, try IP fallback
        setLocationState({ status: 'gps_denied' });
      },
      {
        timeout: 10000,
        maximumAge: 300000,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestGPS = useCallback(async () => {
    if (!navigator.geolocation) {
      // GPS not supported, go straight to IP fallback
      await fallbackToIP();
      return;
    }

    setLocationState({ status: 'requesting' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          status: 'success',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      async () => {
        // GPS denied or failed, fallback to IP
        setLocationState({ status: 'gps_denied' });
        await fallbackToIP();
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  const fallbackToIP = useCallback(async () => {
    try {
      const data = await api.getIpLocation();
      if (data.lat && data.lng) {
        setLocationState({
          status: 'success',
          lat: data.lat,
          lng: data.lng,
          city: data.city,
        });
      } else {
        setLocationState({ status: 'ip_failed' });
      }
    } catch (error) {
      setLocationState({ status: 'ip_failed' });
    }
  }, []);

  const requireManualCity = useCallback(() => {
    setLocationState({ status: 'manual_required' });
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number, city: string) => {
    setLocationState({
      status: 'success',
      lat,
      lng,
      city,
    });
  }, []);

  return {
    locationState,
    requestGPS,
    requireManualCity,
    setManualLocation,
  };
}
