import { cn } from '@/lib/utils/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'rounded-surface bg-surface p-md text-body text-text-secondary',
        className
      )}
      role="alert"
    >
      {message}
    </div>
  );
}
