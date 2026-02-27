'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const REPORT_REASONS = ['spam', 'inappropriate', 'misleading', 'other'] as const;
type ReportReason = (typeof REPORT_REASONS)[number];

interface ReportExperienceModalProps {
  isOpen: boolean;
  onSubmit: (reason: string, description?: string) => Promise<void>;
  onClose: () => void;
}

export function ReportExperienceModal({
  isOpen,
  onSubmit,
  onClose,
}: ReportExperienceModalProps) {
  const t = useTranslations('experience.reportModal');
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(reason, description || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
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
            <h2 className="text-xl font-semibold text-dark-grey">{t('title')}</h2>
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

          <p className="text-medium-grey mb-4">{t('message')}</p>

          {/* Reason Options */}
          <div className="space-y-2 mb-4">
            {REPORT_REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  reason === r
                    ? 'border-primary bg-primary/5'
                    : 'border-divider hover:bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-primary"
                />
                <span className="text-sm text-dark-grey">{t(r)}</span>
              </label>
            ))}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm text-medium-grey mb-1">
              {t('description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 border border-divider rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-medium-grey border border-divider rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
