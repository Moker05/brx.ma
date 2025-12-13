import { Router } from 'express';
import {
  getAllStocks,
  getStockBySymbol,
  getIndices,
  getMarketSummary,
  getSectorPerformance,
  clearCache,
  getCacheStats,
} from '../controllers/bvc.controller';
import { fetchBVCMarketSummary } from '../services/bvcService';

const router = Router();

// Main routes using Casablanca Bourse scraper (PRIMARY) with fallbacks
router.get('/stocks', getAllStocks);
router.get('/stocks/:symbol', getStockBySymbol);
router.get('/indices', getIndices);
router.get('/market-summary', getMarketSummary);
router.get('/sectors', getSectorPerformance);

// Top movers endpoint (used by frontend ticker)
router.get('/top-movers', async (_req, res) => {
  try {
    const summary = await fetchBVCMarketSummary();
    res.json({
      success: true,
      data: {
        gainers: summary.topGainers,
        losers: summary.topLosers,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cache management
router.post('/cache/clear', clearCache);
router.get('/cache/stats', getCacheStats);

export default router;
