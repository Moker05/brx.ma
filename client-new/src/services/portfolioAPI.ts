import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Position {
  id: string;
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO' | 'OPCVM';
  market: 'BVC' | 'CRYPTO' | 'OTHER';
  quantity: number;
  avgPurchasePrice: number;
  totalInvested: number;
  purchaseDate: string;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  name?: string;
  notes?: string;
  lastUpdated?: string;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO' | 'OPCVM';
  market: 'BVC' | 'CRYPTO' | 'OTHER';
  quantity: number;
  price: number;
  totalAmount: number;
  fee: number;
  purchaseDate?: string;
  sellPrice?: number;
  realizedPnL?: number;
  notes?: string;
  timestamp: string;
}

export interface PortfolioStats {
  totalInvested: number;
  totalCurrentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  availableBalance: number;
  totalValue: number;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  positions: Position[];
  transactions: Transaction[];
  portfolio: PortfolioStats;
}

export interface PortfolioSnapshot {
  id: string;
  walletId: string;
  totalValue: number;
  availableBalance: number;
  investedValue: number;
  profitLoss: number;
  profitLossPercent: number;
  timestamp: string;
}

export interface AddPositionRequest {
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO' | 'OPCVM';
  market?: 'BVC' | 'CRYPTO' | 'OTHER';
  quantity: number;
  purchasePrice: number;
  purchaseDate?: string;
  name?: string;
  notes?: string;
}

export interface UpdatePositionRequest {
  quantity?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  name?: string;
  notes?: string;
}

// Get wallet with positions and transactions
export const getWallet = async (userId: string = 'demo-user-001'): Promise<Wallet> => {
  const response = await axios.get(`${API_URL}/portfolio/wallet/${userId}`);
  return response.data;
};

// Add a new position
export const addPosition = async (
  userId: string = 'demo-user-001',
  position: AddPositionRequest
): Promise<Position> => {
  const response = await axios.post(`${API_URL}/portfolio/positions/${userId}`, position);
  return response.data;
};

// Update a position
export const updatePosition = async (
  positionId: string,
  updates: UpdatePositionRequest
): Promise<Position> => {
  const response = await axios.put(`${API_URL}/portfolio/positions/${positionId}`, updates);
  return response.data;
};

// Delete a position
export const deletePosition = async (positionId: string): Promise<void> => {
  await axios.delete(`${API_URL}/portfolio/positions/${positionId}`);
};

// Execute buy order
export const executeBuyOrder = async (
  userId: string = 'demo-user-001',
  order: {
    symbol: string;
    assetType: 'STOCK' | 'CRYPTO' | 'OPCVM';
    market?: 'BVC' | 'CRYPTO' | 'OTHER';
    quantity: number;
    price: number;
    notes?: string;
  }
): Promise<{ success: boolean; message: string; transaction: Transaction }> => {
  const response = await axios.post(`${API_URL}/portfolio/buy/${userId}`, order);
  return response.data;
};

// Execute sell order
export const executeSellOrder = async (
  userId: string = 'demo-user-001',
  order: {
    symbol: string;
    assetType: 'STOCK' | 'CRYPTO' | 'OPCVM';
    quantity: number;
    price: number;
    notes?: string;
  }
): Promise<{ success: boolean; message: string; transaction: Transaction; realizedPnL: number }> => {
  const response = await axios.post(`${API_URL}/portfolio/sell/${userId}`, order);
  return response.data;
};

// Get portfolio history for charts
export const getPortfolioHistory = async (
  userId: string = 'demo-user-001',
  period: '1W' | '1M' | '1Y' | 'MAX' = '1M'
): Promise<PortfolioSnapshot[]> => {
  const response = await axios.get(`${API_URL}/portfolio/history/${userId}`, {
    params: { period },
  });
  return response.data;
};

// Create a portfolio snapshot
export const createPortfolioSnapshot = async (
  userId: string = 'demo-user-001'
): Promise<PortfolioSnapshot> => {
  const response = await axios.post(`${API_URL}/portfolio/snapshot/${userId}`);
  return response.data;
};

// Reset wallet
export const resetWallet = async (userId: string = 'demo-user-001'): Promise<void> => {
  await axios.post(`${API_URL}/portfolio/wallet/${userId}/reset`);
};

// Update position prices
export const updatePositionPrices = async (
  userId: string = 'demo-user-001'
): Promise<{ message: string; positions: Position[] }> => {
  const response = await axios.post(`${API_URL}/prices/update/${userId}`);
  return response.data;
};
