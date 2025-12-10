import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {icon && (
        <div className="text-6xl text-base-content/20 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-base-content/80 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-base-content/60 text-center max-w-md mb-4">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};
