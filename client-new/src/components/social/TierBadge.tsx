// React default import not required with the automatic JSX runtime

interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
}

const TIER_COLORS: Record<string, string> = {
  BRONZE: 'badge-warning',
  SILVER: 'badge-info',
  GOLD: 'badge-accent',
  PLATINUM: 'badge-primary',
  DIAMOND: 'badge-secondary',
};

const TIER_ICONS: Record<string, string> = {
  BRONZE: '🥉',
  SILVER: '🥈',
  GOLD: '🥇',
  PLATINUM: '💎',
  DIAMOND: '👑',
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  return (
    <div className={`badge ${TIER_COLORS[tier] || 'badge-ghost'} gap-1 ${size === 'sm' ? 'badge-sm' : ''}`}>
      <span>{TIER_ICONS[tier] || '⭐'}</span>
      <span>{tier}</span>
    </div>
  );
}

export default TierBadge;
