import { getTranslations } from 'next-intl/server';
import { AdminFlaggedUserList } from '@/features/admin/components/AdminFlaggedUserList';

export default async function AdminFlaggedUsersPage() {
  const t = await getTranslations('admin');

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-grey mb-6">
        {t('flaggedUsers.title')}
      </h1>
      <AdminFlaggedUserList />
    </div>
  );
}
