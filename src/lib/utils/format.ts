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
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
