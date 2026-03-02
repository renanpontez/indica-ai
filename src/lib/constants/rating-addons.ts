import type { StarRating, RatingTier } from '@/lib/models';

export function getRatingTier(rating: StarRating): RatingTier {
  return rating === 3 ? 'neutral' : 'good';
}

export const RATING_ADDON_SLUGS: Record<RatingTier, string[]> = {
  neutral: ['decent', 'nothing-special', 'ok-for-price', 'average', 'mixed-experience'],
  good: ['must-visit', 'amazing-food', 'great-atmosphere', 'hidden-gem', 'excellent-service', 'good-value', 'instagram-worthy'],
};
