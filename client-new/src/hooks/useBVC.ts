import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BVCStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  revenue: number;
}

export function useBVCMarkets() {
  return useQuery<BVCStock[]>({
    queryKey: ['bvc-markets'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/bvc/markets`);
      return response.data.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
  });
}

export function useBVCIndices() {
  return useQuery({
    queryKey: ['bvc-indices'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/bvc/indices`);
      return response.data.data;
    },
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useBVCTopMovers() {
  return useQuery({
    queryKey: ['bvc-top-movers'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/bvc/top-movers`);
      return response.data.data;
    },
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}

export function useBVCSectors() {
  return useQuery({
    queryKey: ['bvc-sectors'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/bvc/sectors`);
      return response.data.data;
    },
    staleTime: 15 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });
}
