import { useState } from 'react';
import TradingViewChart from '../../components/charts/TradingViewChart';
import { BVC_STOCKS } from '../../data/bvc-tradingview-mapping';
import { useBVCIndices, useBVCTopMovers } from '../../hooks/useBVC';
const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

export const Home = () => {
  const [selectedStock, setSelectedStock] = useState<typeof BVC_STOCKS[0] | null>(BVC_STOCKS[0]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const { data: indicesData } = useBVCIndices();

  // Extract MASI and MADEX from indices array
  const masiIndex = indicesData?.find((idx: any) => idx.code === 'MASI');
  const madexIndex = indicesData?.find((idx: any) => idx.code === 'MADEX');

  const stats = indicesData && masiIndex
    ? [
        {
          label: 'MASI',
          value: Number(masiIndex.value).toLocaleString(),
          change: masiIndex.changePercent,
          description: 'Moroccan All Shares Index'
        },
        {
          label: madexIndex ? 'MADEX' : 'MSI20',
          value: madexIndex ? Number(madexIndex.value).toLocaleString() : '—',
          change: madexIndex?.changePercent || 0,
          description: madexIndex ? 'Moroccan Most Active Shares Index' : 'Morocco Stock Index 20'
        },
        {
          label: 'Volume',
          value: '—',
          change: 0,
          description: "Volume échangé aujourd'hui"
        },
      ]
    : [
        { label: 'MASI', value: '—', change: 0, description: 'Moroccan All Shares Index' },
        { label: 'MADEX', value: '—', change: 0, description: 'Moroccan Most Active Shares Index' },
        { label: 'Volume', value: '—', change: 0, description: "Volume échangé aujourd'hui" },
      ];

  const { data: topMoversData } = useBVCTopMovers();

  const sectorGainers = topMoversData?.gainers || [];
  const sectorLosers = topMoversData?.losers || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase tracking-[0.2em] text-primary/70 font-semibold">BRX.MA</p>
        <div className="flex items-center gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard Marchés</h1>
            <p className="text-base-content/70">Suivez les marchés BVC et crypto avec une expérience type plateforme de trading.</p>
          </div>
          <div>
            <a className="btn btn-ghost btn-sm" href="/markets">Voir tous les marchés →</a>
          </div>
        </div>
      </div>

      <div className="card-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 flex flex-col gap-1">
            <div className="text-sm text-base-content/60">{stat.label}</div>
            <div className="text-2xl font-bold text-mono">{stat.value}</div>
            <div className={`text-sm font-semibold ${stat.change >= 0 ? 'text-success' : 'text-error'}`}>
              {formatChange(stat.change)}
            </div>
            <div className="text-xs text-base-content/60">{stat.description}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-4">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Top Gainers</h3>
              <span className="text-xs text-base-content/60">BVC</span>
            </div>
            <div className="space-y-2">
              {sectorGainers.map((s: any, idx: number) => {
                const stockSymbol = s.symbol || s.ticker || '';
                const stock = BVC_STOCKS.find((st) =>
                  st.ticker.toUpperCase() === stockSymbol.toUpperCase()
                );

                return (
                  <button
                    key={`gainer-${stockSymbol}-${idx}`}
                    onClick={() => {
                      // Use found stock or create a minimal stock object
                      const selectedStockData = stock || {
                        ticker: stockSymbol,
                        name: s.name || stockSymbol,
                        sector: s.sector || 'Unknown',
                        tradingViewSymbol: `CSEMA:${stockSymbol.substring(0, 3).toUpperCase()}`
                      };
                      setSelectedStock(selectedStockData as any);
                      setIsLoadingChart(true);
                      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{stockSymbol}</div>
                      <div className="text-xs text-base-content/60">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-mono font-semibold">{(s.price ?? '—') === '—' ? '—' : `${Number(s.price).toFixed(2)} MAD`}</div>
                      <div className="text-success text-sm">{formatChange(s.change ?? 0)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Top Losers</h3>
              <span className="text-xs text-base-content/60">BVC</span>
            </div>
            <div className="space-y-2">
              {sectorLosers.map((s: any, idx: number) => {
                const stockSymbol = s.symbol || s.ticker || '';
                const stock = BVC_STOCKS.find((st) =>
                  st.ticker.toUpperCase() === stockSymbol.toUpperCase()
                );

                return (
                  <button
                    key={`loser-${stockSymbol}-${idx}`}
                    onClick={() => {
                      // Use found stock or create a minimal stock object
                      const selectedStockData = stock || {
                        ticker: stockSymbol,
                        name: s.name || stockSymbol,
                        sector: s.sector || 'Unknown',
                        tradingViewSymbol: `CSEMA:${stockSymbol.substring(0, 3).toUpperCase()}`
                      };
                      setSelectedStock(selectedStockData as any);
                      setIsLoadingChart(true);
                      try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{stockSymbol}</div>
                      <div className="text-xs text-base-content/60">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-mono font-semibold">{(s.price ?? '—') === '—' ? '—' : `${Number(s.price).toFixed(2)} MAD`}</div>
                      <div className="text-error text-sm">{formatChange(s.change ?? 0)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Indices</h3>
              <span className="text-xs text-base-content/60">BVC</span>
            </div>
            <div className="space-y-2">
              {stats.slice(0, 2).map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => {
                    // Find the corresponding TradingView symbol for the index
                    const indexSymbol = stat.label === 'MASI' ? 'CASABLANCA:MASI' : 'CASABLANCA:MSI20';
                    setSelectedStock({
                      ticker: stat.label,
                      name: stat.description,
                      tradingViewSymbol: indexSymbol,
                      sector: 'Index',
                    } as any);
                    setIsLoadingChart(true);
                    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold">{stat.label}</div>
                    <div className="text-xs text-base-content/60">{stat.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-mono font-semibold">{stat.value}</div>
                    <div className={`text-sm ${stat.change >= 0 ? 'text-success' : 'text-error'}`}>
                      {formatChange(stat.change)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-8">
          {selectedStock && (
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-base-content/60">{selectedStock.tradingViewSymbol}</span>
                      <span className="badge badge-primary badge-sm">{selectedStock.sector}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TradingView Chart */}
              <div className="bg-base-200/50 rounded-lg p-2 relative">
                {isLoadingChart && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-base-200/80 rounded-lg">
                    <div className="text-center">
                      <div className="loader mb-2" />
                      <div className="text-sm">Chargement du graphique...</div>
                    </div>
                  </div>
                )}
                <TradingViewChart
                  symbol={selectedStock.tradingViewSymbol}
                  height={600}
                  interval="D"
                  theme="dark"
                  onLoadingChange={(l) => setIsLoadingChart(Boolean(l))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Chart is now embedded in the page; modal removed. */}
    </div>
  );
};
