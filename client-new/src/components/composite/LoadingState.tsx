import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState = ({
  message = 'Chargement...',
  size = 'md',
  className,
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <span className={cn('loading loading-spinner', sizeClasses[size])}></span>
      {message && (
        <p className="text-sm text-base-content/70 mt-4">{message}</p>
      )}
    </div>
  );
};
