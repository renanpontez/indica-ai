import { getTranslations } from 'next-intl/server';
import { AdminReportList } from '@/features/admin/components/AdminReportList';

export default async function AdminReportsPage() {
  const t = await getTranslations('admin');

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-grey mb-6">
        {t('reports.title')}
      </h1>
      <AdminReportList />
    </div>
  );
}
