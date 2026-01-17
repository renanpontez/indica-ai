'use client';

import { Avatar } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { ImageGallery } from './ImageGallery';
import { MapLinkButton } from './MapLinkButton';
import { BookmarkButton } from './BookmarkButton';
import { MoreFromUser } from './MoreFromUser';
import type { Experience, User, Place, ExperienceFeedItem } from '@/lib/models';
import { formatTimeAgo } from '@/lib/utils/format';

interface ExperienceDetailLayoutProps {
  experience: Experience;
  user: User;
  place: Place;
  isBookmarked?: boolean;
  bookmarkId?: string;
  moreFromUser?: ExperienceFeedItem[];
}

export function ExperienceDetailLayout({
  experience,
  user,
  place,
  isBookmarked,
  bookmarkId,
  moreFromUser = [],
}: ExperienceDetailLayoutProps) {
  const visitTimeAgo = experience.visit_date
    ? formatTimeAgo(experience.visit_date)
    : null;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-dark-grey mb-1">
              {place.name}
            </h1>
            <p className="text-medium-grey">
              {place.city}, {place.country}
            </p>
          </div>
          <MapLinkButton
            googleMapsUrl={place.google_maps_url}
            placeName={place.name}
            variant="primary"
          />
        </div>

        {/* Image Gallery */}
        <div className="mb-6">
          <ImageGallery
            images={experience.images || []}
            placeName={place.name}
            priceRange={experience.price_range}
          />
        </div>

        {/* Categories and Share */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {experience.categories.map((category, index) => (
              <Chip key={index} label={category} variant="outlined" />
            ))}
          </div>
          <button className="flex items-center gap-2 text-medium-grey hover:text-dark-grey transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-small font-medium">Share</span>
          </button>
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-5 h-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-dark-grey">{experience.price_range}</span>
        </div>

        {/* Instagram Handle */}
        {place.instagram_handle && (
          <a
            href={`https://instagram.com/${place.instagram_handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 mb-4 text-dark-grey hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>{place.instagram_handle}</span>
          </a>
        )}

        {/* Phone Number */}
        {experience.phone_number && (
          <a
            href={`tel:${experience.phone_number}`}
            className="flex items-center gap-3 mb-6 text-dark-grey hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{experience.phone_number}</span>
          </a>
        )}

        {/* Divider */}
        <hr className="border-divider mb-6" />

        {/* User Review Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatar_url} alt={user.display_name} size="md" />
            <div>
              <p className="font-semibold text-dark-grey">{user.display_name}</p>
              <p className="text-small text-medium-grey">
                {visitTimeAgo ? `Visited ${visitTimeAgo}` : 'Recommended'}
              </p>
            </div>
          </div>
          <BookmarkButton
            experienceId={experience.id}
            isBookmarked={isBookmarked}
            bookmarkId={bookmarkId}
            showLabel
          />
        </div>

        {/* Description/Review */}
        {experience.brief_description && (
          <p className="text-dark-grey mb-8 leading-relaxed">
            "{experience.brief_description}"
          </p>
        )}

        {/* More From User Section */}
        {moreFromUser.length > 0 && (
          <>
            <hr className="border-divider mb-6" />
            <MoreFromUser
              userName={user.display_name}
              experiences={moreFromUser}
            />
          </>
        )}
      </div>
    </div>
  );
}
