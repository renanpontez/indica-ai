'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { useTranslations } from 'next-intl';
import { TextArea } from '@/components/TextArea';
import { Input } from '@/components/Input';
import { PriceRangeSelector } from '@/features/add/components/PriceRangeSelector';
import { TagSelector } from '@/features/add/components/TagSelector';
import { ImagePicker } from '@/features/add/components/ImagePicker';
import { VisibilitySelector } from '@/features/add/components/VisibilitySelector';
import { useUpdateExperience } from '@/features/experience-detail/hooks/useExperienceMutations';
import { useAuthContext } from '@/lib/auth/AuthContext';
import { api } from '@/lib/api/endpoints';
import type { PriceRange, ExperienceVisibility } from '@/lib/models';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations();
  const { user } = useAuthContext();
  const { mutate: updateExperience, isPending } = useUpdateExperience();

  const experienceId = params.id as string;
  const locale = params.locale as string;

  // Fetch experience data
  const {
    data: experience,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['experience', experienceId],
    queryFn: () => api.getExperience(experienceId),
  });

  // Form state
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [visibility, setVisibility] = useState<ExperienceVisibility>('friends_only');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize form with experience data
  useEffect(() => {
    if (experience && !initialized) {
      setPriceRange(experience.price_range);
      setTags(experience.tags || []);
      setDescription(experience.brief_description || '');
      setPhoneNumber(experience.phone_number || '');
      setExistingImages(experience.images || []);
      setInitialized(true);
    }
  }, [experience, initialized]);

  // Check ownership
  const isOwner = user?.id === experience?.user.id;

  // Redirect if not owner
  useEffect(() => {
    if (experience && user && !isOwner) {
      router.push(`/${locale}/app/experience/${experienceId}/${experience.slug}`);
    }
  }, [experience, user, isOwner, router, locale, experienceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-white p-md">
        <p className="text-red-500">{t('common.error')}</p>
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  const breadcrumbItems = [
    { label: t('nav.feed'), href: `/${locale}/app` },
    {
      label: experience.place.name,
      href: `/${locale}/app/experience/${experienceId}/${experience.slug}`,
    },
    { label: t('experience.edit.title') },
  ];

  const keptImages = existingImages.filter((img) => !removedImages.includes(img));
  const maxNewImages = 5 - keptImages.length;

  const handleSubmit = async () => {
    // Validate
    const newErrors: Record<string, string> = {};
    if (!priceRange) newErrors.priceRange = t('add.errors.priceRangeRequired');
    if (tags.length === 0) newErrors.tags = t('add.errors.tagsRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Upload new images if any
    let finalImages = [...keptImages];

    if (newImages.length > 0) {
      setIsUploadingImages(true);
      try {
        const formData = new FormData();
        newImages.forEach((file) => formData.append('files', file));

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload images');
        }

        const { urls } = await response.json();
        finalImages = [...finalImages, ...urls];
      } catch {
        setErrors({ images: t('add.images.uploadError') });
        setIsUploadingImages(false);
        return;
      }
      setIsUploadingImages(false);
    }

    // Update experience
    updateExperience(
      {
        id: experienceId,
        data: {
          price_range: priceRange!,
          tags,
          brief_description: description || null,
          phone_number: phoneNumber || null,
          images: finalImages.length > 0 ? finalImages : null,
          visibility,
        },
      },
      {
        onSuccess: () => {
          router.push(
            `/${locale}/app/experience/${experienceId}/${experience.slug}`
          );
        },
      }
    );
  };

  const isSubmitDisabled =
    isPending || isUploadingImages || !priceRange || tags.length === 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Breadcrumb items={breadcrumbItems} />

      <div className="p-md space-y-md max-w-[600px] mx-auto">
        {/* Place Info (Read-only) */}
        <div className="bg-surface p-4 rounded-lg">
          <h2 className="text-lg font-bold text-dark-grey">
            {experience.place.name}
          </h2>
          <p className="text-small text-medium-grey">
            {experience.place.city}, {experience.place.country}
          </p>
          <p className="text-xs text-medium-grey mt-2 italic">
            {t('experience.edit.placeNotEditable')}
          </p>
        </div>

        {/* Price Range */}
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

        {/* Tags */}
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

        {/* Existing Images */}
        <div>
          <label className="block text-title-m font-medium text-dark-grey mb-md">
            {t('add.images.title')}
          </label>

          {/* Show existing images with remove option */}
          {keptImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
              {keptImages.map((url, index) => (
                <div key={url} className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemovedImages([...removedImages, url])}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new images */}
          {maxNewImages > 0 && (
            <ImagePicker
              images={newImages}
              onChange={setNewImages}
              maxImages={maxNewImages}
            />
          )}

          {maxNewImages <= 0 && keptImages.length >= 5 && (
            <p className="text-small text-medium-grey text-center">
              {t('add.images.maxReached', { max: 5 })}
            </p>
          )}

          {errors.images && (
            <p className="mt-1.5 text-small text-red-500">{errors.images}</p>
          )}
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-title-m font-medium text-dark-grey mb-md">
            {t('add.visibility.title')}
          </label>
          <VisibilitySelector value={visibility} onChange={setVisibility} />
        </div>

        {/* Divider */}
        <div className="border-t border-divider my-lg" />

        {/* Optional: Description */}
        <div>
          <label className="block text-small text-dark-grey mb-2">
            {t('add.optional.description')}
          </label>
          <TextArea
            placeholder={t('add.optional.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Optional: Phone */}
        <div>
          <label className="block text-small text-dark-grey mb-2">
            {t('add.optional.phoneNumber')}
          </label>
          <Input
            type="tel"
            placeholder={t('add.optional.phonePlaceholder')}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          loading={isPending || isUploadingImages}
          disabled={isSubmitDisabled}
          className="w-full h-[52px] bg-primary text-white rounded-surface disabled:bg-surface disabled:text-medium-grey"
        >
          {isUploadingImages
            ? t('add.images.uploading')
            : t('experience.edit.save')}
        </Button>
      </div>
    </div>
  );
}
