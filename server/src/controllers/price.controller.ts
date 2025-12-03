import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { updatePositionPrices } from '../services/priceService';
import { AssetType, Market } from '@prisma/client';

/**
 * Update all positions with current market prices
 */
export const updateAllPositionPrices = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || 'demo-user-001';

    let wallet = await prisma.virtualWallet.findUnique({
      where: { userId },
      include: {
        positions: true,
      },
    });

    if (!wallet) {
      // Seed a demo wallet with quelques positions pour les tests
      wallet = await prisma.virtualWallet.create({
        data: {
          userId,
          balance: 50000,
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
        },
        include: {
          positions: true,
        },
      });
    }

    // Update prices
    const updatedPositions = await updatePositionPrices(wallet.positions);

    // Save updated positions to database
    await Promise.all(
      updatedPositions.map((pos) =>
        prisma.position.update({
          where: { id: pos.id },
          data: {
            currentPrice: pos.currentPrice,
            currentValue: pos.currentValue,
            profitLoss: pos.profitLoss,
            profitLossPercent: pos.profitLossPercent,
            lastUpdated: pos.lastUpdated,
          },
        })
      )
    );

    res.json({
      message: 'Prices updated successfully',
      positions: updatedPositions,
    });
  } catch (error) {
    console.error('Error updating position prices:', error);
    res.status(500).json({ error: 'Failed to update position prices' });
  }
};
