// Utility functions for formatting data

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return 'just now';
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;
  if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 604800)}w ago`;
  if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)}mo ago`;
  return `${Math.floor(secondsAgo / 31536000)}y ago`;
}

export function formatPriceRange(range: string): string {
  return range; // Already in $ format
}

export function getInitials(name: string): string {
  if (!name || !name.trim()) return '';
  return name
    .trim()
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a URL-friendly slug from any text
 * Example: "São Paulo" -> "sao-paulo"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim();
}

/**
 * Generate a URL-friendly slug from place name and city
 * Format: place-name-city
 * Example: "osteria-francescana-modena"
 */
export function generateExperienceSlug(
  placeName: string,
  city: string
): string {
  return `${slugify(placeName)}-${slugify(city)}`;
}

/**
 * Generate the full experience URL path
 * Format: /experience/{id}/{slug}
 */
export function getExperienceUrl(experienceId: string, slug: string): string {
  return `/experience/${experienceId}/${slug}`;
}
