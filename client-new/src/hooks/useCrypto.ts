import { useQuery } from '@tanstack/react-query';
import {
  getCryptoMarkets,
  getCryptoDetail,
  convertToChartData,
  getTrendingCryptos,
  getSimplePrices,
} from '../services/coinGeckoAPI';

/**
 * Hook to fetch crypto markets list
 */
export const useCryptoMarkets = (currency: string = 'usd', perPage: number = 50) => {
  return useQuery({
    queryKey: ['cryptoMarkets', currency, perPage],
    queryFn: () => getCryptoMarkets(currency, perPage, 1),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};

/**
 * Hook to fetch crypto detail
 */
export const useCryptoDetail = (id: string) => {
  return useQuery({
    queryKey: ['cryptoDetail', id],
    queryFn: () => getCryptoDetail(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch crypto chart data
 */
export const useCryptoChart = (id: string, days: number = 30) => {
  return useQuery({
    queryKey: ['cryptoChart', id, days],
    queryFn: () => convertToChartData(id, days),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch trending cryptos
 */
export const useTrendingCryptos = () => {
  return useQuery({
    queryKey: ['trendingCryptos'],
    queryFn: getTrendingCryptos,
    staleTime: 300000, // 5 minutes
  });
};

/**
 * Hook to fetch simple prices for multiple coins
 */
export const useSimplePrices = (ids: string[], currencies: string[] = ['usd']) => {
  return useQuery({
    queryKey: ['simplePrices', ids, currencies],
    queryFn: () => getSimplePrices(ids, currencies),
    enabled: ids.length > 0,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider stale after 15 seconds
  });
};

/**
 * Hook to fetch real-time price for a single crypto
 */
export const useCryptoPrice = (id: string, currency: string = 'usd') => {
  return useQuery({
    queryKey: ['cryptoPrice', id, currency],
    queryFn: async () => {
      const prices = await getSimplePrices([id], [currency]);
      return prices[id]?.[currency] || null;
    },
    enabled: !!id,
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000, // Consider stale after 5 seconds
  });
};
