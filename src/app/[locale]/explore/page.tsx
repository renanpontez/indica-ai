'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useExplore } from '@/features/explore/hooks/useExplore';
import { ExperienceCard } from '@/features/feed/components/ExperienceCard';

export default function ExplorePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { experiences, cities, categories, isLoading, error } = useExplore({ limit: 6 });

  if (error) {
    return (
      <div className="p-md">
        <p className="text-error">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-grey mb-3">
            {t('explore.title')}
          </h1>
          <p className="text-lg text-medium-grey max-w-2xl">
            {t('explore.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Categories Section */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-dark-grey">
                {t('explore.sections.categories')}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.category}
                  href={`/explore/category/${cat.category.toLowerCase()}`}
                  className="group p-4 bg-white rounded-xl border border-divider hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-dark-grey group-hover:text-primary transition-colors">
                      {t(`categories.${cat.category.toLowerCase()}`, { defaultValue: cat.category })}
                    </span>
                    <span className="text-sm text-medium-grey">{cat.count}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cities Section */}
        {cities.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-dark-grey">
                {t('explore.sections.cities')}
              </h2>
              <Link
                href="/explore/cities"
                className="text-sm text-primary hover:underline"
              >
                {t('explore.viewAll')}
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.slice(0, 8).map((city) => (
                <Link
                  key={`${city.city}-${city.country}`}
                  href={`/explore/all?city=${encodeURIComponent(city.city)}`}
                  className="group p-4 bg-white rounded-xl border border-divider hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-dark-grey group-hover:text-primary transition-colors">
                      {city.city}
                    </span>
                    <span className="text-sm text-medium-grey">
                      {city.country} · {city.count} {t('explore.places')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Public Suggestions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-grey">
              {t('explore.sections.recent')}
            </h2>
            <Link
              href="/explore/all"
              className="text-sm text-primary hover:underline"
            >
              {t('explore.viewAll')}
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-divider p-4 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-surface rounded-full" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-surface rounded" />
                      <div className="w-16 h-3 bg-surface rounded" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-32 h-32 bg-surface rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="w-full h-4 bg-surface rounded" />
                      <div className="w-2/3 h-3 bg-surface rounded" />
                      <div className="w-1/2 h-3 bg-surface rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-divider">
              <p className="text-medium-grey">{t('explore.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  onClick={() =>
                    router.push(
                      `/${locale}/app/experience/${experience.experience_id}/${experience.slug}`
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
