import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ExperienceDetailLayout } from '@/features/experience-detail/components/ExperienceDetailLayout';
import { getExperience } from '@/lib/data/getExperience';
import { getServerUser } from '@/lib/auth/getServerUser';

interface ExperienceDetailPageProps {
  params: Promise<{ id: string; slug: string; locale: string }>;
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const { id, locale } = await params;
  const [experience, t, currentUser] = await Promise.all([
    getExperience(id),
    getTranslations(),
    getServerUser(),
  ]);

  if (!experience) {
    notFound();
  }

  const isOwner = currentUser?.id === experience.user.id;

  const breadcrumbItems = [
    { label: t('nav.feed'), href: `/${locale}/app` },
    { label: experience.place.name },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <ExperienceDetailLayout
        experience={experience}
        user={experience.user}
        place={experience.place}
        isBookmarked={false}
        moreFromUser={[]}
        isOwner={isOwner}
        locale={locale}
      />
    </div>
  );
}
