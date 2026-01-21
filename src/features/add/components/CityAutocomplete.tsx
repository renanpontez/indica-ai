'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/Input';

interface AddressSearchResult {
  place_id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  lat?: number;
  lng?: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (data: {
    address: string;
    city: string;
    state: string;
    country: string;
    description: string;
  }) => void;
  disabled?: boolean;
  error?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  disabled,
  error,
}: AddressAutocompleteProps) {
  const t = useTranslations();
  const [suggestions, setSuggestions] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const justSelectedRef = useRef(false);

  useEffect(() => {
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
        const params = new URLSearchParams({ q: value });
        const response = await fetch(`/api/cities/search?${params.toString()}`);
        if (response.ok) {
          const results = await response.json();
          setSuggestions(results);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Address search failed:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <Input
        placeholder={t('add.manual.addressSearchPlaceholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        autoComplete="off"
        disabled={disabled}
        error={error}
      />

      {isSearching && (
        <div className="absolute right-3 top-[12px] text-medium-grey">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((result) => (
            <button
              key={result.place_id}
              onClick={() => {
                justSelectedRef.current = true;
                onAddressSelect({
                  address: result.address,
                  city: result.city,
                  state: result.state,
                  country: result.country,
                  description: result.description,
                });
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-surface transition-colors"
            >
              <p className="text-body font-medium text-dark-grey">
                {result.address}
              </p>
              <p className="text-small text-medium-grey">
                {result.description}
              </p>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && value.length >= 2 && suggestions.length === 0 && !isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg p-3">
          <p className="text-small text-medium-grey">
            {t('add.manual.noAddressFound')}
          </p>
        </div>
      )}
    </div>
  );
}
