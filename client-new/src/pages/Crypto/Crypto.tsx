import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdvancedChart } from '../../components/charts/AdvancedChart';
import { TradeModal } from '../../components/trading/TradeModal';
import { getCryptoMarkets, convertToChartData } from '../../services/coinGeckoAPI';
import type { CryptoMarket } from '../../services/coinGeckoAPI';
import { FiTrendingUp, FiTrendingDown, FiShoppingCart, FiDollarSign } from 'react-icons/fi';

export const Crypto = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState<1 | 7 | 30 | 365>(30);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');

  // Fetch crypto markets list
  const {
    data: markets,
    isLoading: marketsLoading,
    error: marketsError,
    refetch: refetchMarkets,
  } = useQuery({
    queryKey: ['cryptoMarkets'],
    queryFn: () => getCryptoMarkets('usd', 20, 1),
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch chart data for selected crypto
  const {
    data: chartData,
    isLoading: chartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ['cryptoChart', selectedCrypto, timeframe],
    queryFn: () => convertToChartData(selectedCrypto, timeframe),
    enabled: !!selectedCrypto,
  });

  const selectedMarket = markets?.find((m) => m.id === selectedCrypto);

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const handleOpenTrade = (type: 'BUY' | 'SELL') => {
    setTradeType(type);
    setTradeModalOpen(true);
  };

  const handleTradeSuccess = () => {
    refetchMarkets();
  };

  if (marketsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Crypto-monnaies</h1>
        <div className="alert alert-error">
          <span>Erreur lors du chargement des données. Veuillez réessayer plus tard.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Crypto-monnaies</h1>
        <p className="text-base-content/70 mt-1">Données en temps réel via CoinGecko API • Trading virtuel</p>
      </div>

      {/* Stats */}
      {selectedMarket && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/70">Prix actuel</h3>
              <p className="text-2xl font-bold">{formatPrice(selectedMarket.current_price)}</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/70">Variation 24h</h3>
              <p
                className={`text-2xl font-bold ${
                  selectedMarket.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {selectedMarket.price_change_percentage_24h >= 0 ? '+' : ''}
                {selectedMarket.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/70">Market Cap</h3>
              <p className="text-2xl font-bold">{formatMarketCap(selectedMarket.market_cap)}</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/70">Volume 24h</h3>
              <p className="text-2xl font-bold">{formatMarketCap(selectedMarket.total_volume)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              {selectedMarket && (
                <>
                  <div className="flex items-center gap-3">
                    <img src={selectedMarket.image} alt={selectedMarket.name} className="w-8 h-8" />
                    <h2 className="card-title">
                      {selectedMarket.name} ({selectedMarket.symbol.toUpperCase()})
                    </h2>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {formatPrice(selectedMarket.current_price)}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Trading Buttons */}
              <button
                className="btn btn-success btn-sm gap-2"
                onClick={() => handleOpenTrade('BUY')}
                disabled={!selectedMarket}
              >
                <FiShoppingCart />
                Acheter
              </button>
              <button
                className="btn btn-error btn-sm gap-2"
                onClick={() => handleOpenTrade('SELL')}
                disabled={!selectedMarket}
              >
                <FiDollarSign />
                Vendre
              </button>

              {/* Timeframe Buttons */}
              <div className="divider divider-horizontal mx-0"></div>
              <button
                className={`btn btn-sm ${timeframe === 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeframe(1)}
              >
                1J
              </button>
              <button
                className={`btn btn-sm ${timeframe === 7 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeframe(7)}
              >
                7J
              </button>
              <button
                className={`btn btn-sm ${timeframe === 30 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeframe(30)}
              >
                30J
              </button>
              <button
                className={`btn btn-sm ${timeframe === 365 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setTimeframe(365)}
              >
                1A
              </button>
            </div>
          </div>

          {chartLoading && (
            <div className="flex justify-center items-center h-96">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {chartError && (
            <div className="alert alert-error">
              <span>Erreur lors du chargement du graphique</span>
            </div>
          )}

          {chartData && !chartLoading && (
            <AdvancedChart data={chartData} height={500} symbol={selectedCrypto} />
          )}
        </div>
      </div>

      {/* Crypto List */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Top Crypto-monnaies</h2>

          {marketsLoading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}

          {markets && !marketsLoading && (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th className="text-right">Prix</th>
                    <th className="text-right">24h</th>
                    <th className="text-right">7j</th>
                    <th className="text-right">Market Cap</th>
                    <th className="text-right">Volume</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((crypto: CryptoMarket) => (
                    <tr
                      key={crypto.id}
                      className={`hover ${
                        selectedCrypto === crypto.id ? 'bg-primary/20' : ''
                      }`}
                    >
                      <td className="font-bold">{crypto.market_cap_rank}</td>
                      <td
                        className="cursor-pointer"
                        onClick={() => setSelectedCrypto(crypto.id)}
                      >
                        <div className="flex items-center gap-3">
                          <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                          <div>
                            <div className="font-bold">{crypto.name}</div>
                            <div className="text-sm opacity-50">{crypto.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-semibold">
                        {formatPrice(crypto.current_price)}
                      </td>
                      <td className="text-right">
                        <span
                          className={`flex items-center justify-end gap-1 font-semibold ${
                            crypto.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'
                          }`}
                        >
                          {crypto.price_change_percentage_24h >= 0 ? (
                            <FiTrendingUp />
                          ) : (
                            <FiTrendingDown />
                          )}
                          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right">
                        {crypto.price_change_percentage_7d_in_currency ? (
                          <span
                            className={`font-semibold ${
                              crypto.price_change_percentage_7d_in_currency >= 0
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            {crypto.price_change_percentage_7d_in_currency >= 0 ? '+' : ''}
                            {crypto.price_change_percentage_7d_in_currency.toFixed(2)}%
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="text-right">{formatMarketCap(crypto.market_cap)}</td>
                      <td className="text-right">{formatMarketCap(crypto.total_volume)}</td>
                      <td className="text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="btn btn-success btn-xs"
                            onClick={() => {
                              setSelectedCrypto(crypto.id);
                              handleOpenTrade('BUY');
                            }}
                          >
                            Buy
                          </button>
                          <button
                            className="btn btn-error btn-xs"
                            onClick={() => {
                              setSelectedCrypto(crypto.id);
                              handleOpenTrade('SELL');
                            }}
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Trade Modal */}
      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        crypto={selectedMarket || null}
        type={tradeType}
        onSuccess={handleTradeSuccess}
      />
    </div>
  );
};
