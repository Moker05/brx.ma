import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { AssetType, Market, TransactionType } from '@prisma/client';

// Get user's virtual wallet with positions and transactions
export const getWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001'; // TODO: Get from auth

    let wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
      include: {
        positions: {
          orderBy: { createdAt: 'desc' },
        },
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 100, // Limit to last 100 transactions
        },
      },
    });

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await prisma.virtualWallet.create({
        data: {
          userId,
          balance: 50000, // solde fictif après achats démo
          currency: 'MAD',
          positions: {
            create: [
              {
                symbol: 'BTC',
                assetType: AssetType.CRYPTO,
                market: Market.CRYPTO,
                quantity: 0.1,
                avgPurchasePrice: 300000,
                totalInvested: 30000,
                purchaseDate: new Date('2024-08-15'),
                name: 'Bitcoin',
              },
              {
                symbol: 'ETH',
                assetType: AssetType.CRYPTO,
                market: Market.CRYPTO,
                quantity: 1,
                avgPurchasePrice: 18000,
                totalInvested: 18000,
                purchaseDate: new Date('2024-09-10'),
                name: 'Ethereum',
              },
              {
                symbol: 'ATW',
                assetType: AssetType.STOCK,
                market: Market.BVC,
                quantity: 100,
                avgPurchasePrice: 510,
                totalInvested: 51000,
                purchaseDate: new Date('2024-07-01'),
                name: 'Attijariwafa Bank',
              },
            ],
          },
          transactions: {
            create: [
              {
                type: TransactionType.BUY,
                symbol: 'BTC',
                assetType: AssetType.CRYPTO,
                market: Market.CRYPTO,
                quantity: 0.1,
                price: 300000,
                totalAmount: 30000,
                fee: 150,
                purchaseDate: new Date('2024-08-15'),
                notes: 'Achat de démonstration',
              },
              {
                type: TransactionType.BUY,
                symbol: 'ETH',
                assetType: AssetType.CRYPTO,
                market: Market.CRYPTO,
                quantity: 1,
                price: 18000,
                totalAmount: 18000,
                fee: 90,
                purchaseDate: new Date('2024-09-10'),
                notes: 'Achat de démonstration',
              },
              {
                type: TransactionType.BUY,
                symbol: 'ATW',
                assetType: AssetType.STOCK,
                market: Market.BVC,
                quantity: 100,
                price: 510,
                totalAmount: 51000,
                fee: 255,
                purchaseDate: new Date('2024-07-01'),
                notes: 'Achat de démonstration',
              },
            ],
          },
        },
        include: {
          positions: true,
          transactions: {
            orderBy: { timestamp: 'desc' },
            take: 100,
          },
        },
      });
    }

    // Calculate portfolio stats
    const portfolioStats = calculatePortfolioStats(wallet);

    res.json({
      ...wallet,
      portfolio: portfolioStats,
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({ error: 'Failed to get wallet' });
  }
};

// Add or update a position manually (creates transaction and deducts balance)
export const addPosition = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';
    const { symbol, assetType, market, quantity, purchasePrice, purchaseDate, name, notes } = req.body;

    // Validate input
    if (!symbol || !assetType || !quantity || !purchasePrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get or create wallet
    let wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.virtualWallet.create({
        data: {
          userId,
          balance: 100000,
          currency: 'MAD',
        },
      });
    }

    const totalAmount = quantity * purchasePrice;
    const fee = totalAmount * 0.005; // 0.5% fee
    const totalCost = totalAmount + fee;

    // Check balance
    if (wallet.balance < totalCost) {
      return res.status(400).json({
        error: `Solde insuffisant. Requis: ${totalCost.toFixed(2)} MAD, Disponible: ${wallet.balance.toFixed(2)} MAD`,
      });
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.BUY,
        symbol,
        assetType: assetType as AssetType,
        market: (market as Market) || Market.CRYPTO,
        quantity,
        price: purchasePrice,
        totalAmount,
        fee,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        notes: notes || 'Ajout manuel de position',
      },
    });

    // Check if position already exists
    const existingPosition = await prisma.position.findUnique({
      where: {
        walletId_symbol_assetType: {
          walletId: wallet.id,
          symbol,
          assetType,
        },
      },
    });

    let position;

    if (existingPosition) {
      // Update existing position (average price)
      const newQuantity = existingPosition.quantity + quantity;
      const newTotalInvested = existingPosition.totalInvested + totalAmount;
      const newAvgPrice = newTotalInvested / newQuantity;

      position = await prisma.position.update({
        where: { id: existingPosition.id },
        data: {
          quantity: newQuantity,
          avgPurchasePrice: newAvgPrice,
          totalInvested: newTotalInvested,
          currentPrice: purchasePrice,
          currentValue: newQuantity * purchasePrice,
          name: name || existingPosition.name,
          notes: notes || existingPosition.notes,
        },
      });
    } else {
      // Create new position
      position = await prisma.position.create({
        data: {
          walletId: wallet.id,
          symbol,
          assetType: assetType as AssetType,
          market: (market as Market) || Market.CRYPTO,
          quantity,
          avgPurchasePrice: purchasePrice,
          totalInvested: totalAmount,
          currentPrice: purchasePrice,
          currentValue: totalAmount,
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          name,
          notes,
        },
      });
    }

    // Deduct balance
    await prisma.virtualWallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance - totalCost,
      },
    });

    // Create automatic snapshot after position added
    await createSnapshotAfterTransaction(userId);

    res.json({
      success: true,
      message: `Position ajoutée: ${quantity} ${symbol} à ${purchasePrice.toFixed(2)} MAD`,
      position,
    });
  } catch (error) {
    console.error('Error adding position:', error);
    res.status(500).json({ error: 'Failed to add position' });
  }
};

