'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import type { ExperienceVisibility } from '@/lib/models';

interface VisibilitySelectorProps {
  value: ExperienceVisibility;
  onChange: (value: ExperienceVisibility) => void;
  className?: string;
}

export function VisibilitySelector({ value, onChange, className }: VisibilitySelectorProps) {
  const t = useTranslations('add.visibility');

  const options: { value: ExperienceVisibility; label: string; description: string; icon: React.ReactNode }[] = [
    {
      value: 'friends_only',
      label: t('friendsOnly'),
      description: t('friendsOnlyDescription'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      value: 'public',
      label: t('public'),
      description: t('publicDescription'),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={cn('flex gap-3', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 flex flex-col items-center gap-2 p-4 rounded-surface border-2 transition-all min-h-[100px]',
            value === option.value
              ? 'border-primary bg-primary/5'
              : 'border-divider hover:border-medium-grey'
          )}
        >
          <div className={cn(
            'p-2 rounded-full',
            value === option.value ? 'bg-primary text-white' : 'bg-surface text-medium-grey'
          )}>
            {option.icon}
          </div>
          <div className="text-center">
            <p className={cn(
              'font-medium text-body',
              value === option.value ? 'text-primary' : 'text-dark-grey'
            )}>
              {option.label}
            </p>
            <p className="text-small text-medium-grey mt-1">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
