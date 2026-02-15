'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useExplore } from '@/features/explore/hooks/useExplore';
import { Breadcrumb } from '@/components/Breadcrumb';
import { routePaths } from '@/lib/routes';

export default function ExploreCitiesPage() {
  const t = useTranslations();
  const { cities, isLoading, error } = useExplore();

  const breadcrumbItems = [
    { label: t('nav.explore'), href: routePaths.app.explore.index() },
    { label: t('explore.cities.title') },
  ];

  if (error) {
    return (
      <div className="p-md">
        <Breadcrumb items={breadcrumbItems} />
        <p className="text-error">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-2 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-dark-grey mb-2">
            {t('explore.cities.title')}
          </h1>
          <p className="text-medium-grey">
            {t('explore.cities.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-divider p-6 animate-pulse"
              >
                <div className="w-3/4 h-5 bg-surface rounded mb-2" />
                <div className="w-1/2 h-4 bg-surface rounded" />
              </div>
            ))}
          </div>
        ) : cities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-divider">
            <p className="text-medium-grey">{t('explore.cities.empty')}</p>
            <Link
              href={routePaths.app.explore.index()}
              className="mt-4 inline-block text-primary hover:underline"
            >
              {t('explore.backToExplore')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={`${city.city}-${city.country}`}
                href={routePaths.app.explore.city(city.slug)}
                className="group p-6 bg-white rounded-xl border border-divider hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-dark-grey group-hover:text-primary transition-colors mb-1">
                    {city.city}
                  </span>
                  <span className="text-sm text-medium-grey">
                    {city.country}
                  </span>
                  <span className="mt-2 text-sm text-primary">
                    {city.count} {city.count === 1 ? t('explore.place') : t('explore.places')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
