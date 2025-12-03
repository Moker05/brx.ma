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

const router = Router();

// Stock routes
router.get('/stocks', getAllStocks);
router.get('/stocks/:symbol', getStockBySymbol);

// Index routes
router.get('/indices', getIndices);

// Market summary
router.get('/market-summary', getMarketSummary);

// Sector performance
router.get('/sectors', getSectorPerformance);

// Cache management
router.post('/cache/clear', clearCache);
router.get('/cache/stats', getCacheStats);

export default router;
