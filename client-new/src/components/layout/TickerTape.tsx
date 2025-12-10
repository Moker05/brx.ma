import { useQuery } from '@tanstack/react-query';
import { getBVCStocks, getBVCIndices } from '../../services/bvcAPI';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './TickerTape.css';

export const TickerTape = () => {
  const { data: stocks } = useQuery({
    queryKey: ['bvc-stocks-ticker'],
    queryFn: getBVCStocks,
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: indices } = useQuery({
    queryKey: ['bvc-indices-ticker'],
    queryFn: getBVCIndices,
    refetchInterval: 60000,
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  if (!stocks && !indices) {
    return null;
  }

  // Combine indices and stocks for ticker
  const tickerItems = [
    ...(indices || []).map((index) => ({
      type: 'index' as const,
      symbol: index.code,
      name: index.name,
      price: index.value,
      change: index.change,
      changePercent: index.changePercent,
    })),
    ...(stocks || []).map((stock) => ({
      type: 'stock' as const,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.lastPrice,
      change: stock.change,
      changePercent: stock.changePercent,
    })),
  ];

  return (
    <div className="ticker-tape-container bg-base-300 border-b border-base-300">
      <div className="ticker-tape">
        <div className="ticker-content">
          {/* Duplicate items for seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={`ticker-${item.type}-${item.symbol}-${index}`}
              className="ticker-item flex items-center gap-3 px-6 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{item.symbol}</span>
                {item.type === 'index' && (
                  <span className="badge badge-sm badge-outline">INDEX</span>
                )}
              </div>
              <span className="font-semibold">{formatPrice(item.price)}</span>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  item.change >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {item.change >= 0 ? (
                  <FiTrendingUp size={14} />
                ) : (
                  <FiTrendingDown size={14} />
                )}
                <span>{formatChange(item.change, item.changePercent)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
