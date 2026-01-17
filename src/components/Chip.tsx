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
        variant === 'default' && 'bg-chip-bg text-dark-grey',
        variant === 'price' && 'bg-surface text-medium-grey',
        variant === 'outlined' && 'border border-primary text-primary bg-transparent',
        active && 'bg-primary text-white',
        onClick && 'cursor-pointer hover:bg-opacity-80',
        className
      )}
    >
      {label}
    </Component>
  );
}
