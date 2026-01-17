import { Button } from '@/components/Button';

interface MapLinkButtonProps {
  googleMapsUrl: string | null;
  placeName: string;
  variant?: 'default' | 'primary';
}

export function MapLinkButton({ googleMapsUrl, placeName, variant = 'default' }: MapLinkButtonProps) {
  if (!googleMapsUrl) {
    return null;
  }

  if (variant === 'primary') {
    return (
      <button
        onClick={() => window.open(googleMapsUrl, '_blank')}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium text-small"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        Open in Maps
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => window.open(googleMapsUrl, '_blank')}
      className="w-full"
    >
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Open in Google Maps
    </Button>
  );
}
