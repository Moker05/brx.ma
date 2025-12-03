// Trading Service - Mock implementation for MVP
// Will be connected to real API later

export interface VirtualWallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  positions: Position[];
  transactions: Transaction[];
  portfolio: PortfolioStats;
}

export interface Position {
  id: string;
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO';
  market: 'BVC' | 'CRYPTO';
  quantity: number;
  avgPurchasePrice: number;
  totalInvested: number;
  currentPrice?: number;
  currentValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  lastUpdated?: string;
}

export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO';
  market: 'BVC' | 'CRYPTO';
  quantity: number;
  price: number;
  totalAmount: number;
  fee: number;
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

export interface BuyOrderRequest {
  userId: string;
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO';
  market: 'BVC' | 'CRYPTO';
  quantity: number;
  price: number;
}

export interface SellOrderRequest {
  userId: string;
  symbol: string;
  assetType: 'STOCK' | 'CRYPTO';
  quantity: number;
  price: number;
}

// Mock storage using localStorage
const STORAGE_KEY = 'brx_virtual_wallet';
const MOCK_USER_ID = 'demo-user-001';

// Initialize mock wallet
const initializeMockWallet = (): VirtualWallet => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const wallet: VirtualWallet = {
    id: 'wallet-001',
    userId: MOCK_USER_ID,
    balance: 100000, // Initial balance: 100,000 MAD
    currency: 'MAD',
    positions: [],
    transactions: [],
    portfolio: {
      totalInvested: 0,
      totalCurrentValue: 0,
      totalProfitLoss: 0,
      totalProfitLossPercent: 0,
      availableBalance: 100000,
      totalValue: 100000,
    },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
  return wallet;
};

// Update wallet in storage
const saveWallet = (wallet: VirtualWallet) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallet));
};

// Calculate portfolio stats
const calculatePortfolioStats = (wallet: VirtualWallet, currentPrices: Record<string, number>): PortfolioStats => {
  let totalInvested = 0;
  let totalCurrentValue = 0;

  // Update positions with current prices
  wallet.positions = wallet.positions.map((pos) => {
    const currentPrice = currentPrices[pos.symbol] || pos.avgPurchasePrice;
    const currentValue = pos.quantity * currentPrice;
    const profitLoss = currentValue - pos.totalInvested;
    const profitLossPercent = (profitLoss / pos.totalInvested) * 100;

    totalInvested += pos.totalInvested;
    totalCurrentValue += currentValue;

    return {
      ...pos,
      currentPrice,
      currentValue,
      profitLoss,
      profitLossPercent,
      lastUpdated: new Date().toISOString(),
    };
  });

  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return {
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercent,
    availableBalance: wallet.balance,
    totalValue: wallet.balance + totalCurrentValue,
  };
};

// Get wallet
export const getWallet = async (currentPrices: Record<string, number> = {}): Promise<VirtualWallet> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const wallet = initializeMockWallet();
  wallet.portfolio = calculatePortfolioStats(wallet, currentPrices);
  saveWallet(wallet);

  return wallet;
};

