import { cn } from '@/lib/utils/cn';

interface ChipProps {
  label: string;
  variant?: 'default' | 'price' | 'outlined';
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function Chip({
  label,
  variant = 'default',
  onClick,
  active = false,
  className,
}: ChipProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-chip px-3 py-1.5 text-small font-medium transition-colors',
        variant === 'default' && 'bg-chip-bg text-text-primary',
        variant === 'price' && 'bg-surface text-text-secondary',
        variant === 'outlined' && 'border border-accent text-accent bg-transparent',
        active && 'bg-accent text-white',
        onClick && 'cursor-pointer hover:bg-opacity-80',
        className
      )}
    >
      {label}
    </Component>
  );
}
