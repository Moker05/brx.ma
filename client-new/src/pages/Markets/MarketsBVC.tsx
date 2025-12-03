import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getBVCMarketSummary,
  getBVCSectorPerformance,
  type BVCStock,
} from '../../services/bvcAPI';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiBarChart2,
  FiPieChart,
  FiActivity,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const MarketsBVC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  // Fetch market summary
  const {
    data: marketSummary,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['bvc-market-summary'],
    queryFn: getBVCMarketSummary,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch sector performance
  const { data: sectors } = useQuery({
    queryKey: ['bvc-sectors'],
    queryFn: getBVCSectorPerformance,
    refetchInterval: 60000,
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1000000000) {
      return `${(marketCap / 1000000000).toFixed(1)}Md MAD`;
    } else if (marketCap >= 1000000) {
      return `${(marketCap / 1000000).toFixed(0)}M MAD`;
    }
    return `${marketCap.toFixed(0)} MAD`;
  };

  const StockCard = ({ stock }: { stock: BVCStock }) => (
    <Link
      to={`/markets/bvc/${stock.symbol}`}
      className="card bg-base-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
    >
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{stock.symbol}</h3>
            <p className="text-xs text-base-content/60 line-clamp-1">{stock.name}</p>
          </div>
          {stock.sector && (
            <span className="badge badge-sm badge-outline">{stock.sector}</span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{formatPrice(stock.lastPrice)} MAD</span>
            <div
              className={`flex items-center gap-1 font-semibold ${
                stock.change >= 0 ? 'text-success' : 'text-error'
              }`}
            >
              {stock.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>
                {stock.change >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-base-content/60">Volume:</span>
              <span className="ml-1 font-semibold">{formatVolume(stock.volume)}</span>
            </div>
            {stock.marketCap && (
              <div className="text-right">
                <span className="text-base-content/60">Cap.:</span>
                <span className="ml-1 font-semibold">{formatMarketCap(stock.marketCap)}</span>
              </div>
            )}
          </div>

          {(stock.high || stock.low) && (
            <div className="text-xs text-base-content/60">
              H: {formatPrice(stock.high || 0)} / L: {formatPrice(stock.low || 0)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!marketSummary) {
    return (
      <div className="alert alert-error">
        <span>Erreur lors du chargement des données du marché</span>
      </div>
    );
  }

  // Filter stocks for "All Stocks" section
  const allStocks = [
    ...marketSummary.topGainers,
    ...marketSummary.topLosers,
    ...marketSummary.mostActive,
  ];

  // Remove duplicates
  const uniqueStocks = Array.from(
    new Map(allStocks.map((stock) => [stock.symbol, stock])).values()
  );

  const filteredStocks = uniqueStocks.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      selectedSector === 'ALL' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bourse de Casablanca</h1>
          <p className="text-base-content/70 mt-1">
            Marchés en direct • Données avec délai de 15 minutes
          </p>
        </div>
        <button
          className="btn btn-outline btn-sm gap-2"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <FiRefreshCw className={isFetching ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketSummary.indices.map((index) => (
          <div key={index.code} className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium opacity-90">{index.name}</h3>
                  <p className="text-3xl font-bold mt-1">{formatPrice(index.value)}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      index.change >= 0 ? 'text-success' : 'text-error'
                    }`}
                  >
                    {index.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span>
                      {index.change >= 0 ? '+' : ''}
                      {index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-sm opacity-75 mt-1">
                    {index.change >= 0 ? '+' : ''}
                    {formatPrice(index.change)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/20 rounded-lg">
                <FiTrendingUp className="text-success" size={24} />
              </div>
              <div>
                <p className="text-sm text-base-content/70">En hausse</p>
                <p className="text-2xl font-bold text-success">{marketSummary.advancers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-error/20 rounded-lg">
                <FiTrendingDown className="text-error" size={24} />
              </div>
              <div>
                <p className="text-sm text-base-content/70">En baisse</p>
                <p className="text-2xl font-bold text-error">{marketSummary.decliners}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-info/20 rounded-lg">
                <FiBarChart2 className="text-info" size={24} />
              </div>
              <div>
                <p className="text-sm text-base-content/70">Inchangés</p>
                <p className="text-2xl font-bold">{marketSummary.unchanged}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/20 rounded-lg">
                <FiActivity className="text-warning" size={24} />
              </div>
              <div>
                <p className="text-sm text-base-content/70">Volume Total</p>
                <p className="text-2xl font-bold">{formatVolume(marketSummary.totalVolume)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Performance */}
      {sectors && sectors.length > 0 && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4 flex items-center gap-2">
              <FiPieChart />
              Performance Sectorielle
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sectors.map((sector) => (
                <div
                  key={sector.sector}
                  className="p-4 bg-base-300 rounded-lg hover:bg-base-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedSector(sector.sector)}
                >
                  <p className="text-sm font-medium mb-2">{sector.sector}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xl font-bold ${
                        sector.performance >= 0 ? 'text-success' : 'text-error'
                      }`}
                    >
                      {sector.performance >= 0 ? '+' : ''}
                      {sector.performance.toFixed(2)}%
                    </span>
                    <span className="text-xs text-base-content/60">
                      {sector.stocks} titres
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Gainers */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 text-success flex items-center gap-2">
            <FiTrendingUp />
            Top Hausses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {marketSummary.topGainers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      </div>

      {/* Top Losers */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 text-error flex items-center gap-2">
            <FiTrendingDown />
            Top Baisses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {marketSummary.topLosers.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      </div>

      {/* Most Active */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4 flex items-center gap-2">
            <FiActivity />
            Plus Actifs (Volume)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {marketSummary.mostActive.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      </div>

      {/* All Stocks */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Toutes les Actions</h2>
            <div className="flex gap-2">
              <select
                className="select select-bordered select-sm"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="ALL">Tous les secteurs</option>
                {sectors?.map((sector) => (
                  <option key={sector.sector} value={sector.sector}>
                    {sector.sector}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Rechercher..."
                className="input input-bordered input-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
