'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAdminExperiences, useModerateExperience } from '../hooks/useAdminExperiences';
import { DeactivateModal } from './DeactivateModal';

const PAGE_SIZE = 20;

type StatusFilter = 'all' | 'active' | 'inactive';

export function AdminExperienceList() {
  const t = useTranslations('admin');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(0);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; placeName: string } | null>(null);

  const { experiences, total, isLoading, refetch } = useAdminExperiences({
    status: statusFilter,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });

  const { moderate } = useModerateExperience();

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleDeactivate = async (reason: string) => {
    if (!deactivateTarget) return;
    const success = await moderate(deactivateTarget.id, 'deactivate', reason);
    if (success) {
      refetch();
    }
  };

  const handleReactivate = async (id: string) => {
    if (!confirm(t('moderation.reactivateConfirm'))) return;
    const success = await moderate(id, 'reactivate');
    if (success) {
      refetch();
    }
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(0);
  };

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: t('experiences.filters.all') },
    { key: 'active', label: t('experiences.filters.active') },
    { key: 'inactive', label: t('experiences.filters.inactive') },
  ];

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1 w-fit">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleStatusChange(key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              statusFilter === key
                ? 'bg-white text-dark-grey shadow-sm'
                : 'text-medium-grey hover:text-dark-grey'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-divider rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-divider bg-surface/50">
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('experiences.table.place')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('experiences.table.user')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('experiences.table.city')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('experiences.table.status')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('experiences.table.created')}
                </th>
                <th className="text-right text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('experiences.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-divider last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface animate-pulse" />
                        <div className="h-4 w-28 bg-surface animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-4 w-24 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-16 bg-surface animate-pulse rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-24 bg-surface animate-pulse rounded ml-auto" /></td>
                  </tr>
                ))
              ) : experiences.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-medium-grey">
                    {t('experiences.empty')}
                  </td>
                </tr>
              ) : (
                experiences.map((exp) => (
                  <tr key={exp.id} className="border-b border-divider last:border-b-0 hover:bg-surface/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {exp.images[0] ? (
                          <Image
                            src={exp.images[0]}
                            alt={exp.place.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                            <svg className="w-5 h-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                          </div>
                        )}
                        <span className="text-sm font-medium text-dark-grey truncate max-w-[200px]">
                          {exp.place.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-dark-grey">
                        {exp.user.display_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-medium-grey">
                        {exp.place.city}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={exp.status} t={t} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-medium-grey">
                        {exp.time_ago}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {exp.status === 'active' ? (
                        <button
                          onClick={() => setDeactivateTarget({ id: exp.id, placeName: exp.place.name })}
                          className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                          {t('moderation.deactivateTitle')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(exp.id)}
                          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                        >
                          {t('moderation.reactivate')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-divider bg-surface/30">
            <span className="text-sm text-medium-grey">
              {t('experiences.showing', {
                from: page * PAGE_SIZE + 1,
                to: Math.min((page + 1) * PAGE_SIZE, total),
                total,
              })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm font-medium text-dark-grey border border-divider rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('experiences.prev')}
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm font-medium text-dark-grey border border-divider rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('experiences.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deactivate modal */}
      <DeactivateModal
        isOpen={!!deactivateTarget}
        placeName={deactivateTarget?.placeName || ''}
        onConfirm={handleDeactivate}
        onClose={() => setDeactivateTarget(null)}
      />
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: ReturnType<typeof useTranslations> }) {
  const isActive = status === 'active';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      {isActive ? t('experiences.statusBadge.active') : t('experiences.statusBadge.inactive')}
    </span>
  );
}
