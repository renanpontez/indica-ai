import { Link } from '@/i18n/routing';
import { routePaths } from '@/lib/routes';
import type { ExperienceFeedItem } from '@/lib/models';

interface MoreFromUserProps {
  userName: string;
  experiences: ExperienceFeedItem[];
}

export function MoreFromUser({ userName, experiences }: MoreFromUserProps) {
  const firstName = userName.split(' ')[0];

  return (
    <div>
      <h2 className="text-lg font-semibold text-dark-grey mb-4">
        More recommendations from {firstName}
      </h2>
      <div className="space-y-3">
        {experiences.map((exp) => (
          <Link
            key={exp.id}
            href={routePaths.app.experience.detail(exp.experience_id, exp.slug || '')}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors group"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg bg-surface overflow-hidden flex-shrink-0">
              {exp.place.thumbnail_image_url ? (
                <img
                  src={exp.place.thumbnail_image_url}
                  alt={exp.place.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-medium-grey">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark-grey truncate">
                {exp.place.name}
              </p>
              <p className="text-small text-medium-grey">
                {exp.place.city_short} · {exp.time_ago}
              </p>
            </div>

            {/* Arrow */}
            <svg
              className="w-5 h-5 text-medium-grey group-hover:text-dark-grey transition-colors flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
