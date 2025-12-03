import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PortfolioSnapshot } from '../../services/portfolioAPI';

interface PortfolioChartProps {
  data: PortfolioSnapshot[];
  period: '1W' | '1M' | '1Y' | 'MAX';
}

export const PortfolioChart = ({ data, period }: PortfolioChartProps) => {
  const chartData = useMemo(() => {
    return data.map((snapshot) => ({
      timestamp: new Date(snapshot.timestamp).getTime(),
      date: new Date(snapshot.timestamp).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        ...(period === '1Y' || period === 'MAX' ? { year: '2-digit' } : {}),
      }),
      totalValue: snapshot.totalValue,
      investedValue: snapshot.investedValue,
      profitLoss: snapshot.profitLoss,
    }));
  }, [data, period]);

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} MAD`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const fullDate = new Date(data.timestamp).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      return (
        <div className="bg-base-200 p-4 rounded-lg shadow-lg border border-base-300">
          <p className="text-sm text-base-content/70 mb-2">{fullDate}</p>
          <div className="space-y-1">
            <p className="font-bold text-primary">
              Valeur totale: {formatCurrency(data.totalValue)}
            </p>
            <p className="text-sm">Investi: {formatCurrency(data.investedValue)}</p>
            <p
              className={`text-sm font-semibold ${
                data.profitLoss >= 0 ? 'text-success' : 'text-error'
              }`}
            >
              P&L: {data.profitLoss >= 0 ? '+' : ''}
              {formatCurrency(data.profitLoss)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-base-200 rounded-lg">
        <div className="text-center">
          <p className="text-base-content/70">Aucune donnée disponible pour cette période</p>
          <p className="text-sm text-base-content/50 mt-2">
            Les données seront collectées au fur et à mesure de vos transactions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 min-w-0 min-h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="date"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) =>
              `${(value / 1000).toFixed(0)}k`
            }
            tick={{ fill: 'currentColor', fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalValue"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
