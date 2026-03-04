'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Avatar } from '@/components/Avatar';
import { useAdminFlaggedUsers, useModerateUser } from '../hooks/useAdminFlaggedUsers';
import { SuspendModal } from './SuspendModal';
import { BanModal } from './BanModal';
import type { AdminFlaggedUser } from '@/lib/api/endpoints';

export function AdminFlaggedUserList() {
  const t = useTranslations('admin');
  const { users, isLoading, refetch } = useAdminFlaggedUsers();
  const { moderate } = useModerateUser();

  const [suspendTarget, setSuspendTarget] = useState<AdminFlaggedUser | null>(null);
  const [banTarget, setBanTarget] = useState<AdminFlaggedUser | null>(null);

  const handleSuspend = async (reason: string) => {
    if (!suspendTarget) return;
    const success = await moderate(suspendTarget.id, 'suspend', reason);
    if (success) refetch();
  };

  const handleUnsuspend = async (userId: string) => {
    const success = await moderate(userId, 'unsuspend');
    if (success) refetch();
  };

  const handleBan = async (reason: string) => {
    if (!banTarget) return;
    const success = await moderate(banTarget.id, 'ban', reason);
    if (success) refetch();
  };

  return (
    <div>
      <p className="text-sm text-medium-grey mb-6">{t('flaggedUsers.description')}</p>

      <div className="bg-white border border-divider rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-divider bg-surface/50">
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('flaggedUsers.table.user')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('flaggedUsers.table.blocks')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('flaggedUsers.table.reports')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('flaggedUsers.table.experiences')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('flaggedUsers.table.status')}
                </th>
                <th className="text-right text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('flaggedUsers.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-divider last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface animate-pulse" />
                        <div className="h-4 w-28 bg-surface animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-5 w-10 bg-surface animate-pulse rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-10 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-10 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-16 bg-surface animate-pulse rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-24 bg-surface animate-pulse rounded ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-medium-grey">
                    {t('flaggedUsers.empty')}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-divider last:border-b-0 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatar_url}
                          alt={user.display_name}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-dark-grey truncate block">
                            {user.display_name}
                          </span>
                          <span className="text-xs text-medium-grey">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.block_count >= 20
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {user.block_count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-dark-grey">{user.report_count}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-dark-grey">{user.experience_count}</span>
                    </td>
                    <td className="px-4 py-3">
                      <UserStatusBadge status={user.status} t={t} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {user.status === 'active' && (
                          <>
                            <button
                              onClick={() => setSuspendTarget(user)}
                              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              {t('flaggedUsers.suspend')}
                            </button>
                            <button
                              onClick={() => setBanTarget(user)}
                              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                              {t('flaggedUsers.ban')}
                            </button>
                          </>
                        )}
                        {user.status === 'suspended' && (
                          <>
                            <button
                              onClick={() => handleUnsuspend(user.id)}
                              className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                            >
                              {t('flaggedUsers.unsuspend')}
                            </button>
                            <button
                              onClick={() => setBanTarget(user)}
                              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                            >
                              {t('flaggedUsers.ban')}
                            </button>
                          </>
                        )}
                        {user.status === 'banned' && (
                          <span className="text-xs text-medium-grey italic">Banned</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SuspendModal
        isOpen={!!suspendTarget}
        userName={suspendTarget?.display_name || ''}
        onConfirm={handleSuspend}
        onClose={() => setSuspendTarget(null)}
      />

      <BanModal
        isOpen={!!banTarget}
        userName={banTarget?.display_name || ''}
        username={banTarget?.username || ''}
        onConfirm={handleBan}
        onClose={() => setBanTarget(null)}
      />
    </div>
  );
}

function UserStatusBadge({ status, t }: { status: string; t: ReturnType<typeof useTranslations> }) {
  const config = {
    active: { bg: 'bg-green-50', text: 'text-green-700' },
    suspended: { bg: 'bg-amber-50', text: 'text-amber-700' },
    banned: { bg: 'bg-red-50', text: 'text-red-700' },
  }[status] || { bg: 'bg-surface', text: 'text-dark-grey' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {t(`flaggedUsers.statusBadge.${status}` as any)}
    </span>
  );
}
