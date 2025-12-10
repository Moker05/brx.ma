import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'default' | 'gradient' | 'glass';
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) => {
  const baseClasses = 'card shadow-lg';
  const variantClasses = {
    default: 'bg-base-200',
    gradient: 'bg-gradient-to-r from-primary to-secondary text-primary-content',
    glass: 'glass',
  };

  const trendColor = trend && trend.value >= 0 ? 'text-success' : 'text-error';

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-base-content/70">
              {title}
            </h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={cn('text-sm font-semibold mt-2', trendColor)}>
                {trend.value >= 0 ? '+' : ''}
                {trend.value.toFixed(2)}%
                {trend.label && (
                  <span className="text-base-content/50 ml-1">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="text-3xl opacity-50">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
