import { cn } from '@/lib/utils/cn';

interface ChipProps {
  label: string;
  variant?: 'default' | 'price' | 'outlined';
  onClick?: () => void;
  onRemove?: () => void;
  active?: boolean;
  className?: string;
}

export function Chip({
  label,
  variant = 'default',
  onClick,
  onRemove,
  active = false,
  className,
}: ChipProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-chip px-3 py-1.5 text-small font-medium transition-colors',
        variant === 'default' && 'bg-chip-bg text-dark-grey',
        variant === 'price' && 'bg-surface text-medium-grey',
        variant === 'outlined' && 'border border-primary text-primary bg-transparent',
        active && 'bg-primary text-white',
        onClick && 'cursor-pointer hover:bg-opacity-80',
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 -mr-0.5 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Component>
  );
}
