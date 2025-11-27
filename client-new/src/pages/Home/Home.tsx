import { TradingChart } from '../../components/charts/TradingChart';
import type { CandlestickData } from 'lightweight-charts';

// Mock data generator
const generateMockData = (): CandlestickData[] => {
  const data: CandlestickData[] = [];
  const now = Date.now() / 1000;
  let basePrice = 485.50;

  for (let i = 60; i >= 0; i--) {
    const time = (now - i * 86400) as any;
    const change = (Math.random() - 0.5) * 10;
    basePrice += change;

    const open = basePrice;
    const high = basePrice + Math.random() * 5;
    const low = basePrice - Math.random() * 5;
    const close = basePrice + (Math.random() - 0.5) * 3;

    data.push({
      time,
      open,
      high,
      low,
      close,
    });
  }

  return data;
};

export const Home = () => {
  const mockData = generateMockData();

  const stats = [
    { label: 'MASI', value: '12,845.67', change: '+0.35%', positive: true },
    { label: 'MADEX', value: '10,456.89', change: '+0.31%', positive: true },
    { label: 'MSI20', value: '1,023.45', change: '-0.55%', positive: false },
  ];

  const topStocks = [
    { symbol: 'ATW', name: 'Attijariwafa Bank', price: '485.50', change: '+0.49%', positive: true },
    { symbol: 'BCP', name: 'BCP', price: '265.00', change: '+1.34%', positive: true },
    { symbol: 'IAM', name: 'Maroc Telecom', price: '125.80', change: '-0.94%', positive: false },
    { symbol: 'CIH', name: 'CIH Bank', price: '315.20', change: '-0.88%', positive: false },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Bourse de Casablanca</h1>
        <p className="text-base-content/70 mt-1">
          Suivez les marchés en temps réel
        </p>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-sm font-medium text-base-content/70">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p
                className={`text-sm font-semibold ${
                  stat.positive ? 'text-success' : 'text-error'
                }`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">ATTIJARIWAFA BANK (ATW)</h2>
            <div className="flex gap-2">
              <button className="btn btn-sm">1J</button>
              <button className="btn btn-sm btn-primary">1S</button>
              <button className="btn btn-sm">1M</button>
              <button className="btn btn-sm">1A</button>
            </div>
          </div>
          <TradingChart data={mockData} height={400} />
        </div>
      </div>

      {/* Top Stocks */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Actions Populaires</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbole</th>
                  <th>Nom</th>
                  <th className="text-right">Prix</th>
                  <th className="text-right">Variation</th>
                </tr>
              </thead>
              <tbody>
                {topStocks.map((stock) => (
                  <tr key={stock.symbol} className="hover">
                    <td className="font-bold">{stock.symbol}</td>
                    <td>{stock.name}</td>
                    <td className="text-right font-semibold">
                      {stock.price} MAD
                    </td>
                    <td className="text-right">
                      <span
                        className={`font-semibold ${
                          stock.positive ? 'text-success' : 'text-error'
                        }`}
                      >
                        {stock.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
