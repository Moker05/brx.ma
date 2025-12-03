import { StatCard } from '@/components/composite';
import { formatCurrency } from '@/lib/utils';

export interface PortfolioStatsData {
  availableBalance: number;
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  totalValue: number;
}

export interface PortfolioStatsProps {
  stats: PortfolioStatsData;
  periodPnL?: {
    change: number;
    percent: number;
  };
}

export const PortfolioStats = ({ stats, periodPnL }: PortfolioStatsProps) => {
  return (
    <>
      {/* Grid de 4 stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Solde disponible"
          value={`${formatCurrency(stats.availableBalance)} MAD`}
        />

        <StatCard
          title="Valeur investie"
          value={`${formatCurrency(stats.totalInvested)} MAD`}
        />

        <StatCard
          title="Valeur actuelle"
          value={`${formatCurrency(stats.totalCurrentValue)} MAD`}
        />

        <StatCard
          title="Profit/Perte"
          value={`${stats.totalProfitLoss >= 0 ? '+' : ''}${formatCurrency(stats.totalProfitLoss)} MAD`}
          subtitle={`${stats.totalProfitLossPercent >= 0 ? '+' : ''}${stats.totalProfitLossPercent.toFixed(2)}%`}
          trend={periodPnL ? {
            value: periodPnL.percent,
            label: 'Période sélectionnée'
          } : undefined}
        />
      </div>

      {/* Total Portfolio Value - Grande carte gradient */}
      <StatCard
        variant="gradient"
        title="Valeur totale du portefeuille"
        value={`${formatCurrency(stats.totalValue)} MAD`}
        className="col-span-full"
      />
    </>
  );
};