// Update a position
export const updatePosition = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;
    const { quantity, purchasePrice, purchaseDate, name, notes } = req.body;

    const position = await prisma.position.findUnique({
      where: { id: positionId },
    });

    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    const updateData: any = {};

    if (quantity !== undefined) {
      updateData.quantity = quantity;
      updateData.totalInvested = quantity * (purchasePrice || position.avgPurchasePrice);
    }

    if (purchasePrice !== undefined) {
      updateData.avgPurchasePrice = purchasePrice;
      updateData.totalInvested = (quantity || position.quantity) * purchasePrice;
    }

    if (purchaseDate) updateData.purchaseDate = new Date(purchaseDate);
    if (name !== undefined) updateData.name = name;
    if (notes !== undefined) updateData.notes = notes;

    const updatedPosition = await prisma.position.update({
      where: { id: positionId },
      data: updateData,
    });

    res.json(updatedPosition);
  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({ error: 'Failed to update position' });
  }
};

// Delete a position
export const deletePosition = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;

    await prisma.position.delete({
      where: { id: positionId },
    });

    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error deleting position:', error);
    res.status(500).json({ error: 'Failed to delete position' });
  }
};

// Execute buy order
export const executeBuyOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';
    const { symbol, assetType, market, quantity, price, notes } = req.body;

    if (!symbol || !assetType || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get wallet
    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const totalAmount = quantity * price;
    const fee = totalAmount * 0.005; // 0.5% fee
    const totalCost = totalAmount + fee;

    // Check balance
    if (wallet.balance < totalCost) {
      return res.status(400).json({
        error: `Insufficient balance. Required: ${totalCost.toFixed(2)} MAD, Available: ${wallet.balance.toFixed(2)} MAD`,
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.BUY,
        symbol,
        assetType: assetType as AssetType,
        market: market as Market || Market.CRYPTO,
        quantity,
        price,
        totalAmount,
        fee,
        purchaseDate: new Date(),
        notes,
      },
    });

    // Update or create position
    const existingPosition = await prisma.position.findUnique({
      where: {
        walletId_symbol_assetType: {
          walletId: wallet.id,
          symbol,
          assetType: assetType as AssetType,
        },
      },
    });

    if (existingPosition) {
      const newQuantity = existingPosition.quantity + quantity;
      const newTotalInvested = existingPosition.totalInvested + totalAmount;
      const newAvgPrice = newTotalInvested / newQuantity;

      await prisma.position.update({
        where: { id: existingPosition.id },
        data: {
          quantity: newQuantity,
          avgPurchasePrice: newAvgPrice,
          totalInvested: newTotalInvested,
          currentPrice: price,
          currentValue: newQuantity * price,
        },
      });
    } else {
      await prisma.position.create({
        data: {
          walletId: wallet.id,
          symbol,
          assetType: assetType as AssetType,
          market: market as Market || Market.CRYPTO,
          quantity,
          avgPurchasePrice: price,
          totalInvested: totalAmount,
          currentPrice: price,
          currentValue: totalAmount,
        },
      });
    }

    // Deduct balance
    await prisma.virtualWallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance - totalCost,
      },
    });

    // Create automatic snapshot after transaction
    await createSnapshotAfterTransaction(userId);

    res.json({
      success: true,
      message: `Buy order executed: ${quantity} ${symbol} at ${price.toFixed(2)} MAD`,
      transaction,
    });
  } catch (error) {
    console.error('Error executing buy order:', error);
    res.status(500).json({ error: 'Failed to execute buy order' });
  }
};

