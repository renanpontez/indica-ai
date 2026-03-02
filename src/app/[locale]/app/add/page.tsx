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
import { StarRatingSelector } from '@/features/add/components/StarRatingSelector';
import { RatingAddonChips } from '@/features/add/components/RatingAddonChips';
import { SelectedPlaceCard } from '@/features/add/components/SelectedPlaceCard';
import { TagSelector } from '@/features/add/components/TagSelector';
import { getRatingTier } from '@/lib/constants/rating-addons';
import { ImagePicker } from '@/features/add/components/ImagePicker';
import { VisibilitySelector } from '@/features/add/components/VisibilitySelector';
import { ExistingPlaceModal } from '@/features/add/components/ExistingPlaceModal';
import { InfoPopover } from '@/components/InfoPopover';
import { useLocationContext } from '@/features/add/hooks/useLocationContext';
import { useCreateExperience } from '@/features/add/hooks/useCreateExperience';
import { api } from '@/lib/api/endpoints';
import type { PlaceSearchResult, PriceRange, ExperienceVisibility, PlaceStats, StarRating } from '@/lib/models';

export default function AddPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const { locationState } = useLocationContext();
  const { mutate: createExperience, isPending } = useCreateExperience();

  const breadcrumbItems = [
    { label: t('nav.feed'), href: routePaths.app.feed() },
    { label: t('nav.add') },
  ];

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Manual mode state
  const [manualName, setManualName] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');

  // Shared state
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);
  const [rating, setRating] = useState<StarRating | null>(null);
  const [ratingAddons, setRatingAddons] = useState<string[]>([]);
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
      setShowManualEntry(true);
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
    setShowManualEntry(false);
    setManualName('');
    setManualAddress('');
    setManualCity('');
    setManualCountry('');
  };

  const handleManualFallback = () => {
    setShowManualEntry(true);
  };

  const handleBackToSearch = () => {
    setShowManualEntry(false);
    setManualName('');
    setManualAddress('');
    setManualCity('');
    setManualCountry('');
  };

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (showManualEntry) {
      if (!manualName.trim()) newErrors.name = t('add.errors.nameRequired');
      if (!manualCity.trim()) newErrors.city = t('add.errors.cityRequired');
      if (!manualCountry.trim()) newErrors.country = t('add.errors.countryRequired');
    } else {
      if (!selectedPlace) newErrors.place = t('add.errors.placeRequired');
    }

    if (!rating) newErrors.rating = t('add.errors.ratingRequired');
    if (!priceRange) newErrors.priceRange = t('add.errors.priceRangeRequired');
    if (tags.length === 0) newErrors.tags = t('add.errors.tagsRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let placeId = selectedPlace?.id;

    // If manual mode or Google Places result (no id), create place first
    if (showManualEntry || (!showManualEntry && selectedPlace && !selectedPlace.id)) {
      setIsCreatingPlace(true);
      try {
        const placeData = showManualEntry
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
        rating: rating!,
        rating_addons: ratingAddons,
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
    !rating ||
    !priceRange ||
    tags.length === 0 ||
    (!showManualEntry && !selectedPlace) ||
    (showManualEntry && (!manualName.trim() || !manualCity.trim() || !manualCountry.trim()));

  // Progressive reveal: derive which sections are visible
  const hasPlace = !!selectedPlace || (showManualEntry && !!manualName.trim() && !!manualCity.trim());
  const hasRating = !!rating;
  const hasPriceRange = !!priceRange;

  const fadeIn = 'transition-all duration-300 ease-in-out';
  const hidden = 'opacity-0 max-h-0 overflow-hidden pointer-events-none';
  const visible = 'opacity-100 max-h-[2000px]';

  return (
    <div className="min-h-screen bg-white pb-24">
      <Breadcrumb items={breadcrumbItems} />

      <div className="space-y-md 2xl:max-w-[1400px] max-w-[1000px] mx-auto py-4 px-4 lg:px-0">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-2">
          {/* Left Column: Place Selection + Tags + Optional */}
          <div className="flex gap-4 flex-col">
            {/* Compact Location Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {locationState.status === 'requesting' && (
                <>
                  <div className="animate-spin h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full" />
                  <span className="text-medium-grey">{t('add.location.detecting')}</span>
                </>
              )}
              {locationState.status === 'success' && (
                <>
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700">
                    {t('add.location.usingLocation')} {locationState.city && `(${locationState.city})`}
                  </span>
                </>
              )}
              {(locationState.status === 'gps_denied' || locationState.status === 'ip_failed') && (
                <>
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span className="text-amber-700">{t('add.location.searchingGlobal')}</span>
                </>
              )}
            </div>

            {/* Place Search or Manual Entry */}
            {!selectedPlace && !showManualEntry && (
              <div>
                <label className="block text-title-m font-medium text-dark-grey mb-md">
                  {t('add.search.label')} <span className="text-red-500">*</span>
                </label>
                <PlaceSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onPlaceSelect={handlePlaceSelect}
                  onManualFallback={handleManualFallback}
                  lat={locationState.status === 'success' ? locationState.lat : undefined}
                  lng={locationState.status === 'success' ? locationState.lng : undefined}
                />
                {errors.place && (
                  <p className="mt-1.5 text-small text-red-500">{errors.place}</p>
                )}
              </div>
            )}

            {/* Selected Place Card */}
            {selectedPlace && !showManualEntry && (
              <SelectedPlaceCard place={selectedPlace} onClear={clearPlaceSelection} />
            )}

            {/* Manual Entry */}
            {showManualEntry && (
              <div className="space-y-md">
                <button
                  onClick={handleBackToSearch}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  {t('add.search.backToSearch')}
                </button>

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
                      className={manualCity ? 'border-green-300 bg-green-50 cursor-not-allowed opacity-60' : ''}
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
                      className={manualCountry ? 'border-green-300 bg-green-50 cursor-not-allowed opacity-60' : ''}
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

            {/* Description */}
            <div>
              <label className="block text-title-m font-medium text-dark-grey mb-md">
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

            <div className={`${fadeIn} ${hasPriceRange ? visible : hidden}`}>
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

          {/* Right Column: Rating + Price Range + Images + Visibility */}
          <div className="flex gap-4 flex-col">
            {/* Required: Rating — visible after place is selected */}
            <div className={`${fadeIn} ${hasPlace ? visible : hidden}`}>
              <label className="block text-title-m font-medium text-dark-grey mb-md">
                {t('add.rating')} <span className="text-red-500">*</span>
              </label>
              <StarRatingSelector
                value={rating}
                onChange={(value) => {
                  const prevTier = rating ? getRatingTier(rating) : null;
                  const newTier = getRatingTier(value);
                  setRating(value);
                  if (prevTier !== newTier) {
                    setRatingAddons([]);
                  }
                  setErrors({ ...errors, rating: '' });
                }}
                error={errors.rating}
                addonSlot={
                  rating ? (
                    <RatingAddonChips
                      rating={rating}
                      value={ratingAddons}
                      onChange={setRatingAddons}
                    />
                  ) : undefined
                }
              />
            </div>

            {/* Required: Price Range — visible after rating */}
            <div className={`${fadeIn} ${hasRating ? visible : hidden}`}>
              <div className="flex items-center gap-1.5 mb-md">
                <label className="text-title-m font-medium text-dark-grey">
                  {t('add.priceRange')} <span className="text-red-500">*</span>
                </label>
                <InfoPopover>
                  <p className="text-sm font-medium text-dark-grey mb-2">{t('add.priceRangeInfo.title')}</p>
                  <ul className="space-y-1.5 text-sm text-medium-grey">
                    {(['$', '$$', '$$$', '$$$$'] as const).map((range) => (
                      <li key={range} className="flex gap-2">
                        <span className="font-medium text-dark-grey w-10 shrink-0">{range}</span>
                        <span>{t(`add.priceRangeInfo.${range}`)}</span>
                      </li>
                    ))}
                  </ul>
                </InfoPopover>
              </div>
              <PriceRangeSelector
                value={priceRange}
                onChange={(value) => {
                  setPriceRange(value);
                  setErrors({ ...errors, priceRange: '' });
                }}
                error={errors.priceRange}
              />
            </div>

            {/* Images + Visibility — visible after price range */}
            <div className={`${fadeIn} ${hasPriceRange ? visible : hidden} flex gap-4 flex-col`}>
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

        </div>

        {/* Submit Button */}
        <div className={`${fadeIn} ${hasPriceRange ? visible : hidden}`}>
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
