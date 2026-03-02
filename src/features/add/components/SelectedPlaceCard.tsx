'use client';

import { useTranslations } from 'next-intl';
import type { PlaceSearchResult } from '@/lib/models';

interface SelectedPlaceCardProps {
  place: PlaceSearchResult;
  onClear: () => void;
}

export function SelectedPlaceCard({ place, onClear }: SelectedPlaceCardProps) {
  const t = useTranslations('add');

  return (
    <div className="bg-surface rounded-surface p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-dark-grey">{place.name}</h3>
          <p className="text-sm text-medium-grey">
            {place.city}, {place.country}
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-primary font-medium hover:underline shrink-0"
        >
          {t('selectedPlace.change')}
        </button>
      </div>

      {place.address && (
        <div className="flex items-start gap-2 text-sm text-medium-grey">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span>{place.address}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        {place.google_maps_url && (
          <a
            href={place.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {t('selectedPlace.viewOnMaps')}
          </a>
        )}

        {place.instagram_handle && (
          <span className="flex items-center gap-1 text-medium-grey">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            {place.instagram_handle}
          </span>
        )}

        {place.recommendation_count && place.recommendation_count > 0 && (
          <span className="flex items-center gap-1 text-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {t('selectedPlace.recommendations', { count: place.recommendation_count })}
          </span>
        )}
      </div>
    </div>
  );
}
