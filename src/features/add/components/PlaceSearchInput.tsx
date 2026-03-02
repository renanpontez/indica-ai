'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/Input';
import { InfoPopover } from '@/components/InfoPopover';
import { api } from '@/lib/api/endpoints';
import type { PlaceSearchResult } from '@/lib/models';

interface PlaceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceSearchResult) => void;
  onManualFallback?: () => void;
  lat?: number;
  lng?: number;
  disabled?: boolean;
}

export function PlaceSearchInput({
  value,
  onChange,
  onPlaceSelect,
  onManualFallback,
  lat,
  lng,
  disabled,
}: PlaceSearchInputProps) {
  const t = useTranslations();
  const [suggestions, setSuggestions] = useState<PlaceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Track when a place was just selected to prevent dropdown from reopening
  const justSelectedRef = useRef(false);

  useEffect(() => {
    // If a place was just selected, skip the search
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.searchPlaces(value, lat, lng);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, lat, lng]);

  return (
    <div className="relative">
      <Input
        placeholder={t('add.search.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        autoComplete="off"
        disabled={disabled}
      />

      {isSearching && (
        <div className="absolute right-3 top-[12px] text-medium-grey">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <button
              key={place.id || `google-${place.google_place_id}-${index}`}
              onClick={() => {
                justSelectedRef.current = true;
                onPlaceSelect(place);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-2">
                <p className="text-body font-medium text-dark-grey flex-1">
                  {place.name}
                </p>
                {/* Recommendation count with popover */}
                {place.recommendation_count && place.recommendation_count > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <InfoPopover>
                      <p className="text-sm text-medium-grey">{t('add.search.recCountTooltip')}</p>
                    </InfoPopover>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                    {place.recommendation_count}
                  </span>
                )}
                {place.source === 'google' && (
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                    Google
                  </span>
                )}
              </div>
              <p className="text-small text-medium-grey">
                {place.address || `${place.city}, ${place.country}`}
              </p>
            </button>
          ))}
          {onManualFallback && (
            <button
              onClick={() => {
                onManualFallback();
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 border-t border-divider text-sm text-primary hover:bg-surface transition-colors"
            >
              {t('add.search.addManually')}
            </button>
          )}
        </div>
      )}

      {showSuggestions && value.length >= 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg p-3">
          <p className="text-small text-medium-grey mb-2">
            {t('add.search.noResults')}
          </p>
          {onManualFallback && (
            <button
              onClick={() => {
                onManualFallback();
                setShowSuggestions(false);
              }}
              className="text-sm text-primary font-medium hover:underline"
            >
              {t('add.search.addManually')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
