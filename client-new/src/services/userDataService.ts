// Mock user data for portfolio/watchlist/history
export interface PortfolioPosition {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  timestamp: string;
}

export interface WatchItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export interface UserDashboardData {
  balance: number;
  portfolioValue: number;
  pnl: number;
  pnlPercent: number;
  positions: PortfolioPosition[];
  transactions: Transaction[];
  watchlist: WatchItem[];
  indices: { label: string; value: number; change: number }[];
  crypto: { symbol: string; price: number; change: number }[];
}

export const getUserDashboardData = (): UserDashboardData => ({
  balance: 52000,
  portfolioValue: 128000,
  pnl: 8200,
  pnlPercent: 6.8,
  positions: [
    { id: '1', symbol: 'ATW', name: 'Attijariwafa Bank', quantity: 120, avgPrice: 470, currentPrice: 486.5 },
    { id: '2', symbol: 'BCP', name: 'BCP', quantity: 80, avgPrice: 255, currentPrice: 266 },
    { id: '3', symbol: 'BTC', name: 'Bitcoin', quantity: 0.4, avgPrice: 58000, currentPrice: 62750 },
  ],
  transactions: [
    { id: 't1', type: 'BUY', symbol: 'ATW', name: 'Attijariwafa Bank', quantity: 50, price: 472, timestamp: new Date().toISOString() },
    { id: 't2', type: 'SELL', symbol: 'IAM', name: 'Maroc Telecom', quantity: 30, price: 126, timestamp: new Date().toISOString() },
    { id: 't3', type: 'BUY', symbol: 'BTC', name: 'Bitcoin', quantity: 0.2, price: 61000, timestamp: new Date().toISOString() },
  ],
  watchlist: [
    { symbol: 'CIH', name: 'CIH Bank', price: 315.2, change: -0.88 },
    { symbol: 'ADH', name: 'Addoha', price: 13.4, change: 2.12 },
    { symbol: 'ETH', name: 'Ethereum', price: 3360, change: 1.25 },
  ],
  indices: [
    { label: 'MASI', value: 12845.67, change: 0.35 },
    { label: 'MADEX', value: 10456.89, change: 0.31 },
  ],
  crypto: [
    { symbol: 'BTC', price: 62750, change: 0.8 },
    { symbol: 'ETH', price: 3360, change: 1.25 },
  ],
});
