import axios from 'axios';

// Use our backend API instead of calling CoinGecko directly
// This provides better rate limiting, caching, and error handling
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const coinGeckoAPI = axios.create({
  baseURL: `${API_BASE_URL}/crypto`,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
  },
});

export interface CryptoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_date: string;
}

export interface CryptoDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
      eur: number;
      mad: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    circulating_supply: number;
    total_supply: number;
    ath: {
      usd: number;
    };
  };
}

export interface CryptoOHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

/**
 * Get list of top cryptocurrencies by market cap
 */
export const getCryptoMarkets = async (
  currency: string = 'usd',
  perPage: number = 50,
  page: number = 1
): Promise<CryptoMarket[]> => {
  try {
    const response = await coinGeckoAPI.get('/markets', {
      params: {
        currency,
        limit: perPage,
        page,
      },
    });
    return response.data.data; // Backend wraps in { success, data }
  } catch (error) {
    console.error('Error fetching crypto markets:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific cryptocurrency
 */
export const getCryptoDetail = async (id: string): Promise<CryptoDetail> => {
  try {
    const response = await coinGeckoAPI.get(`/${id}`);
    return response.data.data; // Backend wraps in { success, data }
  } catch (error) {
    console.error(`Error fetching crypto detail for ${id}:`, error);
    throw error;
  }
};

/**
 * Get OHLC data for charting
 * @param id - Crypto ID (e.g., 'bitcoin', 'ethereum')
 * @param days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 */
export const getCryptoOHLC = async (
  id: string,
  days: number = 30
): Promise<CryptoOHLCData[]> => {
  try {
    const response = await coinGeckoAPI.get(`/coins/${id}/ohlc`, {
      params: {
        vs_currency: 'usd',
        days: days,
      },
    });

    const payload = response.data?.data ?? response.data;

    if (!Array.isArray(payload)) {
      throw new Error('Invalid OHLC payload');
    }

    // CoinGecko returns: [timestamp, open, high, low, close]
    return payload.map((candle: number[]) => ({
      time: Math.floor(candle[0] / 1000), // Convert to seconds
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
    }));
  } catch (error) {
    console.error(`Error fetching OHLC data for ${id}:`, error);
    throw error;
  }
};

/**
 * Get historical market data (price, volume, market cap)
 * @param id - Crypto ID
 * @param days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 */
export const getCryptoMarketChart = async (
  id: string,
  days: number = 30
): Promise<{
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}> => {
  try {
    const response = await coinGeckoAPI.get(`/${id}/history`, {
      params: {
        currency: 'usd',
        days: days.toString(),
      },
    });
    return response.data.data; // Backend wraps in { success, data }
  } catch (error) {
    console.error(`Error fetching market chart for ${id}:`, error);
    throw error;
  }
};

/**
 * Get trending cryptocurrencies (top gainers/losers)
 */
export const getTrendingCryptos = async () => {
  try {
    const response = await coinGeckoAPI.get('/search/trending');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching trending cryptos:', error);
    throw error;
  }
};

/**
 * Search cryptocurrencies by name or symbol
 */
export const searchCryptos = async (query: string) => {
  try {
    const response = await coinGeckoAPI.get('/search', {
      params: { query },
    });
    return response.data.coins;
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw error;
  }
};

/**
 * Get simple price for multiple coins
 */
export const getSimplePrices = async (
  ids: string[],
  currencies: string[] = ['usd']
): Promise<Record<string, Record<string, number>>> => {
  try {
    const response = await coinGeckoAPI.get('/simple/price', {
      params: {
        ids: ids.join(','),
        vs_currencies: currencies.join(','),
        include_24hr_change: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching simple prices:', error);
    throw error;
  }
};

/**
 * Convert CoinGecko OHLC data to chart format with volume
 */
export const convertToChartData = async (id: string, days: number = 30) => {
  try {
    const [ohlcData, marketData] = await Promise.all([
      getCryptoOHLC(id, days),
      getCryptoMarketChart(id, days),
    ]);

    // Merge OHLC with volume data
    return ohlcData.map((candle, index) => {
      // Find closest volume data point
      const volumePoint = marketData.total_volumes[index];
      return {
        ...candle,
        volume: volumePoint ? volumePoint[1] : 0,
      };
    });
  } catch (error) {
    console.error('Error converting to chart data:', error);
    throw error;
  }
};

export default {
  getCryptoMarkets,
  getCryptoDetail,
  getCryptoOHLC,
  getCryptoMarketChart,
  getTrendingCryptos,
  searchCryptos,
  getSimplePrices,
  convertToChartData,
};
