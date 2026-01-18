'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/Input';
import { api } from '@/lib/api/endpoints';
import type { PlaceSearchResult } from '@/lib/models';

interface PlaceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceSearchResult) => void;
  lat?: number;
  lng?: number;
  disabled?: boolean;
}

export function PlaceSearchInput({
  value,
  onChange,
  onPlaceSelect,
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
                {/* Recommendation count badge */}
                {place.recommendation_count && place.recommendation_count > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-full flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
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
        </div>
      )}

      {showSuggestions && value.length >= 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg p-3">
          <p className="text-small text-medium-grey">
            {t('add.search.noResults')}
          </p>
        </div>
      )}
    </div>
  );
}
