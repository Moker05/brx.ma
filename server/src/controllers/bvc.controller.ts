import { Request, Response } from 'express';
import {
  fetchBVCStocks,
  fetchBVCStock,
  fetchBVCIndices,
  fetchBVCMarketSummary,
  fetchBVCSectorPerformance,
  clearBVCCache,
  getBVCCacheStats,
} from '../services/bvcService';

/**
 * Get all BVC stocks
 * Uses cascading data sources: Casablanca Bourse → African Markets → Static data
 */
export const getAllStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stocks = await fetchBVCStocks();
    res.json({
      success: true,
      count: stocks.length,
      data: stocks,
      disclaimer: 'Données en temps réel depuis Casablanca Bourse',
    });
    return;
  } catch (error) {
    console.error('Error in getAllStocks:', error);
    res.status(500).json({ error: 'Failed to fetch BVC stocks' });
    return;
  }
};

/**
 * Get a specific stock by symbol
 */
export const getStockBySymbol = async (req: Request, res: Response): Promise<void> => {
  try {
    const { symbol } = req.params;
    const stock = await fetchBVCStock(symbol.toUpperCase());

    if (!stock) {
      res.status(404).json({ error: `Stock ${symbol} not found` });
      return;
    }

    res.json({
      success: true,
      data: stock,
      disclaimer: 'Données avec délai de 15 minutes',
    });
    return;
  } catch (error) {
    console.error('Error in getStockBySymbol:', error);
    res.status(500).json({ error: 'Failed to fetch stock' });
    return;
  }
};

/**
 * Get BVC indices (MASI, MADEX, etc.)
 */
export const getIndices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const indices = await fetchBVCIndices();
    res.json({
      success: true,
      count: indices.length,
      data: indices,
      disclaimer: 'Données avec délai de 15 minutes',
    });
    return;
  } catch (error) {
    console.error('Error in getIndices:', error);
    res.status(500).json({ error: 'Failed to fetch indices' });
    return;
  }
};

/**
 * Get market summary (top gainers, losers, most active)
 */
export const getMarketSummary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const summary = await fetchBVCMarketSummary();
    res.json({
      success: true,
      data: summary,
      disclaimer: 'Données avec délai de 15 minutes',
    });
    return;
  } catch (error) {
    console.error('Error in getMarketSummary:', error);
    res.status(500).json({ error: 'Failed to fetch market summary' });
    return;
  }
};

/**
 * Get sector performance
 */
export const getSectorPerformance = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sectors = await fetchBVCSectorPerformance();
    res.json({
      success: true,
      count: sectors.length,
      data: sectors,
    });
    return;
  } catch (error) {
    console.error('Error in getSectorPerformance:', error);
    res.status(500).json({ error: 'Failed to fetch sector performance' });
    return;
  }
};

/**
 * Clear BVC cache (admin only)
 */
export const clearCache = async (_req: Request, res: Response): Promise<void> => {
  try {
    clearBVCCache();
    res.json({
      success: true,
      message: 'BVC cache cleared successfully',
    });
    return;
  } catch (error) {
    console.error('Error in clearCache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
    return;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = getBVCCacheStats();
    res.json({
      success: true,
      data: stats,
    });
    return;
  } catch (error) {
    console.error('Error in getCacheStats:', error);
    res.status(500).json({ error: 'Failed to get cache stats' });
    return;
  }
};
