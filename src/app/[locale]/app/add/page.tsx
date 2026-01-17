'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { PlaceSearchInput } from '@/features/add/components/PlaceSearchInput';
import { PriceRangeSelector } from '@/features/add/components/PriceRangeSelector';
import { CategorySelector } from '@/features/add/components/CategorySelector';
import { useLocationContext } from '@/features/add/hooks/useLocationContext';
import { useCreateExperience } from '@/features/add/hooks/useCreateExperience';
import type { Place, PriceRange } from '@/lib/models';

export default function AddPage() {
  const router = useRouter();
  const { locationState, requestGPS } = useLocationContext();
  const { mutate: createExperience, isPending } = useCreateExperience();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!selectedPlace) newErrors.place = 'Please select or create a place';
    if (!priceRange) newErrors.priceRange = 'Please select a price range';
    if (categories.length === 0) newErrors.categories = 'Please select at least one category';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create experience
    createExperience(
      {
        place_id: selectedPlace!.id,
        price_range: priceRange!,
        categories,
        brief_description: description || null,
        phone_number: phoneNumber || null,
        images: null,
        visit_date: null,
      } as any,
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  };

  const [showOptional, setShowOptional] = useState(false);

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar title="Save a Place" showBack />

      <div className="p-md space-y-md max-w-[600px] mx-auto">
        {/* Location Context - Info Card */}
        {locationState.status === 'idle' && (
          <div className="bg-surface p-md rounded-surface">
            <h3 className="text-title-m font-bold text-dark-grey mb-sm">
              Enable Location
            </h3>
            <p className="text-body text-medium-grey mb-md">
              We use your location to help find nearby places faster.
            </p>
            <Button onClick={requestGPS} className="w-full h-[52px] bg-primary text-white">
              Enable GPS
            </Button>
          </div>
        )}

        {locationState.status === 'requesting' && (
          <div className="bg-surface p-md rounded-surface">
            <p className="text-small text-medium-grey">Getting your location...</p>
          </div>
        )}

        {locationState.status === 'success' && (
          <div className="bg-surface p-md rounded-surface">
            <p className="text-small text-primary font-medium">
              ✓ Location enabled {locationState.city && `(${locationState.city})`}
            </p>
          </div>
        )}

        {/* Place Search */}
        <div>
          <label className="block text-small text-dark-grey mb-2">
            Search for a place
          </label>
          <PlaceSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onPlaceSelect={(place) => {
              setSelectedPlace(place);
              setSearchQuery(place.name);
              setErrors({ ...errors, place: '' });
            }}
            lat={locationState.status === 'success' ? locationState.lat : undefined}
            lng={locationState.status === 'success' ? locationState.lng : undefined}
          />
          {errors.place && (
            <p className="mt-1.5 text-small text-red-500">{errors.place}</p>
          )}
        </div>

        {/* Selected Place Card */}
        {selectedPlace && (
          <div className="bg-surface p-3 rounded-surface">
            <p className="text-title-m font-bold text-dark-grey">
              {selectedPlace.name}
            </p>
            <p className="text-small text-medium-grey">
              {selectedPlace.city}, {selectedPlace.country}
            </p>
          </div>
        )}

        {/* Required: Price Range */}
        <div>
          <label className="block text-title-m font-medium text-dark-grey mb-md">
            Price Range <span className="text-red-500">*</span>
          </label>
          <PriceRangeSelector
            value={priceRange}
            onChange={(value) => {
              setPriceRange(value);
              setErrors({ ...errors, priceRange: '' });
            }}
            error={errors.priceRange}
          />
        </div>

        {/* Required: Categories */}
        <div>
          <label className="block text-title-m font-medium text-dark-grey mb-md">
            Categories <span className="text-red-500">*</span>
          </label>
          <CategorySelector
            value={categories}
            onChange={(value) => {
              setCategories(value);
              setErrors({ ...errors, categories: '' });
            }}
            error={errors.categories}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-divider my-lg" />

        {/* Optional Fields - Collapsible */}
        <div>
          <button
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-2 text-medium-grey hover:text-dark-grey transition-colors min-h-[44px]"
          >
            <span className="text-body">Optional Details</span>
            <svg
              className={`h-4 w-4 transition-transform ${showOptional ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showOptional && (
            <div className="mt-md space-y-md">
              <div>
                <label className="block text-small text-dark-grey mb-2">
                  Instagram Handle
                </label>
                <Input
                  placeholder="@amazingplace"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-small text-dark-grey mb-2">
                  Brief Description
                </label>
                <TextArea
                  placeholder="What did you love about this place?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="min-h-[88px]"
                />
              </div>

              <div>
                <label className="block text-small text-dark-grey mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          loading={isPending}
          disabled={isPending || !selectedPlace || !priceRange || categories.length === 0}
          className="w-full h-[52px] bg-primary text-white rounded-surface disabled:bg-surface disabled:text-medium-grey"
        >
          Save Place
        </Button>
      </div>
    </div>
  );
}
