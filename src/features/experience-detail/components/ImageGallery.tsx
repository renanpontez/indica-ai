'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { PriceRange } from '@/lib/models';
import { PlaceholderImage } from '@/components/PlaceholderImage';

interface ImageGalleryProps {
  images: string[];
  placeName: string;
  priceRange?: PriceRange;
}

export function ImageGallery({ images, placeName, priceRange }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = images && images.length > 0;
  const hasMultipleImages = hasImages && images.length > 1;

  const goToPrevious = () => {
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!hasMultipleImages) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Fallback: No images - show placeholder
  if (!hasImages) {
    return (
      <div className="relative w-full">
        <div className="aspect-[16/9] md:aspect-[21/5] rounded-xl overflow-hidden bg-gradient-to-br from-surface to-divider flex items-center justify-center">
          <div className="text-center p-8">
            <PlaceholderImage
              size="sm"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300 mb-2"
            />
            <p className="text-medium-grey text-body font-medium">{placeName}</p>
            <p className="text-medium-grey/70 text-small">Imagem não disponível</p>
          </div>
          {/* Price Badge */}
          {priceRange && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-small font-medium text-dark-grey shadow-sm">
              {priceRange}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Single image layout
  if (!hasMultipleImages) {
    return (
      <div className="relative w-full">
        <div className="aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-surface">
          <img
            src={images[0]}
            alt={placeName}
            className="h-full w-full object-cover"
          />
          {/* Price Badge */}
          {priceRange && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-small font-medium text-dark-grey shadow-sm">
              {priceRange}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Multiple images layout with side preview
  return (
    <div className="relative w-full">
      <div className="flex gap-2 md:gap-3">
        {/* Main Image */}
        <div className="relative flex-1 aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-surface">
          <img
            src={images[currentIndex]}
            alt={`${placeName} - Image ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Price Badge */}
          {priceRange && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-small font-medium text-dark-grey shadow-sm">
              {priceRange}
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-dark-grey rounded-full p-2 transition-colors shadow-sm"
            aria-label="Previous image"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-dark-grey rounded-full p-2 transition-colors shadow-sm"
            aria-label="Next image"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter - Mobile */}
          <div className="absolute bottom-3 right-3 md:hidden bg-black/60 text-white text-small px-2 py-1 rounded-md">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Sidebar - Desktop only */}
        <div className="hidden md:flex flex-col gap-2 w-32 lg:w-40">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative flex-1 min-h-0 rounded-lg overflow-hidden transition-all',
                index === currentIndex
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${placeName} thumbnail ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Show "+X more" overlay on last visible thumbnail if there are more images */}
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium">+{images.length - 4}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentIndex
                ? 'bg-primary w-6'
                : 'bg-divider w-2 hover:bg-medium-grey'
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
