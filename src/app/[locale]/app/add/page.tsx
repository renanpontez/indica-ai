'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { useTranslations } from 'next-intl';
import { routes, routePaths, type Locale } from '@/lib/routes';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { PlaceSearchInput } from '@/features/add/components/PlaceSearchInput';
import { AddressAutocomplete } from '@/features/add/components/CityAutocomplete';
import { PriceRangeSelector } from '@/features/add/components/PriceRangeSelector';
import { TagSelector } from '@/features/add/components/TagSelector';
import { ImagePicker } from '@/features/add/components/ImagePicker';
import { VisibilitySelector } from '@/features/add/components/VisibilitySelector';
import { ExistingPlaceModal } from '@/features/add/components/ExistingPlaceModal';
import { useLocationContext } from '@/features/add/hooks/useLocationContext';
import { useCreateExperience } from '@/features/add/hooks/useCreateExperience';
import { api } from '@/lib/api/endpoints';
import type { PlaceSearchResult, PriceRange, ExperienceVisibility, PlaceStats } from '@/lib/models';

type InputMode = 'search' | 'manual';

export default function AddPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const { locationState, requestGPS } = useLocationContext();
  const { mutate: createExperience, isPending } = useCreateExperience();

  const breadcrumbItems = [
    { label: t('nav.feed'), href: routePaths.app.feed() },
    { label: t('nav.add') },
  ];

  // Input mode: search (GPS-based) or manual
  const [inputMode, setInputMode] = useState<InputMode>('search');

  // Search mode state
  const [searchQuery, setSearchQuery] = useState('');

  // Manual mode state
  const [manualName, setManualName] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');

  // Shared state
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [visibility, setVisibility] = useState<ExperienceVisibility>('friends_only');

  const [showOptional, setShowOptional] = useState(false);

  // Existing place modal state
  const [showExistingPlaceModal, setShowExistingPlaceModal] = useState(false);
  const [pendingPlace, setPendingPlace] = useState<PlaceSearchResult | null>(null);
  const [placeStats, setPlaceStats] = useState<PlaceStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch place stats when modal opens
  useEffect(() => {
    if (showExistingPlaceModal && pendingPlace?.id) {
      setIsLoadingStats(true);
      fetch(`/api/places/${pendingPlace.id}/stats`)
        .then((res) => res.json())
        .then((data) => setPlaceStats(data))
        .catch(console.error)
        .finally(() => setIsLoadingStats(false));
    }
  }, [showExistingPlaceModal, pendingPlace?.id]);

  const handlePlaceSelect = (place: PlaceSearchResult) => {
    // If place has existing recommendations, show the modal
    if (place.recommendation_count && place.recommendation_count > 0) {
      setPendingPlace(place);
      setShowExistingPlaceModal(true);
    } else {
      // No existing recommendations, select directly
      setSelectedPlace(place);
      setSearchQuery(place.name);
      setErrors({ ...errors, place: '' });
    }
  };

  const handleUseExistingPlace = () => {
    if (pendingPlace) {
      setSelectedPlace(pendingPlace);
      setSearchQuery(pendingPlace.name);
      setErrors({ ...errors, place: '' });
    }
    setShowExistingPlaceModal(false);
    setPendingPlace(null);
    setPlaceStats(null);
  };

  const handleCreateNewPlace = () => {
    // User wants to create a new place instead - switch to manual mode
    if (pendingPlace) {
      setInputMode('manual');
      setManualName(pendingPlace.name);
      setManualCity(pendingPlace.city);
      setManualCountry(pendingPlace.country);
      setManualAddress(pendingPlace.address || '');
    }
    setShowExistingPlaceModal(false);
    setPendingPlace(null);
    setPlaceStats(null);
  };

  const clearPlaceSelection = () => {
    setSelectedPlace(null);
    setSearchQuery('');
    setManualName('');
    setManualAddress('');
    setManualCity('');
    setManualCountry('');
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (inputMode === 'manual') {
      if (!manualName.trim()) newErrors.name = t('add.errors.nameRequired');
      if (!manualCity.trim()) newErrors.city = t('add.errors.cityRequired');
      if (!manualCountry.trim()) newErrors.country = t('add.errors.countryRequired');
    } else {
      if (!selectedPlace) newErrors.place = t('add.errors.placeRequired');
    }

    if (!priceRange) newErrors.priceRange = t('add.errors.priceRangeRequired');
    if (tags.length === 0) newErrors.tags = t('add.errors.tagsRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let placeId = selectedPlace?.id;

    // If manual mode or Google Places result (no id), create place first
    if (inputMode === 'manual' || (inputMode === 'search' && selectedPlace && !selectedPlace.id)) {
      setIsCreatingPlace(true);
      try {
        const placeData = inputMode === 'manual'
          ? {
            name: manualName.trim(),
            city: manualCity.trim(),
            country: manualCountry.trim(),
            address: manualAddress.trim() || undefined,
            instagram_handle: instagramHandle.trim() || undefined,
          }
          : {
            name: selectedPlace!.name,
            city: selectedPlace!.city,
            country: selectedPlace!.country,
            address: selectedPlace!.address || undefined,
            lat: selectedPlace!.lat || undefined,
            lng: selectedPlace!.lng || undefined,
            google_place_id: selectedPlace!.google_place_id || undefined,
            google_maps_url: selectedPlace!.google_maps_url || undefined,
          };
        const newPlace = await api.createPlace(placeData);
        placeId = newPlace.id;
      } catch (error) {
        console.error('Failed to create place:', error);
        setErrors({ place: t('add.errors.createPlaceFailed') });
        setIsCreatingPlace(false);
        return;
      }
      setIsCreatingPlace(false);
    }

    // Upload images if any
    let imageUrls: string[] | null = null;
    if (images.length > 0) {
      setIsUploadingImages(true);
      try {
        const formData = new FormData();
        images.forEach((file) => {
          formData.append('files', file);
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload images');
        }

        const { urls } = await response.json();
        imageUrls = urls;
      } catch (error) {
        console.error('Failed to upload images:', error);
        setErrors({ images: t('add.images.uploadError') });
        setIsUploadingImages(false);
        return;
      }
      setIsUploadingImages(false);
    }

    // Create experience
    createExperience(
      {
        place_id: placeId!,
        price_range: priceRange!,
        tags,
        brief_description: description || null,
        phone_number: phoneNumber || null,
        images: imageUrls,
        visit_date: null,
        visibility,
      } as any,
      {
        onSuccess: () => {
          router.push(routes.app.feed(locale));
        },
      }
    );
  };

  const isSubmitDisabled =
    isPending ||
    isCreatingPlace ||
    isUploadingImages ||
    !priceRange ||
    tags.length === 0 ||
    (inputMode === 'search' && !selectedPlace) ||
    (inputMode === 'manual' && (!manualName.trim() || !manualCity.trim() || !manualCountry.trim()));

  return (
    <div className="min-h-screen bg-white pb-24">
      <Breadcrumb items={breadcrumbItems} />

      <div className="space-y-md 2xl:max-w-[1400px] max-w-[1000px] mx-auto py-4 px-4 md:px-2">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-2">
          <div className="flex gap-4 flex-col">
            {/* Input Mode Toggle */}
            <div className="flex gap-2 p-1 bg-surface rounded-surface">
              <button
                onClick={() => {
                  setInputMode('search');
                  clearPlaceSelection();
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-body font-medium transition-colors ${inputMode === 'search'
                  ? 'bg-white text-dark-grey shadow-sm'
                  : 'text-medium-grey hover:text-dark-grey'
                  }`}
              >
                {t('add.inputMode.search')}
              </button>
              <button
                onClick={() => {
                  setInputMode('manual');
                  clearPlaceSelection();
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-body font-medium transition-colors ${inputMode === 'manual'
                  ? 'bg-white text-dark-grey shadow-sm'
                  : 'text-medium-grey hover:text-dark-grey'
                  }`}
              >
                {t('add.inputMode.manual')}
              </button>
            </div>
            {/* Search Mode */}
            {inputMode === 'search' && (
              <>
                {/* Location Context - Info Card */}
                {locationState.status === 'idle' && (
                  <div className="bg-surface p-md rounded-surface">
                    <h3 className="text-title-m font-bold text-dark-grey mb-sm">
                      {t('add.location.enableTitle')}
                    </h3>
                    <p className="text-body text-medium-grey mb-md">
                      {t('add.location.enableDescription')}
                    </p>
                    <Button onClick={requestGPS} className="w-full h-[52px] bg-primary text-white">
                      {t('add.location.enableButton')}
                    </Button>
                  </div>
                )}

                {locationState.status === 'requesting' && (
                  <div className="bg-surface p-md rounded-surface">
                    <p className="text-small text-medium-grey">{t('add.location.requesting')}</p>
                  </div>
                )}

                {locationState.status === 'success' && (
                  <div className="bg-surface p-md rounded-surface">
                    <p className="text-small text-primary font-medium">
                      {t('add.location.enabled')} {locationState.city && `(${locationState.city})`}
                    </p>
                  </div>
                )}

                {(locationState.status === 'gps_denied' || locationState.status === 'ip_failed') && (
                  <div className="bg-yellow-50 p-md rounded-surface border border-yellow-200">
                    <p className="text-small text-yellow-800">
                      {t('add.location.unavailable')}
                    </p>
                  </div>
                )}

                {/* Place Search */}
                <div>
                  <label className="block text-small font-medium text-dark-grey mb-2">
                    {t('add.search.label')} <span className="text-red-500">*</span>
                  </label>
                  <PlaceSearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onPlaceSelect={handlePlaceSelect}
                    lat={locationState.status === 'success' ? locationState.lat : undefined}
                    lng={locationState.status === 'success' ? locationState.lng : undefined}
                  />
                  {errors.place && (
                    <p className="mt-1.5 text-small text-red-500">{errors.place}</p>
                  )}
                </div>

                {/* Selected Place Card */}
                {selectedPlace && (
                  <div className="bg-surface p-3 rounded-surface flex justify-between items-start">
                    <div>
                      <p className="text-title-m font-bold text-dark-grey">
                        {selectedPlace.name}
                      </p>
                      <p className="text-small text-medium-grey">
                        {selectedPlace.city}, {selectedPlace.country}
                      </p>
                    </div>
                    <button
                      onClick={clearPlaceSelection}
                      className="text-medium-grey hover:text-dark-grey p-1"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Manual Entry Mode */}
            {inputMode === 'manual' && (
              <div className="space-y-md">
                <div>
                  <label className="block text-small font-medium text-dark-grey mb-2">
                    {t('add.manual.placeName')} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={t('add.manual.placeNamePlaceholder')}
                    value={manualName}
                    onChange={(e) => {
                      setManualName(e.target.value);
                      setErrors({ ...errors, name: '' });
                    }}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-small text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-small font-medium text-dark-grey mb-2">
                    {t('add.manual.address')}
                  </label>
                  <AddressAutocomplete
                    value={manualAddress}
                    onChange={(value) => {
                      setManualAddress(value);
                    }}
                    onAddressSelect={(data) => {
                      setManualAddress(data.description);
                      setManualCity(data.city);
                      setManualCountry(data.country);
                      setErrors({ ...errors, city: '', country: '' });
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block text-small font-medium text-dark-grey mb-2">
                      {t('add.manual.city')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder={t('add.manual.cityPlaceholder')}
                      value={manualCity}
                      readOnly
                      className={manualCity ? 'border-green-300 bg-green-50 cursor-not-allowed' : ''}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-small text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-small font-medium text-dark-grey mb-2">
                      {t('add.manual.country')} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder={t('add.manual.countryPlaceholder')}
                      value={manualCountry}
                      readOnly
                      className={manualCountry ? 'border-green-300 bg-green-50 cursor-not-allowed' : ''}
                    />
                    {errors.country && (
                      <p className="mt-1.5 text-small text-red-500">{errors.country}</p>
                    )}
                  </div>
                </div>

                {(manualCity || manualCountry) && !errors.city && !errors.country && (
                  <p className="text-xs text-green-600">
                    {t('add.manual.locationAutoFilled')}
                  </p>
                )}
              </div>
            )}

            {/* Required: Price Range */}
            <div>
              <label className="block text-title-m font-medium text-dark-grey mb-md">
                {t('add.priceRange')} <span className="text-red-500">*</span>
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
            <div>
              {/* Divider */}
              <div className="border-t border-divider my-xs" />
              {/* Optional Fields - Collapsible */}
              <button
                onClick={() => setShowOptional(!showOptional)}
                className="flex items-center gap-2 text-medium-grey hover:text-dark-grey transition-colors min-h-[44px]"
              >
                <span className="text-body">{t('add.optional.title')}</span>
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
                      {t('add.optional.instagramHandle')}
                    </label>
                    <Input
                      placeholder={t('add.optional.instagramPlaceholder')}
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-small text-dark-grey mb-2">
                      {t('add.optional.description')}
                    </label>
                    <TextArea
                      placeholder={t('add.optional.descriptionPlaceholder')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="min-h-[88px]"
                    />
                  </div>
                  <div>
                    <label className="block text-small text-dark-grey mb-2">
                      {t('add.optional.phoneNumber')}
                    </label>
                    <Input
                      type="tel"
                      placeholder={t('add.optional.phonePlaceholder')}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="min-h-[44px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 flex-col">
            {/* Required: Tags */}
            <div>
              <label className="block text-title-m font-medium text-dark-grey mb-md">
                {t('add.tags')} <span className="text-red-500">*</span>
              </label>
              <TagSelector
                value={tags}
                onChange={(value) => {
                  setTags(value);
                  setErrors({ ...errors, tags: '' });
                }}
                error={errors.tags}
              />
            </div>
            {/* Images */}
            <div>
              <label className="block text-title-m font-medium text-dark-grey mb-md">
                {t('add.images.title')}
              </label>
              <ImagePicker
                images={images}
                onChange={setImages}
                maxImages={5}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-title-m font-medium text-dark-grey mb-md">
                {t('add.visibility.title')}
              </label>
              <VisibilitySelector
                value={visibility}
                onChange={setVisibility}
              />
            </div>


          </div>

        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          loading={isPending || isCreatingPlace || isUploadingImages}
          disabled={isSubmitDisabled}
          variant="primary"
          className="w-full"
        >
          {isUploadingImages
            ? t('add.images.uploading')
            : isCreatingPlace
              ? t('add.creatingPlace')
              : t('add.savePlace')}
        </Button>
      </div>

      {/* Existing Place Modal */}
      <ExistingPlaceModal
        isOpen={showExistingPlaceModal}
        placeName={pendingPlace?.name || ''}
        placeCity={`${pendingPlace?.city || ''}, ${pendingPlace?.country || ''}`}
        stats={placeStats}
        isLoading={isLoadingStats}
        onUseExisting={handleUseExistingPlace}
        onCreateNew={handleCreateNewPlace}
        onClose={() => {
          setShowExistingPlaceModal(false);
          setPendingPlace(null);
          setPlaceStats(null);
        }}
      />
    </div >
  );
}
