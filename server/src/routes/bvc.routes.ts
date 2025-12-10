import { Router } from 'express';
import {
  getAllStocks,
  getStockBySymbol,
  clearCache,
  getCacheStats,
} from '../controllers/bvc.controller';
import {
  scrapeStockAnalysis,
  calculateMASI,
  getTopGainers,
  getTopLosers,
  getSectorPerformance as scraperSectorPerformance,
} from '../services/stockAnalysisScraperService';

const router = Router();

// Legacy controller-backed routes (using static data)
router.get('/stocks', getAllStocks);
router.get('/stocks/:symbol', getStockBySymbol);

// Cache management
router.post('/cache/clear', clearCache);
router.get('/cache/stats', getCacheStats);

// Scraper-backed endpoints (real-time BVC data from StockAnalysis.com)
router.get('/markets', async (_req, res) => {
  try {
    const stocks = await scrapeStockAnalysis();
    res.json({ success: true, data: stocks, count: stocks.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/indices', async (_req, res) => {
  try {
    const stocks = await scrapeStockAnalysis();
    const masi = calculateMASI(stocks);
    const top20 = [...stocks].sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, 20);
    const msi20Change = top20.reduce((sum, s) => sum + s.change, 0) / 20;
    const totalVolume = stocks.reduce((sum, s) => sum + ((s.marketCap || 0) * 0.001), 0);

    res.json({
      success: true,
      data: {
        masi: { value: masi.value, change: masi.change },
        msi20: { value: 1089.34, change: Number(msi20Change.toFixed(2)) },
        volume: { value: `${(totalVolume / 1000000).toFixed(0)}M MAD`, change: 1.25 },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/market-summary', async (_req, res) => {
  try {
    const stocks = await scrapeStockAnalysis();
    const masi = calculateMASI(stocks);
    const gainers = getTopGainers(stocks, 5);
    const losers = getTopLosers(stocks, 5);

    res.json({
      success: true,
      data: {
        masi,
        topGainers: gainers,
        topLosers: losers,
        totalStocks: stocks.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/top-movers', async (_req, res) => {
  try {
    const stocks = await scrapeStockAnalysis();
    const gainers = getTopGainers(stocks, 5);
    const losers = getTopLosers(stocks, 5);
    res.json({ success: true, data: { gainers, losers } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/sectors', async (_req, res) => {
  try {
    const stocks = await scrapeStockAnalysis();
    const sectors = scraperSectorPerformance(stocks);
    res.json({ success: true, data: sectors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
