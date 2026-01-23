'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDeleteExperience } from '../hooks/useExperienceMutations';
import { DeleteExperienceModal } from './DeleteExperienceModal';
import { routes, type Locale } from '@/lib/routes';

interface ExperienceActionsProps {
  experienceId: string;
  placeName: string;
  isOwner: boolean;
  locale: string;
}

export function ExperienceActions({
  experienceId,
  placeName,
  isOwner,
  locale,
}: ExperienceActionsProps) {
  const t = useTranslations('experience.actions');
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { mutateAsync: deleteExperience } = useDeleteExperience();

  if (!isOwner) return null;

  const handleEdit = () => {
    setShowDropdown(false);
    router.push(routes.app.experience.edit(locale as Locale, experienceId));
  };

  const handleDelete = async () => {
    await deleteExperience(experienceId);
    router.push(routes.app.feed(locale as Locale));
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 text-medium-grey hover:text-dark-grey hover:bg-surface rounded-lg transition-colors"
          aria-label={t('menu')}
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
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-divider py-1 z-20 min-w-[140px]">
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
                {t('edit')}
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
                {t('delete')}
              </button>
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
    </>
  );
}
