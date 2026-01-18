'use client';

import { useState, useEffect } from 'react';
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
  const [suggestions, setSuggestions] = useState<PlaceSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
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
        placeholder="Search for a place..."
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
                onPlaceSelect(place);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-2">
                <p className="text-body font-medium text-dark-grey flex-1">
                  {place.name}
                </p>
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
            No places found. Use manual entry below to add a new place.
          </p>
        </div>
      )}
    </div>
  );
}
