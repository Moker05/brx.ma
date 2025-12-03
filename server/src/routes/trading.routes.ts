import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { z } from 'zod';

const router = Router();

// Validation schemas
const buySchema = z.object({
  userId: z.string().uuid(),
  symbol: z.string().min(1),
  assetType: z.enum(['STOCK', 'CRYPTO', 'OPCVM', 'INDEX']),
  market: z.enum(['BVC', 'CRYPTO', 'OTHER']),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

const sellSchema = z.object({
  userId: z.string().uuid(),
  symbol: z.string().min(1),
  assetType: z.enum(['STOCK', 'CRYPTO', 'OPCVM', 'INDEX']),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

// GET /api/trading/wallet/:userId - Get user's virtual wallet with positions
router.get('/wallet/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get or create wallet
    let wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
      include: {
        positions: true,
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 10, // Last 10 transactions
        },
      },
    });

    // If wallet doesn't exist, create one with initial balance
    if (!wallet) {
      wallet = await prisma.virtualWallet.create({
        data: {
          userId,
          balance: 100000, // Initial balance: 100,000 MAD
          currency: 'MAD',
        },
        include: {
          positions: true,
          transactions: true,
        },
      });
    }

    // Calculate total portfolio value
    const totalInvested = wallet.positions.reduce((sum, pos) => sum + pos.totalInvested, 0);
    const totalCurrentValue = wallet.positions.reduce((sum, pos) => sum + (pos.currentValue || 0), 0);
    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    res.json({
      success: true,
      data: {
        ...wallet,
        portfolio: {
          totalInvested,
          totalCurrentValue,
          totalProfitLoss,
          totalProfitLossPercent,
          availableBalance: wallet.balance,
          totalValue: wallet.balance + totalCurrentValue,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ success: false, message: 'Error fetching wallet' });
  }
});

// POST /api/trading/buy - Execute buy order
router.post('/buy', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = buySchema.parse(req.body);
    const { userId, symbol, assetType, market, quantity, price } = validatedData;

    const totalAmount = quantity * price;
    const fee = totalAmount * 0.005; // 0.5% transaction fee
    const totalCost = totalAmount + fee;

    // Get or create wallet
    let wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await prisma.virtualWallet.create({
        data: { userId, balance: 100000, currency: 'MAD' },
      });
    }

    // Check if user has enough balance
    if (wallet.balance < totalCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Required: ${totalCost.toFixed(2)} MAD, Available: ${wallet.balance.toFixed(2)} MAD`,
      });
    }

    // Execute transaction in Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet!.id,
          type: 'BUY',
          symbol,
          assetType,
          market,
          quantity,
          price,
          totalAmount,
          fee,
        },
      });

      // Update or create position
      const existingPosition = await tx.position.findUnique({
        where: {
          walletId_symbol_assetType: {
            walletId: wallet!.id,
            symbol,
            assetType,
          },
        },
      });

      let position;
      if (existingPosition) {
        // Update existing position (calculate new average price)
        const newQuantity = existingPosition.quantity + quantity;
        const newTotalInvested = existingPosition.totalInvested + totalAmount;
        const newAvgPrice = newTotalInvested / newQuantity;

        position = await tx.position.update({
          where: { id: existingPosition.id },
          data: {
            quantity: newQuantity,
            avgPurchasePrice: newAvgPrice,
            totalInvested: newTotalInvested,
            currentPrice: price,
            currentValue: newQuantity * price,
            profitLoss: (newQuantity * price) - newTotalInvested,
            profitLossPercent: ((newQuantity * price - newTotalInvested) / newTotalInvested) * 100,
            lastUpdated: new Date(),
          },
        });
      } else {
        // Create new position
        position = await tx.position.create({
          data: {
            walletId: wallet!.id,
            symbol,
            assetType,
            market,
            quantity,
            avgPurchasePrice: price,
            totalInvested: totalAmount,
            currentPrice: price,
            currentValue: totalAmount,
            profitLoss: 0,
            profitLossPercent: 0,
            lastUpdated: new Date(),
          },
        });
      }

      // Deduct balance
      const updatedWallet = await tx.virtualWallet.update({
        where: { id: wallet!.id },
        data: { balance: wallet!.balance - totalCost },
      });

      return { transaction, position, wallet: updatedWallet };
    });

    res.json({
      success: true,
      message: `Successfully bought ${quantity} ${symbol}`,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Invalid request data', errors: error.errors });
    }
    console.error('Error executing buy order:', error);
    res.status(500).json({ success: false, message: 'Error executing buy order' });
  }
});

// POST /api/trading/sell - Execute sell order
router.post('/sell', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = sellSchema.parse(req.body);
    const { userId, symbol, assetType, quantity, price } = validatedData;

    const totalAmount = quantity * price;
    const fee = totalAmount * 0.005; // 0.5% transaction fee
    const totalReceived = totalAmount - fee;

    // Get wallet
    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    // Get position
    const position = await prisma.position.findUnique({
      where: {
        walletId_symbol_assetType: {
          walletId: wallet.id,
          symbol,
          assetType,
        },
      },
    });

    if (!position) {
      return res.status(404).json({ success: false, message: `No position found for ${symbol}` });
    }

    // Check if user has enough quantity
    if (position.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Required: ${quantity}, Available: ${position.quantity}`,
      });
    }

    // Execute transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'SELL',
          symbol,
          assetType,
          market: position.market,
          quantity,
          price,
          totalAmount,
          fee,
        },
      });

      let updatedPosition;
      const remainingQuantity = position.quantity - quantity;

      if (remainingQuantity === 0) {
        // Close position entirely
        await tx.position.delete({
          where: { id: position.id },
        });
        updatedPosition = null;
      } else {
        // Update position
        const newTotalInvested = (position.totalInvested / position.quantity) * remainingQuantity;

        updatedPosition = await tx.position.update({
          where: { id: position.id },
          data: {
            quantity: remainingQuantity,
            totalInvested: newTotalInvested,
            currentPrice: price,
            currentValue: remainingQuantity * price,
            profitLoss: (remainingQuantity * price) - newTotalInvested,
            profitLossPercent: ((remainingQuantity * price - newTotalInvested) / newTotalInvested) * 100,
            lastUpdated: new Date(),
          },
        });
      }

      // Add to balance
      const updatedWallet = await tx.virtualWallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance + totalReceived },
      });

      return { transaction, position: updatedPosition, wallet: updatedWallet };
    });

    res.json({
      success: true,
      message: `Successfully sold ${quantity} ${symbol}`,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Invalid request data', errors: error.errors });
    }
    console.error('Error executing sell order:', error);
    res.status(500).json({ success: false, message: 'Error executing sell order' });
  }
});

// GET /api/trading/transactions/:userId - Get transaction history
router.get('/transactions/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = '50', offset = '0' } = req.query;

    const wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const totalCount = await prisma.transaction.count({
      where: { walletId: wallet.id },
    });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: totalCount,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
});

export default router;