// Execute sell order
export const executeSellOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';
    const { symbol, assetType, quantity, price, notes } = req.body;

    if (!symbol || !assetType || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get wallet
    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Find position
    const position = await prisma.position.findUnique({
      where: {
        walletId_symbol_assetType: {
          walletId: wallet.id,
          symbol,
          assetType: assetType as AssetType,
        },
      },
    });

    if (!position) {
      return res.status(404).json({ error: `No position found for ${symbol}` });
    }

    if (position.quantity < quantity) {
      return res.status(400).json({
        error: `Insufficient quantity. Required: ${quantity}, Available: ${position.quantity}`,
      });
    }

    const totalAmount = quantity * price;
    const fee = totalAmount * 0.005; // 0.5% fee
    const totalReceived = totalAmount - fee;

    // Calculate realized PnL
    const costBasis = (position.totalInvested / position.quantity) * quantity;
    const realizedPnL = totalAmount - costBasis - fee;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: TransactionType.SELL,
        symbol,
        assetType: assetType as AssetType,
        market: position.market,
        quantity,
        price,
        totalAmount,
        fee,
        sellPrice: price,
        realizedPnL,
        notes,
      },
    });

    // Update position
    const remainingQuantity = position.quantity - quantity;

    if (remainingQuantity === 0) {
      // Delete position
      await prisma.position.delete({
        where: { id: position.id },
      });
    } else {
      const newTotalInvested = (position.totalInvested / position.quantity) * remainingQuantity;
      await prisma.position.update({
        where: { id: position.id },
        data: {
          quantity: remainingQuantity,
          totalInvested: newTotalInvested,
          currentPrice: price,
          currentValue: remainingQuantity * price,
        },
      });
    }

    // Add to balance
    await prisma.virtualWallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + totalReceived,
      },
    });

    // Create automatic snapshot after transaction
    await createSnapshotAfterTransaction(userId);

    res.json({
      success: true,
      message: `Sell order executed: ${quantity} ${symbol} at ${price.toFixed(2)} MAD`,
      transaction,
      realizedPnL,
    });
  } catch (error) {
    console.error('Error executing sell order:', error);
    res.status(500).json({ error: 'Failed to execute sell order' });
  }
};

// Get portfolio history (for chart)
export const getPortfolioHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';
    const { period = '1M' } = req.query; // 1W, 1M, 1Y, MAX

    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'MAX':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Get snapshots
    const snapshots = await prisma.portfolioSnapshot.findMany({
      where: {
        walletId: wallet.id,
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    res.json(snapshots);
  } catch (error) {
    console.error('Error getting portfolio history:', error);
    res.status(500).json({ error: 'Failed to get portfolio history' });
  }
};

// Create portfolio snapshot (called periodically or after transactions)
export const createPortfolioSnapshot = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';

    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
      include: {
        positions: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const portfolioStats = calculatePortfolioStats(wallet);

    const snapshot = await prisma.portfolioSnapshot.create({
      data: {
        walletId: wallet.id,
        totalValue: portfolioStats.totalValue,
        availableBalance: portfolioStats.availableBalance,
        investedValue: portfolioStats.totalInvested,
        profitLoss: portfolioStats.totalProfitLoss,
        profitLossPercent: portfolioStats.totalProfitLossPercent,
      },
    });

    res.json(snapshot);
  } catch (error) {
    console.error('Error creating portfolio snapshot:', error);
    res.status(500).json({ error: 'Failed to create portfolio snapshot' });
  }
};

// Reset wallet (for testing)
export const resetWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';

    // Delete all positions, transactions, and snapshots
    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (wallet) {
      await prisma.position.deleteMany({
        where: { walletId: wallet.id },
      });

      await prisma.transaction.deleteMany({
        where: { walletId: wallet.id },
      });

      await prisma.portfolioSnapshot.deleteMany({
        where: { walletId: wallet.id },
      });

      // Reset balance
      await prisma.virtualWallet.update({
        where: { id: wallet.id },
        data: {
          balance: 100000,
        },
      });
    }

    res.json({ message: 'Wallet reset successfully' });
  } catch (error) {
    console.error('Error resetting wallet:', error);
    res.status(500).json({ error: 'Failed to reset wallet' });
  }
};

// Helper function to automatically create snapshot after transaction
async function createSnapshotAfterTransaction(userId: string) {
  try {
    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
      include: { positions: true },
    });

    if (wallet) {
      const portfolioStats = calculatePortfolioStats(wallet);
      await prisma.portfolioSnapshot.create({
        data: {
          walletId: wallet.id,
          totalValue: portfolioStats.totalValue,
          availableBalance: portfolioStats.availableBalance,
          investedValue: portfolioStats.totalInvested,
          profitLoss: portfolioStats.totalProfitLoss,
          profitLossPercent: portfolioStats.totalProfitLossPercent,
        },
      });
    }
  } catch (error) {
    console.error('Error creating automatic snapshot:', error);
    // Don't throw - snapshots are not critical
  }
}

// Helper function to calculate portfolio statistics
function calculatePortfolioStats(wallet: any) {
  let totalInvested = 0;
  let totalCurrentValue = 0;

  if (wallet.positions) {
    wallet.positions.forEach((pos: any) => {
      totalInvested += pos.totalInvested;
      totalCurrentValue += pos.currentValue || pos.totalInvested;
    });
  }

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
}