// Execute buy order
export const executeBuyOrder = async (order: BuyOrderRequest): Promise<{ success: boolean; message: string; wallet?: VirtualWallet }> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const wallet = initializeMockWallet();
  const totalAmount = order.quantity * order.price;
  const fee = totalAmount * 0.005; // 0.5% fee
  const totalCost = totalAmount + fee;

  // Check balance
  if (wallet.balance < totalCost) {
    return {
      success: false,
      message: `Solde insuffisant. Requis: ${totalCost.toFixed(2)} MAD, Disponible: ${wallet.balance.toFixed(2)} MAD`,
    };
  }

  // Create transaction
  const transaction: Transaction = {
    id: `tx-${Date.now()}`,
    type: 'BUY',
    symbol: order.symbol,
    assetType: order.assetType,
    market: order.market,
    quantity: order.quantity,
    price: order.price,
    totalAmount,
    fee,
    timestamp: new Date().toISOString(),
  };

  wallet.transactions.unshift(transaction);

  // Update or create position
  const existingPosIndex = wallet.positions.findIndex(
    (p) => p.symbol === order.symbol && p.assetType === order.assetType
  );

  if (existingPosIndex >= 0) {
    const pos = wallet.positions[existingPosIndex];
    const newQuantity = pos.quantity + order.quantity;
    const newTotalInvested = pos.totalInvested + totalAmount;
    const newAvgPrice = newTotalInvested / newQuantity;

    wallet.positions[existingPosIndex] = {
      ...pos,
      quantity: newQuantity,
      avgPurchasePrice: newAvgPrice,
      totalInvested: newTotalInvested,
      currentPrice: order.price,
      currentValue: newQuantity * order.price,
      profitLoss: 0,
      profitLossPercent: 0,
      lastUpdated: new Date().toISOString(),
    };
  } else {
    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      symbol: order.symbol,
      assetType: order.assetType,
      market: order.market,
      quantity: order.quantity,
      avgPurchasePrice: order.price,
      totalInvested: totalAmount,
      currentPrice: order.price,
      currentValue: totalAmount,
      profitLoss: 0,
      profitLossPercent: 0,
      lastUpdated: new Date().toISOString(),
    };
    wallet.positions.push(newPosition);
  }

  // Deduct balance
  wallet.balance -= totalCost;

  // Recalculate portfolio
  wallet.portfolio = calculatePortfolioStats(wallet, { [order.symbol]: order.price });

  saveWallet(wallet);

  return {
    success: true,
    message: `Achat réussi: ${order.quantity} ${order.symbol} à ${order.price.toFixed(2)} ${wallet.currency}`,
    wallet,
  };
};

// Execute sell order
export const executeSellOrder = async (order: SellOrderRequest): Promise<{ success: boolean; message: string; wallet?: VirtualWallet }> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const wallet = initializeMockWallet();
  const totalAmount = order.quantity * order.price;
  const fee = totalAmount * 0.005; // 0.5% fee
  const totalReceived = totalAmount - fee;

  // Find position
  const posIndex = wallet.positions.findIndex(
    (p) => p.symbol === order.symbol && p.assetType === order.assetType
  );

  if (posIndex === -1) {
    return {
      success: false,
      message: `Aucune position trouvée pour ${order.symbol}`,
    };
  }

  const position = wallet.positions[posIndex];

  // Check quantity
  if (position.quantity < order.quantity) {
    return {
      success: false,
      message: `Quantité insuffisante. Requis: ${order.quantity}, Disponible: ${position.quantity}`,
    };
  }

  // Create transaction
  const transaction: Transaction = {
    id: `tx-${Date.now()}`,
    type: 'SELL',
    symbol: order.symbol,
    assetType: order.assetType,
    market: position.market,
    quantity: order.quantity,
    price: order.price,
    totalAmount,
    fee,
    timestamp: new Date().toISOString(),
  };

  wallet.transactions.unshift(transaction);

  // Update position
  const remainingQuantity = position.quantity - order.quantity;

  if (remainingQuantity === 0) {
    // Remove position
    wallet.positions.splice(posIndex, 1);
  } else {
    const newTotalInvested = (position.totalInvested / position.quantity) * remainingQuantity;
    wallet.positions[posIndex] = {
      ...position,
      quantity: remainingQuantity,
      totalInvested: newTotalInvested,
      currentPrice: order.price,
      currentValue: remainingQuantity * order.price,
      profitLoss: (remainingQuantity * order.price) - newTotalInvested,
      profitLossPercent: ((remainingQuantity * order.price - newTotalInvested) / newTotalInvested) * 100,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Add to balance
  wallet.balance += totalReceived;

  // Recalculate portfolio
  wallet.portfolio = calculatePortfolioStats(wallet, { [order.symbol]: order.price });

  saveWallet(wallet);

  return {
    success: true,
    message: `Vente réussie: ${order.quantity} ${order.symbol} à ${order.price.toFixed(2)} ${wallet.currency}`,
    wallet,
  };
};

// Get position for a symbol
export const getPosition = (symbol: string, assetType: 'STOCK' | 'CRYPTO'): Position | undefined => {
  const wallet = initializeMockWallet();
  return wallet.positions.find((p) => p.symbol === symbol && p.assetType === assetType);
};

// Reset wallet (for testing)
export const resetWallet = () => {
  localStorage.removeItem(STORAGE_KEY);
  return initializeMockWallet();
};
