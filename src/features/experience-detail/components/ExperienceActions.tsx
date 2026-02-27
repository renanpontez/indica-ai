'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDeleteExperience } from '../hooks/useExperienceMutations';
import { DeleteExperienceModal } from './DeleteExperienceModal';
import { ReportExperienceModal } from './ReportExperienceModal';
import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api/endpoints';
import { routes, type Locale } from '@/lib/routes';

interface ExperienceActionsProps {
  experienceId: string;
  placeName: string;
  isOwner: boolean;
  isAuthenticated: boolean;
  userId: string;
  locale: string;
}

export function ExperienceActions({
  experienceId,
  placeName,
  isOwner,
  isAuthenticated,
  userId,
  locale,
}: ExperienceActionsProps) {
  const t = useTranslations('experience');
  const router = useRouter();
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const { mutateAsync: deleteExperience } = useDeleteExperience();

  // Nothing to show if not authenticated and not owner
  if (!isOwner && !isAuthenticated) return null;

  const handleEdit = () => {
    setShowDropdown(false);
    router.push(routes.app.experience.edit(locale as Locale, experienceId));
  };

  const handleDelete = async () => {
    await deleteExperience(experienceId);
    router.push(routes.app.feed(locale as Locale));
  };

  const handleReport = async (reason: string, description?: string) => {
    await api.reportExperience(experienceId, reason, description);
    showToast(t('reportModal.success'), 'success');
  };

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      await api.blockUser(userId);
      showToast(t('blockModal.success'), 'success');
      setShowDropdown(false);
      router.push(routes.app.feed(locale as Locale));
    } catch {
      showToast('Failed to block user', 'error');
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 text-medium-grey hover:text-dark-grey hover:bg-surface rounded-lg transition-colors"
          aria-label={t('actions.menu')}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-divider py-1 z-20 whitespace-nowrap">
              {isOwner ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-dark-grey hover:bg-surface transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    {t('actions.edit')}
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowDeleteModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {t('actions.delete')}
                  </button>
                </>
              ) : (
                <>
                  {/* Report */}
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowReportModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-dark-grey hover:bg-surface transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                    </svg>
                    {t('actions.report')}
                  </button>
                  {/* Block */}
                  <button
                    onClick={handleBlock}
                    disabled={isBlocking}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    {isBlocking ? t('blockModal.blocking') : t('actions.blockUser')}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <DeleteExperienceModal
        isOpen={showDeleteModal}
        placeName={placeName}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />

      <ReportExperienceModal
        isOpen={showReportModal}
        onSubmit={handleReport}
        onClose={() => setShowReportModal(false)}
      />
    </>
  );
}
