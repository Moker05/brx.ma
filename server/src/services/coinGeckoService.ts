import axios from 'axios';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// Rate limit: 50 calls/minute for free tier
const axiosInstance = axios.create({
  baseURL: COINGECKO_API_BASE,
  timeout: 10000,
});

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
}

export interface CoinGeckoPriceHistory {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export type CoinGeckoOHLC = [number, number, number, number, number]; // [timestamp, open, high, low, close]

/**
 * Get list of cryptocurrencies with market data
 * @param vsCurrency - Currency to compare (usd, eur, mad)
 * @param perPage - Number of results (max 250)
 * @param page - Page number
 */
export const getMarketData = async (
  vsCurrency = 'usd',
  perPage = 100,
  page = 1
): Promise<CoinGeckoMarketData[]> => {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
        price_change_percentage: '7d,30d',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching market data from CoinGecko:', error);
    throw new Error('Failed to fetch cryptocurrency market data');
  }
};

/**
 * Get specific cryptocurrency by ID
 * @param coinId - CoinGecko coin ID (bitcoin, ethereum, etc.)
 */
export const getCoinById = async (coinId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching coin ${coinId} from CoinGecko:`, error);
    throw new Error(`Failed to fetch cryptocurrency ${coinId}`);
  }
};

/**
 * Get historical price data
 * @param coinId - CoinGecko coin ID
 * @param vsCurrency - Currency to compare
 * @param days - Number of days (1, 7, 14, 30, 90, 180, 365, max)
 */
export const getHistoricalData = async (
  coinId: string,
  vsCurrency = 'usd',
  days = 30
): Promise<CoinGeckoPriceHistory> => {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vsCurrency,
        days,
        interval: days <= 1 ? 'hourly' : 'daily',
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    throw new Error(`Failed to fetch historical data for ${coinId}`);
  }
};

// (no OHLC function here)

/**
 * Get simple price for multiple coins
 * @param coinIds - Array of coin IDs
 * @param vsCurrency - Currency to compare
 */
export const getSimplePrices = async (
  coinIds: string[],
  vsCurrency = 'usd'
): Promise<Record<string, { [key: string]: number }>> => {
  try {
    const response = await axiosInstance.get('/simple/price', {
      params: {
        ids: coinIds.join(','),
        vs_currencies: vsCurrency,
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching simple prices from CoinGecko:', error);
    throw new Error('Failed to fetch cryptocurrency prices');
  }
};

/**
 * Search for cryptocurrencies
 * @param query - Search query
 */
export const searchCoins = async (query: string): Promise<any> => {
  try {
    const response = await axiosInstance.get('/search', {
      params: { query },
    });

    return response.data.coins;
  } catch (error) {
    console.error('Error searching coins on CoinGecko:', error);
    throw new Error('Failed to search cryptocurrencies');
  }
};

/**
 * Get trending coins
 */
export const getTrendingCoins = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/search/trending');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching trending coins from CoinGecko:', error);
    throw new Error('Failed to fetch trending cryptocurrencies');
  }
};

/**
 * Get OHLC data for a coin
 * @param coinId - CoinGecko coin ID
 * @param vsCurrency - Currency to compare
 * @param days - Number of days
 */
export const getOHLC = async (
  coinId: string,
  vsCurrency = 'usd',
  days = 30
): Promise<CoinGeckoOHLC[]> => {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}/ohlc`, {
      params: {
        vs_currency: vsCurrency,
        days,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching OHLC data for ${coinId}:`, error);
    throw new Error(`Failed to fetch OHLC data for ${coinId}`);
  }
};
