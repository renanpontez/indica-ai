'use client';

import { Avatar } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { FollowButton } from '@/components/FollowButton';
import { ImageGallery } from './ImageGallery';
import { LocationMap } from './LocationMap';
import { BookmarkButton } from './BookmarkButton';
import { MoreFromUser } from './MoreFromUser';
import { OtherRecommenders } from './OtherRecommenders';
import { ExperienceActions } from './ExperienceActions';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import type { ExperienceDetail, ExperienceFeedItem } from '@/lib/models';
import { formatTimeAgo } from '@/lib/utils/format';

interface ExperienceDetailLayoutProps {
  experience: ExperienceDetail;
  user: ExperienceDetail['user'];
  place: ExperienceDetail['place'];
  isBookmarked?: boolean;
  bookmarkId?: string;
  moreFromUser?: ExperienceFeedItem[];
  isOwner?: boolean;
  isAuthenticated?: boolean;
  locale?: string;
}

export function ExperienceDetailLayout({
  experience,
  user,
  place,
  isBookmarked,
  bookmarkId,
  moreFromUser = [],
  isOwner = false,
  isAuthenticated = false,
  locale = 'en-US',
}: ExperienceDetailLayoutProps) {
  const timeAgo = experience.created_at
    ? formatTimeAgo(experience.created_at)
    : null;

  return (
    <div className="bg-background min-h-screen">
      <div className="2xl:max-w-[1400px] max-w-[1000px] mx-auto py-6 px-4">
        {/* User Header — avatar + name + time ... follow button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-dark-grey">{user.display_name}</p>
              <div className="flex gap-2 items-center">
                {timeAgo && <p className="text-xs text-medium-grey">{timeAgo}</p>}
                <VisibilityBadge visibility={experience.visibility} />
              </div>
            </div>
          </div>
          {!isOwner && (
            <FollowButton userId={user.id} showLabel />
          )}
        </div>

        {/* Image Gallery */}
        <div className="mb-4">
          <ImageGallery
            images={experience.images || []}
            placeName={place.name}
            priceRange={experience.price_range}
          />
        </div>

        {/* Place Name + Three-dot menu */}
        <div className="flex items-start justify-between">
          <h1 className="text-lg font-semibold text-dark-grey">
            {place.name}
          </h1>
          <ExperienceActions
            experienceId={experience.id}
            placeName={place.name}
            isOwner={isOwner}
            isAuthenticated={isAuthenticated}
            userId={user.id}
            locale={locale}
          />
        </div>
        <p className="text-sm text-medium-grey mb-3">
          {place.city}, {place.country}
        </p>

        {/* Instagram Handle */}
        {place.instagram_handle && (
          <a
            href={`https://instagram.com/${place.instagram_handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-medium-grey hover:text-primary transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>@{place.instagram_handle.replace('@', '')}</span>
          </a>
        )}

        {/* Tags */}
        {experience.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {experience.tags.map((tag, index) => (
              <Chip key={index} label={tag.display_name} variant="outlined" />
            ))}
          </div>
        )}

        {/* Description/Review */}
        {experience.brief_description && (
          <p className="text-sm text-medium-grey mb-4 leading-relaxed">
            {experience.brief_description}
          </p>
        )}

        {/* Phone Number */}
        {experience.phone_number && (
          <a
            href={`tel:${experience.phone_number}`}
            className="inline-flex items-center gap-2 text-sm text-medium-grey hover:text-primary transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{experience.phone_number}</span>
          </a>
        )}

        {/* Bookmark CTA */}
        {!isOwner && isAuthenticated && (
          <div className="mb-4">
            <BookmarkButton
              experienceId={experience.id}
              isBookmarked={isBookmarked}
              bookmarkId={bookmarkId}
              showLabel
            />
          </div>
        )}

        {/* Divider */}
        <hr className="border-divider mb-6" />

        {/* Location Map */}
        <LocationMap
          lat={place.lat}
          lng={place.lng}
          placeName={place.name}
          address={place.address}
          googleMapsUrl={place.google_maps_url}
        />

        {/* Other Recommenders Section */}
        {experience.other_recommenders && experience.other_recommenders.length > 0 && (
          <>
            <hr className="border-divider mb-6" />
            <OtherRecommenders
              recommenders={experience.other_recommenders}
              placeName={place.name}
              placeCity={place.city}
            />
          </>
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
