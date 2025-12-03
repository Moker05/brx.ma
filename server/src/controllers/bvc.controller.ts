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
 */
export const getAllStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await fetchBVCStocks();
    res.json({
      success: true,
      count: stocks.length,
      data: stocks,
      disclaimer: 'Données avec délai de 15 minutes',
    });
  } catch (error) {
    console.error('Error in getAllStocks:', error);
    res.status(500).json({ error: 'Failed to fetch BVC stocks' });
  }
};

/**
 * Get a specific stock by symbol
 */
export const getStockBySymbol = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stock = await fetchBVCStock(symbol.toUpperCase());

    if (!stock) {
      return res.status(404).json({ error: `Stock ${symbol} not found` });
    }

    res.json({
      success: true,
      data: stock,
      disclaimer: 'Données avec délai de 15 minutes',
    });
  } catch (error) {
    console.error('Error in getStockBySymbol:', error);
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
};

/**
 * Get BVC indices (MASI, MADEX, etc.)
 */
export const getIndices = async (req: Request, res: Response) => {
  try {
    const indices = await fetchBVCIndices();
    res.json({
      success: true,
      count: indices.length,
      data: indices,
      disclaimer: 'Données avec délai de 15 minutes',
    });
  } catch (error) {
    console.error('Error in getIndices:', error);
    res.status(500).json({ error: 'Failed to fetch indices' });
  }
};

/**
 * Get market summary (top gainers, losers, most active)
 */
export const getMarketSummary = async (req: Request, res: Response) => {
  try {
    const summary = await fetchBVCMarketSummary();
    res.json({
      success: true,
      data: summary,
      disclaimer: 'Données avec délai de 15 minutes',
    });
  } catch (error) {
    console.error('Error in getMarketSummary:', error);
    res.status(500).json({ error: 'Failed to fetch market summary' });
  }
};

/**
 * Get sector performance
 */
export const getSectorPerformance = async (req: Request, res: Response) => {
  try {
    const sectors = await fetchBVCSectorPerformance();
    res.json({
      success: true,
      count: sectors.length,
      data: sectors,
    });
  } catch (error) {
    console.error('Error in getSectorPerformance:', error);
    res.status(500).json({ error: 'Failed to fetch sector performance' });
  }
};

/**
 * Clear BVC cache (admin only)
 */
export const clearCache = async (req: Request, res: Response) => {
  try {
    clearBVCCache();
    res.json({
      success: true,
      message: 'BVC cache cleared successfully',
    });
  } catch (error) {
    console.error('Error in clearCache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (req: Request, res: Response) => {
  try {
    const stats = getBVCCacheStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in getCacheStats:', error);
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
};
