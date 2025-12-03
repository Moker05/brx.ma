import { Request, Response } from 'express';
import * as coinGeckoService from '../services/coinGeckoService';

/**
 * GET /api/crypto/markets
 * Get list of cryptocurrencies with market data
 */
export const getMarkets = async (req: Request, res: Response) => {
  try {
    const { currency = 'usd', limit = '100', page = '1' } = req.query;

    const data = await coinGeckoService.getMarketData(
      currency as string,
      parseInt(limit as string),
      parseInt(page as string)
    );

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in getMarkets:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/crypto/:id
 * Get specific cryptocurrency details
 */
export const getCryptoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await coinGeckoService.getCoinById(id);

    res.json({ success: true, data });
  } catch (error: any) {
    console.error(`Error in getCryptoById for ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/crypto/:id/history
 * Get historical price data
 */
export const getHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currency = 'usd', days = '30' } = req.query;

    const data = await coinGeckoService.getHistoricalData(
      id,
      currency as string,
      parseInt(days as string)
    );

    res.json({ success: true, data });
  } catch (error: any) {
    console.error(`Error in getHistory for ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/crypto/prices
 * Get simple prices for multiple cryptocurrencies
 */
export const getPrices = async (req: Request, res: Response) => {
  try {
    const { ids, currency = 'usd' } = req.query;

    if (!ids) {
      return res.status(400).json({ success: false, error: 'ids parameter is required' });
    }

    const coinIds = (ids as string).split(',');
    const data = await coinGeckoService.getSimplePrices(coinIds, currency as string);

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in getPrices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/crypto/search
 * Search cryptocurrencies
 */
export const searchCrypto = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, error: 'q parameter is required' });
    }

    const data = await coinGeckoService.searchCoins(q as string);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in searchCrypto:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/crypto/trending
 * Get trending cryptocurrencies
 */
export const getTrending = async (req: Request, res: Response) => {
  try {
    const data = await coinGeckoService.getTrendingCoins();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in getTrending:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/crypto/coins/:id/ohlc
 * Get OHLC data for charting
 */
export const getOHLC = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currency = 'usd', days = '30' } = req.query;

    const data = await coinGeckoService.getOHLC(
      id,
      currency as string,
      parseInt(days as string)
    );

    res.json({ success: true, data });
  } catch (error: any) {
    console.error(`Error in getOHLC for ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};
