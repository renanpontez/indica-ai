'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useExplore } from '@/features/explore/hooks/useExplore';
import { ExperienceCard } from '@/features/feed/components/ExperienceCard';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function ExploreAllPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations();

  const city = searchParams.get('city') || undefined;
  const { experiences, total, isLoading, error, loadMore, hasMore } = useExplore({
    city,
    limit: 20,
  });

  const breadcrumbItems = [
    { label: t('nav.explore'), href: '/explore' },
    { label: city || t('explore.all.title') },
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-dark-grey mb-2">
            {city ? t('explore.all.cityTitle', { city }) : t('explore.all.title')}
          </h1>
          <p className="text-medium-grey">
            {t('explore.all.subtitle', { count: total })}
          </p>
        </div>

        {isLoading && experiences.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(9)].map((_, i) => (
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
            <Link
              href="/explore"
              className="mt-4 inline-block text-primary hover:underline"
            >
              {t('explore.backToExplore')}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? t('common.loading') : t('explore.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
