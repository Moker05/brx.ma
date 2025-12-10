import { useMemo, useState, useEffect } from 'react';
import { coinGeckoToTradingView, getCryptoCategory } from '../../data/crypto-tradingview-mapping';
import { useCryptoMarkets } from '../../hooks/useCrypto';
import TradingViewChart from '../../components/charts/TradingViewChart';
import useDebounce from '../../hooks/useDebounce';

const categoryPerformance = [
  { name: 'Layer 1', change: 2.45 },
  { name: 'DeFi', change: -1.23 },
  { name: 'Metaverse', change: 3.67 },
  { name: 'Layer 2', change: 1.89 },
  { name: 'Payment', change: 0.56 },
];

const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

export const Crypto = () => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<{
    ticker: string;
    name: string;
    category: string;
    tradingViewSymbol: string;
  } | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('brx_crypto_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const { data: markets, isLoading: marketsLoading } = useCryptoMarkets(250, 1);

  const mappedAssets = useMemo(() => {
    if (!markets) return [];
    return markets.map((m) => ({
      ticker: m.symbol.toUpperCase(),
      name: m.name,
      category: getCryptoCategory(m.market_cap_rank),
      tradingViewSymbol: coinGeckoToTradingView(m.id, m.symbol),
    }));
  }, [markets]);

  const categoriesList = useMemo(() => Array.from(new Set(mappedAssets.map((c) => c.category))).sort(), [mappedAssets]);

  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    return mappedAssets.filter((crypto) => {
      const q = debouncedQuery.trim().toLowerCase();
      const matchesQuery = q === '' || crypto.name.toLowerCase().includes(q) || crypto.ticker.toLowerCase().includes(q);
      const matchesCategory = !categoryFilter || crypto.category === categoryFilter;
      const matchesFavorite = !showFavoritesOnly || favorites.includes(crypto.ticker);
      return matchesQuery && matchesCategory && matchesFavorite;
    });
  }, [debouncedQuery, categoryFilter, favorites, showFavoritesOnly, mappedAssets]);

  useEffect(() => {
    if (!selectedCrypto && mappedAssets.length > 0) {
      setSelectedCrypto(mappedAssets[0]);
    }
  }, [mappedAssets, selectedCrypto]);

  useEffect(() => {
    try {
      localStorage.setItem('brx_crypto_favorites', JSON.stringify(favorites));
    } catch (e) {
      // ignore
    }
  }, [favorites]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 font-semibold">Cryptomonnaies</p>
          <h1 className="text-3xl font-bold font-display">Marchés Crypto</h1>
          <p className="text-base-content/70">Analyse en temps réel avec graphiques TradingView</p>
        </div>
      </div>

      {/* Main Content: Sidebar + Chart */}
      <div className="grid grid-cols-12 gap-4">

        {/* LEFT SIDEBAR: Crypto List */}
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
              value={categoryFilter ?? ''}
              onChange={(e) => setCategoryFilter(e.target.value || null)}
            >
              <option value="">Toutes catégories</option>
              {categoriesList.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>

          {/* Category Performance */}
          <div className="glass rounded-xl p-3 border border-white/5">
            <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
              <span>Performance Catégories</span>
              <span className="text-xs text-base-content/60">24h</span>
            </h3>
            <div className="space-y-1.5">
              {categoryPerformance.map((cat) => {
                const positive = cat.change >= 0;
                const color = positive ? 'text-success' : 'text-error';
                return (
                  <div key={cat.name} className="flex items-center justify-between text-xs p-1.5 rounded bg-base-300/30">
                    <span className="font-medium">{cat.name}</span>
                    <span className={color}>{formatChange(cat.change)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crypto List - Scrollable */}
          <div className="glass rounded-xl p-3 border border-white/5">
            <h3 className="text-sm font-semibold mb-2">
              Cryptos ({filtered.length})
            </h3>
              <div className="space-y-1 max-h-[600px] overflow-y-auto scrollbar-thin">
              {marketsLoading && !mappedAssets.length ? (
                <div className="p-4 text-center text-sm">Chargement des marchés...</div>
              ) : filtered.map((crypto) => {
                const isSelected = selectedCrypto?.tradingViewSymbol === crypto.tradingViewSymbol;
                const isFav = favorites.includes(crypto.ticker);

                return (
                  <div key={crypto.tradingViewSymbol} className="w-full">
                    <div
                      onClick={() => {
                        setSelectedCrypto(crypto);
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
                          <div className="font-semibold text-sm truncate">{crypto.ticker}</div>
                          <div className="text-xs text-base-content/60 truncate">{crypto.name}</div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorites((prev) => prev.includes(crypto.ticker) ? prev.filter((t) => t !== crypto.ticker) : [...prev, crypto.ticker]);
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
                        <span className="badge badge-ghost badge-xs">{crypto.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* CENTER & RIGHT: Chart */}
        <div className="col-span-12 lg:col-span-9">

          {/* Selected Crypto Info + Chart */}
          {selectedCrypto && (
            <div className="glass rounded-xl p-4 border border-white/5">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCrypto.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-base-content/60">{selectedCrypto.ticker}</span>
                      <span className="badge badge-primary badge-sm">{selectedCrypto.category}</span>
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
                  symbol={selectedCrypto.tradingViewSymbol}
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
    </div>
  );
};
