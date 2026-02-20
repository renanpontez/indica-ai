import { getTranslations } from 'next-intl/server';
import { AdminExperienceList } from '@/features/admin/components/AdminExperienceList';

export default async function AdminExperiencesPage() {
  const t = await getTranslations('admin');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark-grey mb-6">
        {t('experiences.title')}
      </h1>
      <AdminExperienceList />
    </div>
  );
}
