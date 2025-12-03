import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BVCStock {
  symbol: string;
  name: string;
  sector?: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
  timestamp: string;
}

export interface BVCIndex {
  name: string;
  code: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface BVCMarketSummary {
  indices: BVCIndex[];
  topGainers: BVCStock[];
  topLosers: BVCStock[];
  mostActive: BVCStock[];
  totalVolume: number;
  advancers: number;
  decliners: number;
  unchanged: number;
  timestamp: string;
}

export interface BVCSectorPerformance {
  sector: string;
  performance: number;
  volume: number;
  stocks: number;
}

// Get all BVC stocks
export const getBVCStocks = async (): Promise<BVCStock[]> => {
  const response = await axios.get(`${API_URL}/bvc/stocks`);
  return response.data.data;
};

// Get a specific stock by symbol
export const getBVCStock = async (symbol: string): Promise<BVCStock> => {
  const response = await axios.get(`${API_URL}/bvc/stocks/${symbol}`);
  return response.data.data;
};

// Get BVC indices
export const getBVCIndices = async (): Promise<BVCIndex[]> => {
  const response = await axios.get(`${API_URL}/bvc/indices`);
  return response.data.data;
};

// Get market summary
export const getBVCMarketSummary = async (): Promise<BVCMarketSummary> => {
  const response = await axios.get(`${API_URL}/bvc/market-summary`);
  return response.data.data;
};

// Get sector performance
export const getBVCSectorPerformance = async (): Promise<BVCSectorPerformance[]> => {
  const response = await axios.get(`${API_URL}/bvc/sectors`);
  return response.data.data;
};

// Clear cache (admin)
export const clearBVCCache = async (): Promise<void> => {
  await axios.post(`${API_URL}/bvc/cache/clear`);
};
