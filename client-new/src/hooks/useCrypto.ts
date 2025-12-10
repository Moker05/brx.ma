import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CryptoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  last_updated: string;
}

interface CryptoMarketsResponse {
  success: boolean;
  data: CryptoMarketData[];
}

export function useCryptoMarkets(limit = 250, page = 1) {
  return useQuery<CryptoMarketData[]>({
    queryKey: ['crypto-markets', limit, page],
    queryFn: async () => {
      const response = await axios.get<CryptoMarketsResponse>(`${API_BASE_URL}/crypto/markets`, {
        params: { limit, page, currency: 'usd' },
      });
      return response.data.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

export function useCryptoSearch(query: string) {
  return useQuery({
    queryKey: ['crypto-search', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) return [];
      const response = await axios.get(`${API_BASE_URL}/crypto/search`, { params: { q: query } });
      return response.data.data;
    },
    enabled: query.trim().length >= 2,
    staleTime: 60000,
  });
}

export function useCryptoPrices(coinIds: string[]) {
  return useQuery({
    queryKey: ['crypto-prices', coinIds],
    queryFn: async () => {
      if (coinIds.length === 0) return {};
      const response = await axios.get(`${API_BASE_URL}/crypto/prices`, {
        params: { ids: coinIds.join(','), currency: 'usd' },
      });
      return response.data.data;
    },
    enabled: coinIds.length > 0,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
