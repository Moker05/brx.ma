import { cn, formatCurrency, getPnLColorClass } from '@/lib/utils';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export interface PriceDisplayProps {
  value: number;
  currency?: string;
  change?: number;
  changePercent?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const PriceDisplay = ({
  value,
  currency = 'MAD',
  change,
  changePercent,
  size = 'md',
  showIcon = true,
  className,
}: PriceDisplayProps) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const changeSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const hasChange = change !== undefined || changePercent !== undefined;
  const changeValue = changePercent ?? (change && Math.abs(change));
  const isPositive = (changePercent ?? change ?? 0) >= 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold text-mono', sizeClasses[size])}>
        {formatCurrency(value)} {currency}
      </span>

      {hasChange && changeValue !== undefined && (
        <span
          className={cn(
            'flex items-center gap-1 font-semibold',
            changeSizeClasses[size],
            getPnLColorClass(isPositive ? changeValue : -changeValue)
          )}
        >
          {showIcon && (
            isPositive ? <FiTrendingUp /> : <FiTrendingDown />
          )}
          <span>
            {isPositive ? '+' : ''}
            {changePercent !== undefined
              ? `${changePercent.toFixed(2)}%`
              : formatCurrency(Math.abs(change!))}
          </span>
        </span>
      )}
    </div>
  );
};
