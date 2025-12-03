// Types for Bourse de Casablanca data

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
  timestamp: Date;
}

export interface BVCIndex {
  name: string;
  code: string; // MASI, MADEX, MSI20, etc.
  value: number;
  change: number;
  changePercent: number;
  timestamp: Date;
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
  timestamp: Date;
}

export interface BVCStockHistory {
  symbol: string;
  data: Array<{
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface BVCSectorPerformance {
  sector: string;
  performance: number;
  volume: number;
  stocks: number;
}
