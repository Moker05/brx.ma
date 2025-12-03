import type { CandlestickData } from 'lightweight-charts';

export interface CandlestickDataWithVolume extends CandlestickData {
  volume?: number;
}

/**
 * Generate realistic mock candlestick data with volume
 */
export const generateMockData = (days: number = 60): CandlestickDataWithVolume[] => {
  const data: CandlestickDataWithVolume[] = [];
  const now = Math.floor(Date.now() / 1000);
  let basePrice = 485.50;

  // Trend parameters
  let trend = 0.1; // Slight uptrend
  let volatility = 0.02; // 2% volatility

  for (let i = days; i >= 0; i--) {
    const time = (now - i * 86400) as any; // Daily candles

    // Add some randomness to trend
    if (Math.random() > 0.9) {
      trend = (Math.random() - 0.5) * 0.3;
    }

    // Calculate OHLC with realistic patterns
    const dailyChange = (Math.random() - 0.5) * basePrice * volatility;
    const trendChange = trend * basePrice * 0.001;

    const open = basePrice;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const close = basePrice + dailyChange + trendChange;

    // High and low with realistic spreads
    const spread = Math.abs(close - open);
    const high = Math.max(open, close) + spread * Math.random() * 0.5;
    const low = Math.min(open, close) - spread * Math.random() * 0.5;

    // Volume with realistic patterns (higher volume on bigger moves)
    const priceMove = Math.abs(close - open) / open;
    const baseVolume = 500000 + Math.random() * 500000;
    const volume = baseVolume * (1 + priceMove * 5);

    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(volume),
    });

    basePrice = close;
  }

  return data;
};

/**
 * Generate intraday data (hourly)
 */
export const generateIntradayData = (hours: number = 24): CandlestickDataWithVolume[] => {
  const data: CandlestickDataWithVolume[] = [];
  const now = Math.floor(Date.now() / 1000);
  let basePrice = 485.50;

  for (let i = hours; i >= 0; i--) {
    const time = (now - i * 3600) as any; // Hourly candles

    const hourlyChange = (Math.random() - 0.5) * basePrice * 0.005; // 0.5% hourly volatility
    const open = basePrice;
    const close = basePrice + hourlyChange;

    const spread = Math.abs(close - open);
    const high = Math.max(open, close) + spread * Math.random() * 0.3;
    const low = Math.min(open, close) - spread * Math.random() * 0.3;

    const volume = Math.floor(50000 + Math.random() * 100000);

    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    basePrice = close;
  }

  return data;
};

/**
 * Generate weekly data
 */
export const generateWeeklyData = (weeks: number = 52): CandlestickDataWithVolume[] => {
  const data: CandlestickDataWithVolume[] = [];
  const now = Math.floor(Date.now() / 1000);
  let basePrice = 450.00;

  for (let i = weeks; i >= 0; i--) {
    const time = (now - i * 7 * 86400) as any; // Weekly candles

    const weeklyChange = (Math.random() - 0.5) * basePrice * 0.08; // 8% weekly volatility
    const open = basePrice;
    const close = basePrice + weeklyChange;

    const spread = Math.abs(close - open);
    const high = Math.max(open, close) + spread * Math.random();
    const low = Math.min(open, close) - spread * Math.random();

    const volume = Math.floor(2000000 + Math.random() * 3000000);

    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    basePrice = close;
  }

  return data;
};

/**
 * Get mock stock data by symbol
 */
export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';

export const getMockStockData = (symbol: string, timeframe: Timeframe = '1D') => {
  const baseData = {
    'ATW': { price: 485.50, name: 'Attijariwafa Bank' },
    'BCP': { price: 265.00, name: 'BCP' },
    'IAM': { price: 125.80, name: 'Maroc Telecom' },
    'CIH': { price: 315.20, name: 'CIH Bank' },
  };

  const stock = baseData[symbol as keyof typeof baseData] || baseData.ATW;

  let data: CandlestickDataWithVolume[];

  switch (timeframe) {
    case '1D':
      data = generateIntradayData(24);
      break;
    case '1W':
      data = generateMockData(7);
      break;
    case '1M':
      data = generateMockData(30);
      break;
    case '3M':
      data = generateMockData(90);
      break;
    case '6M':
      data = generateMockData(180);
      break;
    case '1Y':
      data = generateMockData(365);
      break;
    case 'YTD':
      data = generateMockData(320);
      break;
    case 'ALL':
      data = generateMockData(720);
      break;
    default:
      data = generateMockData(60);
  }

  return {
    symbol,
    name: stock.name,
    currentPrice: stock.price,
    data,
  };
};
