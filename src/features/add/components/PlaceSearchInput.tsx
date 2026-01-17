'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/Input';
import { api } from '@/lib/api/endpoints';
import type { Place } from '@/lib/models';

interface PlaceSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: Place) => void;
  lat?: number;
  lng?: number;
}

export function PlaceSearchInput({
  value,
  onChange,
  onPlaceSelect,
  lat,
  lng,
}: PlaceSearchInputProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
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
        label="Search for a place"
        placeholder="Restaurant, cafe, bar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />

      {isSearching && (
        <div className="absolute right-3 top-[38px] text-medium-grey">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((place) => (
            <button
              key={place.id}
              onClick={() => {
                onPlaceSelect(place);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-surface transition-colors"
            >
              <p className="text-body font-medium text-dark-grey">
                {place.name}
              </p>
              <p className="text-small text-medium-grey">
                {place.city}, {place.country}
              </p>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value.length >= 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg p-3">
          <p className="text-small text-medium-grey">
            No places found. You can create a custom entry below.
          </p>
        </div>
      )}
    </div>
  );
}
