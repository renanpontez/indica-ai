import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ExperienceDetailLayout } from '@/features/experience-detail/components/ExperienceDetailLayout';
import { getExperience } from '@/lib/data/getExperience';
import { getServerUser } from '@/lib/auth/getServerUser';
import { createClient } from '@/lib/supabase/server';

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

  // Fetch bookmark status for authenticated non-owner users
  let isBookmarked = false;
  let bookmarkId: string | undefined;
  if (currentUser && !isOwner) {
    const supabase = await createClient();
    const { data: bookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('experience_id', id)
      .single();
    if (bookmark) {
      isBookmarked = true;
      bookmarkId = bookmark.id;
    }
  }

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
        isBookmarked={isBookmarked}
        bookmarkId={bookmarkId}
        moreFromUser={[]}
        isOwner={isOwner}
        isAuthenticated={!!currentUser}
        locale={locale}
      />
    </div>
  );
}
