'use client';

interface LocationMapProps {
  lat: number | null;
  lng: number | null;
  placeName: string;
  address?: string | null;
  googleMapsUrl?: string | null;
}

export function LocationMap({ lat, lng, placeName, address, googleMapsUrl }: LocationMapProps) {
  // If no coordinates, don't render
  if (!lat || !lng) {
    return null;
  }

  // Google Maps link for directions
  const directionsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  // OpenStreetMap embed URL
  const zoom = 16;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="mb-6">
      <h3 className="text-body font-medium text-text-primary mb-3">Location</h3>
      <div className="rounded-xl overflow-hidden bg-surface">
        {/* Map Container */}
        <div className="relative">
          <iframe
            src={osmEmbedUrl}
            className="w-full h-[200px] md:h-[250px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${placeName}`}
          />
          {/* Clickable overlay to open in Google Maps */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors flex items-center justify-center group"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-small font-medium text-dark-grey">Open in Maps</span>
            </div>
          </a>
        </div>
        {/* Address bar */}
        {address && (
          <div className="px-4 py-3 border-t border-divider">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{address}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
