'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface DeleteExperienceModalProps {
  isOpen: boolean;
  placeName: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function DeleteExperienceModal({
  isOpen,
  placeName,
  onConfirm,
  onClose,
}: DeleteExperienceModalProps) {
  const t = useTranslations('experience.deleteModal');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-dark-grey">{t('title')}</h2>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-medium-grey hover:text-dark-grey transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-medium-grey mb-2">{t('message')}</p>
          <p className="font-medium text-dark-grey mb-6">{placeName}</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 text-sm font-medium text-medium-grey border border-divider rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? t('deleting') : t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
