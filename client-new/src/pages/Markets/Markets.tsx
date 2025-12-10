import { useMemo, useState, useEffect } from 'react';
import { BVC_STOCKS, getStockByTicker } from '../../data/bvc-tradingview-mapping';
import TradingViewChart from '../../components/charts/TradingViewChart';
import useDebounce from '../../hooks/useDebounce';
import { usePostsBySymbol } from '../../hooks/useSocial';
import { useBVCMarkets } from '../../hooks/useBVC';

const sectorPerformance = [
  { name: 'Banking', change: 0.72 },
  { name: 'Telecommunications', change: -0.12 },
  { name: 'Real Estate', change: 0.34 },
  { name: 'Retail', change: 0.18 },
  { name: 'Energy', change: 1.12 },
];

const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

export const Markets = () => {
  const [query, setQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<typeof BVC_STOCKS[0] | null>(BVC_STOCKS[0]); // Select first stock by default
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('brx_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const { data: marketsData, isLoading: marketsLoading } = useBVCMarkets();

  const mappedStocks = useMemo(() => {
    if (!marketsData) return BVC_STOCKS;
    return marketsData.map((m: any) => {
      const found = getStockByTicker(m.symbol?.toUpperCase());
      return {
        ticker: m.symbol?.toUpperCase() || found?.ticker || m.symbol,
        name: found?.name || m.name || m.symbol,
        sector: found?.sector || m.sector || 'Other',
        tradingViewSymbol: found?.tradingViewSymbol || `CSEMA:${m.symbol?.toUpperCase()}`,
        price: m.price,
        change: m.change,
      } as any;
    });
  }, [marketsData]);

  const sectorsList = useMemo(() => Array.from(new Set(mappedStocks.map((s: any) => s.sector))).sort(), [mappedStocks]);

  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    return mappedStocks.filter((m: any) => {
      const q = debouncedQuery.trim().toLowerCase();
      const matchesQuery = q === '' || (m.name || '').toLowerCase().includes(q) || (m.ticker || '').toLowerCase().includes(q) || (m.tradingViewSymbol || '').toLowerCase().includes(q);
      const matchesSector = !sectorFilter || m.sector === sectorFilter;
      const matchesFavorite = !showFavoritesOnly || favorites.includes(m.ticker);
      return matchesQuery && matchesSector && matchesFavorite;
    });
  }, [debouncedQuery, sectorFilter, favorites, showFavoritesOnly, mappedStocks]);

  useEffect(() => {
    try {
      localStorage.setItem('brx_favorites', JSON.stringify(favorites));
    } catch (e) {
      // ignore
    }
  }, [favorites]);

  const { data: postsData, isLoading: postsLoading } = usePostsBySymbol(selectedStock?.ticker, 1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 font-semibold">Marchés</p>
          <h1 className="text-3xl font-bold font-display">Actions BVC</h1>
          <p className="text-base-content/70">Analyse en temps réel avec graphiques TradingView</p>
        </div>
      </div>

      {/* Main Content: Sidebar + Chart + Social */}
      <div className="grid grid-cols-12 gap-4">

        {/* LEFT SIDEBAR: Stock List */}
        <div className="col-span-12 lg:col-span-3 space-y-3">

          {/* Search & Filters */}
          <div className="glass rounded-xl p-3 border border-white/5">
            <input
              className="input input-sm w-full mb-2"
              placeholder="Rechercher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-2 mb-2">
              <label className="cursor-pointer label">
                <input type="checkbox" className="checkbox checkbox-sm mr-2" checked={showFavoritesOnly} onChange={(e) => setShowFavoritesOnly(e.target.checked)} />
                <span className="label-text">Favoris seulement</span>
              </label>
              <div className="text-xs text-base-content/60 ml-auto">Favoris: {favorites.length}</div>
            </div>
            <select
              className="select select-sm w-full"
              value={sectorFilter ?? ''}
              onChange={(e) => setSectorFilter(e.target.value || null)}
            >
              <option value="">Tous les secteurs</option>
              {sectorsList.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>

          {/* Sector Performance */}
          <div className="glass rounded-xl p-3 border border-white/5">
            <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
              <span>Performance Secteurs</span>
              <span className="text-xs text-base-content/60">Aujourd'hui</span>
            </h3>
            <div className="space-y-1.5">
              {sectorPerformance.map((s) => {
                const positive = s.change >= 0;
                const color = positive ? 'text-success' : 'text-error';
                return (
                  <div key={s.name} className="flex items-center justify-between text-xs p-1.5 rounded bg-base-300/30">
                    <span className="font-medium">{s.name}</span>
                    <span className={color}>{formatChange(s.change)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stock List - Scrollable */}
          <div className="glass rounded-xl p-3 border border-white/5">
            <h3 className="text-sm font-semibold mb-2">
              Actions ({filtered.length})
            </h3>
            <div className="space-y-1 max-h-[600px] overflow-y-auto scrollbar-thin">
              {marketsLoading && (!mappedStocks || mappedStocks.length === 0) ? (
                <div className="p-4 text-center text-sm">Chargement des marchés...</div>
              ) : filtered.map((stock: any) => {
                const isSelected = selectedStock?.tradingViewSymbol === stock.tradingViewSymbol;
                const displayTicker = (stock.tradingViewSymbol || '').split(':')[1] || stock.ticker;
                const isFav = favorites.includes(stock.ticker);

                return (
                  <div key={stock.tradingViewSymbol} className="w-full">
                    <div
                      onClick={() => {
                        setSelectedStock(stock);
                        setIsLoadingChart(true);
                        try {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } catch (e) {
                          // ignore
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/20 border-l-4 border-primary shadow-sm'
                          : 'bg-base-300/30 hover:bg-base-300/50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{displayTicker}</div>
                          <div className="text-xs text-base-content/60 truncate">{stock.name}</div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-mono font-semibold">{stock.price ? `${Number(stock.price).toFixed(2)} MAD` : '—'}</div>
                            <div className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-error'}`}>{stock.change ? `${stock.change > 0 ? '+' : ''}${Number(stock.change).toFixed(2)}%` : '—'}</div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorites((prev) => prev.includes(stock.ticker) ? prev.filter((t) => t !== stock.ticker) : [...prev, stock.ticker]);
                            }}
                            className={`btn btn-ghost btn-xs ${isFav ? 'text-warning' : ''}`}
                            title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          >
                            {isFav ? '★' : '☆'}
                          </button>
                          {isSelected && (
                            <div>
                              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="badge badge-ghost badge-xs">{stock.sector}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CENTER & RIGHT: Chart + Social Section */}
        <div className="col-span-12 lg:col-span-9 space-y-4">

          {/* Selected Stock Info + Chart */}
          {selectedStock && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedStock.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-base-content/60">{selectedStock.tradingViewSymbol}</span>
                      <span className="badge badge-primary badge-sm">{selectedStock.sector}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-primary">Acheter</button>
                    <button className="btn btn-sm btn-ghost">+ Portfolio</button>
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
                  height={500}
                  interval="D"
                  theme="dark"
                  onLoadingChange={(l) => setIsLoadingChart(Boolean(l))}
                />
              </div>
            </div>
          )}

          {/* Social Section: Comments & Ratings */}
          {selectedStock && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Discussion & Avis</h3>
                <a
                  href={`/stock/${selectedStock.ticker}/discussion`}
                  className="btn btn-sm btn-ghost"
                >
                  Voir tout →
                </a>
              </div>

              {/* Tabs: Avis | Commentaires | Analyse */}
              <div className="tabs tabs-boxed mb-4">
                <a className="tab tab-active">💬 Commentaires</a>
                <a className="tab">⭐ Avis</a>
                <a className="tab">📊 Analyse Technique</a>
              </div>

              {/* Comments Preview (from backend) */}
              <div className="space-y-3">
                {postsLoading && (
                  <div className="p-3 bg-base-200/50 rounded-lg">Chargement des commentaires...</div>
                )}
                {!postsLoading && (((postsData as any[])?.length) ?? 0) === 0 && (
                  <div className="p-3 bg-base-200/50 rounded-lg">Aucun commentaire pour le moment.</div>
                )}

                {(((postsData ?? []) as any[]) || []).slice(0, 3).map((post: any) => (
                  <div key={post.id} className="p-3 bg-base-200/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-sm">{post.user?.displayName?.slice(0,2) ?? 'U'}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{post.user?.displayName ?? 'Utilisateur'}</span>
                          <span className="text-xs text-base-content/60">{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="btn btn-ghost btn-xs">👍 {post.likesCount ?? 0}</button>
                          <button className="btn btn-ghost btn-xs">💬 Répondre</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Comment Box */}
                <div className="p-3 bg-base-300/30 rounded-lg border border-dashed border-base-content/20">
                  <textarea
                    className="textarea textarea-sm w-full"
                    placeholder={`Partagez votre analyse sur ${selectedStock.name}...`}
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-base-content/60">
                      💡 Partagez vos insights techniques ou fondamentaux
                    </div>
                    <button className="btn btn-primary btn-sm">Publier</button>
                  </div>
                </div>
              </div>

              {/* CTA to Full Discussion */}
              <div className="mt-4 text-center">
                <a
                  href={`/stock/${selectedStock.ticker}/discussion`}
                  className="btn btn-outline btn-sm"
                >
                  Voir toute la discussion ({Math.floor(Math.random() * 50) + 10} commentaires)
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
