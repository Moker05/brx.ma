import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in MAD
 */
export function formatCurrency(amount: number, options?: {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}): string {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  });
}

/**
 * Format cryptocurrency amounts (up to 8 decimals)
 */
export function formatCrypto(amount: number, decimals: number = 8): string {
  return amount.toFixed(decimals);
}

/**
 * Format percentage with sign
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format compact numbers (1.5K, 2.3M, etc.)
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

/**
 * Get color class based on value (positive/negative)
 */
export function getPnLColorClass(value: number): string {
  return value >= 0 ? 'text-success' : 'text-error';
}

/**
 * Get badge variant based on asset type
 */
export function getAssetTypeBadge(type: 'STOCK' | 'CRYPTO' | 'OPCVM' | 'INDEX'): string {
  const variants = {
    STOCK: 'badge-primary',
    CRYPTO: 'badge-secondary',
    OPCVM: 'badge-accent',
    INDEX: 'badge-info',
  };
  return variants[type] || 'badge-ghost';
}
