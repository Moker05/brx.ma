import { useMemo, useState } from 'react';
import { AdvancedChart } from '../../components/charts/AdvancedChart';
import { getMockStockData, type Timeframe } from '../../utils/mockData';

const timeframes: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y', 'YTD', 'ALL'];

const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

export const Home = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [selectedSymbol, setSelectedSymbol] = useState('ATW');

  const stats = [
    { label: 'MASI', value: '12 845,67', change: 0.35 },
    { label: 'MADEX', value: '10 456,89', change: 0.31 },
    { label: 'MSI20', value: '1 023,45', change: -0.55 },
  ];

  const watchlist = [
    { symbol: 'ATW', name: 'Attijariwafa Bank', price: 485.5, change: 0.49, volume: '1.2M' },
    { symbol: 'BCP', name: 'BCP', price: 265.0, change: 1.34, volume: '950K' },
    { symbol: 'IAM', name: 'Maroc Telecom', price: 125.8, change: -0.94, volume: '740K' },
    { symbol: 'CIH', name: 'CIH Bank', price: 315.2, change: -0.88, volume: '500K' },
    { symbol: 'BTC', name: 'Bitcoin', price: 62750, change: 0.8, volume: '18.2B' },
  ];

  const heatmap = [
    { label: 'Banques', change: 0.72 },
    { label: 'Télécom', change: -0.12 },
    { label: 'Immobilier', change: 0.34 },
    { label: 'Matières 1ères', change: -0.45 },
    { label: 'Distribution', change: 0.18 },
    { label: 'Énergie', change: 1.12 },
  ];

  const gainers = watchlist.filter((s) => s.change > 0).slice(0, 3);
  const losers = watchlist.filter((s) => s.change < 0).slice(0, 3);

  const stockData = useMemo(() => getMockStockData(selectedSymbol, timeframe), [selectedSymbol, timeframe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase tracking-[0.2em] text-primary/70 font-semibold">BRX.MA</p>
        <h1 className="text-3xl font-bold font-display">Dashboard Marchés</h1>
        <p className="text-base-content/70">Suivez les marchés BVC et crypto avec une expérience type plateforme de trading.</p>
      </div>

      <div className="card-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 flex flex-col gap-1">
            <div className="text-sm text-base-content/60">{stat.label}</div>
            <div className="text-2xl font-bold text-mono">{stat.value}</div>
            <div className={`text-sm font-semibold ${stat.change >= 0 ? 'text-success' : 'text-error'}`}>
              {formatChange(stat.change)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <div>
                <div className="text-sm text-base-content/60">Symbole</div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{stockData.name}</h2>
                  <span className="badge badge-primary badge-lg">{stockData.symbol}</span>
                </div>
                <div className="text-3xl font-bold text-mono">{stockData.currentPrice} MAD</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    className={`btn btn-xs rounded-full ${timeframe === tf ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <AdvancedChart data={stockData.data} height={520} symbol={stockData.symbol} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Top Gainers</h3>
                <span className="text-xs text-base-content/60">BVC</span>
              </div>
              <div className="space-y-2">
                {gainers.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between p-2 rounded-lg bg-base-300/50">
                    <div>
                      <div className="font-semibold">{s.symbol}</div>
                      <div className="text-xs text-base-content/60">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-mono font-semibold">{s.price.toFixed(2)} MAD</div>
                      <div className="text-success text-sm">{formatChange(s.change)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Top Losers</h3>
                <span className="text-xs text-base-content/60">BVC</span>
              </div>
              <div className="space-y-2">
                {losers.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between p-2 rounded-lg bg-base-300/50">
                    <div>
                      <div className="font-semibold">{s.symbol}</div>
                      <div className="text-xs text-base-content/60">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-mono font-semibold">{s.price.toFixed(2)} MAD</div>
                      <div className="text-error text-sm">{formatChange(s.change)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Watchlist</h3>
              <span className="text-xs text-base-content/60">Temps réel</span>
            </div>
            <div className="space-y-2">
              {watchlist.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedSymbol(asset.symbol)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${selectedSymbol === asset.symbol ? 'bg-primary/10 border border-primary/30' : 'bg-base-300/50 hover:bg-base-300 border border-transparent'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{asset.symbol}</div>
                      <div className="text-xs text-base-content/60">{asset.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-mono font-semibold">{asset.price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</div>
                      <div className={`text-sm ${asset.change >= 0 ? 'text-success' : 'text-error'}`}>
                        {formatChange(asset.change)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Carte secteurs</h3>
              <span className="text-xs text-base-content/60">Heatmap</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {heatmap.map((h) => {
                const positive = h.change >= 0;
                const intensity = Math.min(Math.abs(h.change) * 0.8, 0.9);
                const color = positive
                  ? `rgba(39, 224, 163, ${0.2 + intensity})`
                  : `rgba(239, 68, 68, ${0.2 + intensity})`;
                return (
                  <div key={h.label} className="p-3 rounded-xl border border-white/5" style={{ background: color }}>
                    <div className="text-sm font-semibold">{h.label}</div>
                    <div className={`text-sm ${positive ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {formatChange(h.change)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
