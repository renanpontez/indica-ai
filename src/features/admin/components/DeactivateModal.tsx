'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface DeactivateModalProps {
  isOpen: boolean;
  placeName: string;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export function DeactivateModal({
  isOpen,
  placeName,
  onConfirm,
  onClose,
}: DeactivateModalProps) {
  const t = useTranslations('admin.moderation');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError(t('reasonRequired'));
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(reason.trim());
      setReason('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
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
            <h2 className="text-xl font-semibold text-dark-grey">{t('deactivateTitle')}</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
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

          <p className="text-medium-grey mb-1">{t('message')}</p>
          <p className="font-medium text-dark-grey mb-4">{placeName}</p>

          <label className="block text-sm font-medium text-dark-grey mb-1.5">
            {t('reasonLabel')}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('reasonPlaceholder')}
            className="w-full border border-divider rounded-lg px-3 py-2 text-sm text-dark-grey placeholder:text-medium-grey/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            rows={3}
            disabled={isSubmitting}
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-medium-grey border border-divider rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? t('deactivating') : t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
