'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { PriceRange } from '@/lib/models';

interface ImageGalleryProps {
  images: string[];
  placeName: string;
  priceRange?: PriceRange;
}

export function ImageGallery({ images, placeName, priceRange }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Placeholder images for demo purposes when no images provided
  const placeholderImages = [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
  ];

  const displayImages = images.length > 0 ? images : placeholderImages;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-3">
        {/* Main Image */}
        <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden bg-surface">
          <img
            src={displayImages[currentIndex]}
            alt={`${placeName} - Image ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Price Badge */}
          {priceRange && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-small font-medium text-dark-grey shadow-sm">
              {priceRange}
            </div>
          )}

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
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
            </>
          )}
        </div>

        {/* Thumbnail Sidebar - Only show on desktop with multiple images */}
        {displayImages.length > 1 && (
          <div className="hidden md:flex flex-col gap-3 w-28">
            {displayImages.slice(0, 3).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'aspect-square rounded-lg overflow-hidden transition-all',
                  index === currentIndex
                    ? 'ring-2 ring-primary ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${placeName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
            {displayImages.length > 3 && (
              <div className="aspect-square rounded-lg bg-surface flex items-center justify-center text-medium-grey text-small font-medium">
                +{displayImages.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Dots */}
      {displayImages.length > 1 && (
        <div className="flex md:hidden justify-center gap-2 mt-3">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-divider w-2 hover:bg-text-secondary'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
