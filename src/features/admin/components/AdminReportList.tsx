'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useAdminReports, useDismissReport } from '../hooks/useAdminReports';
import { useModerateExperience } from '../hooks/useAdminExperiences';
import { DeactivateModal } from './DeactivateModal';
import { formatTimeAgo } from '@/lib/utils/format';
import type { AdminReportGroup } from '@/lib/api/endpoints';

type StatusFilter = 'pending' | 'dismissed' | 'actioned' | 'all';

export function AdminReportList() {
  const t = useTranslations('admin');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; placeName: string } | null>(null);

  const { groups, isLoading, refetch } = useAdminReports({ status: statusFilter });
  const { dismiss } = useDismissReport();
  const { moderate } = useModerateExperience();

  const handleDismissAll = async (group: AdminReportGroup) => {
    const firstReport = group.reports[0];
    if (!firstReport) return;
    const success = await dismiss(firstReport.id, 'all');
    if (success) refetch();
  };

  const handleDeactivate = async (reason: string) => {
    if (!deactivateTarget) return;
    const success = await moderate(deactivateTarget.id, 'deactivate', reason);
    if (success) refetch();
  };

  const filters: { key: StatusFilter; label: string }[] = [
    { key: 'pending', label: t('reports.filters.pending') },
    { key: 'dismissed', label: t('reports.filters.dismissed') },
    { key: 'actioned', label: t('reports.filters.actioned') },
    { key: 'all', label: t('reports.filters.all') },
  ];

  return (
    <div>
      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1 w-fit">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
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
                  {t('reports.table.experience')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('reports.table.reports')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('reports.table.reason')}
                </th>
                <th className="text-left text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('reports.table.latestReport')}
                </th>
                <th className="text-right text-xs font-medium text-medium-grey uppercase tracking-wider px-4 py-3">
                  {t('reports.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-divider last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface animate-pulse" />
                        <div className="h-4 w-28 bg-surface animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-5 w-12 bg-surface animate-pulse rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-surface animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-24 bg-surface animate-pulse rounded ml-auto" /></td>
                  </tr>
                ))
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-medium-grey">
                    {t('reports.empty')}
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <ReportGroupRow
                    key={group.experience_id}
                    group={group}
                    isExpanded={expandedGroup === group.experience_id}
                    onToggle={() => setExpandedGroup(
                      expandedGroup === group.experience_id ? null : group.experience_id
                    )}
                    onDismissAll={() => handleDismissAll(group)}
                    onDeactivate={() => {
                      if (group.experience) {
                        setDeactivateTarget({
                          id: group.experience.id,
                          placeName: group.experience.place.name,
                        });
                      }
                    }}
                    t={t}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeactivateModal
        isOpen={!!deactivateTarget}
        placeName={deactivateTarget?.placeName || ''}
        onConfirm={handleDeactivate}
        onClose={() => setDeactivateTarget(null)}
      />
    </div>
  );
}

function ReportGroupRow({
  group,
  isExpanded,
  onToggle,
  onDismissAll,
  onDeactivate,
  t,
}: {
  group: AdminReportGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onDismissAll: () => void;
  onDeactivate: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const exp = group.experience;
  const primaryReason = getMostCommonReason(group.reports);
  const isPending = group.reports.some(r => r.status === 'pending');
  const isExperienceInactive = exp?.status === 'inactive';

  return (
    <>
      <tr
        className="border-b border-divider last:border-b-0 hover:bg-surface/30 transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {exp?.images[0] ? (
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
            <div className="min-w-0">
              <span className="text-sm font-medium text-dark-grey truncate block max-w-[200px]">
                {exp?.place.name || 'Unknown'}
              </span>
              {exp && (
                <span className="text-xs text-medium-grey">
                  {t('reports.by', { name: exp.user.display_name })}
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            group.report_count >= 5
              ? 'bg-red-50 text-red-700'
              : group.report_count >= 3
              ? 'bg-amber-50 text-amber-700'
              : 'bg-surface text-dark-grey'
          }`}>
            {group.report_count}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-dark-grey">
            {t(`reports.reasons.${primaryReason}` as any)}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-medium-grey">
            {formatTimeAgo(group.latest_report_at)}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            {isExperienceInactive ? (
              <span className="text-xs text-medium-grey italic">
                {t('reports.experienceInactive')}
              </span>
            ) : isPending ? (
              <>
                <button
                  onClick={onDeactivate}
                  className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  {t('reports.deactivate')}
                </button>
                <button
                  onClick={onDismissAll}
                  className="text-sm font-medium text-medium-grey hover:text-dark-grey transition-colors"
                >
                  {t('reports.dismissAll')}
                </button>
              </>
            ) : (
              <span className="text-xs text-medium-grey italic">
                {group.reports[0]?.status === 'dismissed'
                  ? t('reports.dismissed')
                  : t('reports.actioned')}
              </span>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded details */}
      {isExpanded && (
        <tr className="bg-surface/20">
          <td colSpan={5} className="px-6 py-4">
            <div className="space-y-3">
              {group.reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-start gap-4 p-3 bg-white rounded-lg border border-divider"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-dark-grey">
                        {report.reporter.display_name}
                      </span>
                      {report.reporter.username && (
                        <span className="text-xs text-medium-grey">
                          @{report.reporter.username}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.reason === 'inappropriate'
                          ? 'bg-red-50 text-red-700'
                          : report.reason === 'spam'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-surface text-dark-grey'
                      }`}>
                        {t(`reports.reasons.${report.reason}` as any)}
                      </span>
                    </div>
                    {report.description && (
                      <p className="text-sm text-medium-grey">{report.description}</p>
                    )}
                    <span className="text-xs text-medium-grey mt-1 block">
                      {formatTimeAgo(report.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function getMostCommonReason(reports: AdminReportGroup['reports']): string {
  const counts = new Map<string, number>();
  for (const report of reports) {
    counts.set(report.reason, (counts.get(report.reason) || 0) + 1);
  }
  let maxReason = 'other';
  let maxCount = 0;
  for (const [reason, count] of counts) {
    if (count > maxCount) {
      maxReason = reason;
      maxCount = count;
    }
  }
  return maxReason;
}
