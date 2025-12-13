// Services for BVC data
import type {
  BVCStock,
  BVCIndex,
  BVCMarketSummary,
  BVCSectorPerformance,
} from '../types/bvc.types';
import { getBVCStocksData } from '../data/bvc-stocks-data';
import * as CasablancaBourseService from './casablancaBourseScraperService';
import * as AfricanMarketsService from './africanMarketsScraperService';

// Cache configuration
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Get cached data or fetch new data
 */
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

/**
 * Set data in cache
 */
function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch all stocks from Bourse de Casablanca
 * PRIMARY: Casablanca Bourse scraper
 * BACKUP: African Markets scraper
 * FALLBACK: Static data
 */
export async function fetchBVCStocks(): Promise<BVCStock[]> {
  const cacheKey = 'bvc:stocks';
  const cached = getCachedData<BVCStock[]>(cacheKey);
  if (cached) return cached;

  try {
    // PRIMARY: Try Casablanca Bourse first
    console.log('📊 Trying Casablanca Bourse scraper (primary)...');
    const cbStocks = await CasablancaBourseService.scrapeCasablancaBourseStocks();

    if (cbStocks && cbStocks.length > 0) {
      // Convert to BVCStock format
      const stocks: BVCStock[] = cbStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        lastPrice: stock.price * (1 - stock.changePercent / 100), // Calculate from change
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap,
        sector: '', // Not provided by CB, could be enriched later
        logoUrl: stock.logoUrl,
        timestamp: new Date(),
      }));

      setCachedData(cacheKey, stocks);
      console.log(`✅ PRIMARY: Loaded ${stocks.length} stocks from Casablanca Bourse`);
      return stocks;
    }
  } catch (error: any) {
    console.warn(`⚠️  Casablanca Bourse scraper failed: ${error.message}`);
  }

  try {
    // BACKUP: Try African Markets scraper
    console.log('📊 Trying African Markets scraper (backup)...');
    const amStocks = await AfricanMarketsService.scrapeAfricanMarkets();
    // African Markets scraper already filters BVC stocks only, no need to filter again

    if (amStocks && amStocks.length > 0) {
      // Convert to BVCStock format
      const stocks: BVCStock[] = amStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        lastPrice: stock.price * (1 - (stock.change1D || 0) / 100),
        change: stock.change1D || 0,
        changePercent: stock.change1D || 0,
        volume: 0, // Not provided by African Markets
        marketCap: stock.marketCap,
        sector: stock.sector || '',
        logoUrl: '',
        timestamp: new Date(),
      }));

      setCachedData(cacheKey, stocks);
      console.log(`✅ BACKUP: Loaded ${stocks.length} stocks from African Markets`);
      return stocks;
    }
  } catch (error: any) {
    console.warn(`⚠️  African Markets scraper failed: ${error.message}`);
  }

  // FALLBACK: Use static data
  console.log('📊 Using static data (fallback)...');
  const stocks = getBVCStocksData();
  setCachedData(cacheKey, stocks);
  console.log(`✅ FALLBACK: Loaded ${stocks.length} BVC stocks from static data`);
  return stocks;
}

/**
 * Get a specific stock by symbol
 */
export async function fetchBVCStock(symbol: string): Promise<BVCStock | null> {
  const stocks = await fetchBVCStocks();
  return stocks.find((s) => s.symbol === symbol) || null;
}

/**
 * Fetch BVC indices (MASI, MADEX, etc.)
 * PRIMARY: Casablanca Bourse scraper
 * FALLBACK: Mock data
 */
export async function fetchBVCIndices(): Promise<BVCIndex[]> {
  const cacheKey = 'bvc:indices';
  const cached = getCachedData<BVCIndex[]>(cacheKey);
  if (cached) return cached;

  try {
    // PRIMARY: Try to get real market summary
    console.log('📊 Fetching indices from Casablanca Bourse...');
    const marketSummary = await CasablancaBourseService.getMarketSummary();

    if (marketSummary && marketSummary.masi.value > 0) {
      const indices: BVCIndex[] = [
        {
          name: 'MASI',
          code: 'MASI',
          value: marketSummary.masi.value,
          change: marketSummary.masi.change,
          changePercent: marketSummary.masi.changePercent,
          timestamp: marketSummary.timestamp,
        },
      ];

      // Add MADEX if available
      if (marketSummary.madex && marketSummary.madex.value > 0) {
        indices.push({
          name: 'MADEX',
          code: 'MADEX',
          value: marketSummary.madex.value,
          change: marketSummary.madex.change,
          changePercent: marketSummary.madex.changePercent,
          timestamp: marketSummary.timestamp,
        });
      }

      setCachedData(cacheKey, indices);
      console.log(`✅ Loaded ${indices.length} indices from Casablanca Bourse`);
      return indices;
    }
  } catch (error: any) {
    console.warn(`⚠️  Casablanca Bourse indices scraper failed: ${error.message}`);
  }

  // FALLBACK: Mock data
  console.log('📊 Using mock indices data (fallback)...');
  const mockIndices: BVCIndex[] = [
    {
      name: 'MASI',
      code: 'MASI',
      value: 13450.25,
      change: 45.3,
      changePercent: 0.34,
      timestamp: new Date(),
    },
    {
      name: 'MADEX',
      code: 'MADEX',
      value: 10850.75,
      change: 35.2,
      changePercent: 0.33,
      timestamp: new Date(),
    },
  ];

  setCachedData(cacheKey, mockIndices);
  return mockIndices;
}

/**
 * Get market summary with top gainers, losers, most active
 */
export async function fetchBVCMarketSummary(): Promise<BVCMarketSummary> {
  const cacheKey = 'bvc:market-summary';
  const cached = getCachedData<BVCMarketSummary>(cacheKey);
  if (cached) return cached;

  try {
    const stocks = await fetchBVCStocks();
    const indices = await fetchBVCIndices();

    // Sort stocks
    const sortedByChange = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
    const sortedByVolume = [...stocks].sort((a, b) => b.volume - a.volume);

    const topGainers = sortedByChange.slice(0, 5);
    const topLosers = sortedByChange.slice(-5).reverse();
    const mostActive = sortedByVolume.slice(0, 5);

    const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);
    const advancers = stocks.filter((s) => s.change > 0).length;
    const decliners = stocks.filter((s) => s.change < 0).length;
    const unchanged = stocks.filter((s) => s.change === 0).length;

    const summary: BVCMarketSummary = {
      indices,
      topGainers,
      topLosers,
      mostActive,
      totalVolume,
      advancers,
      decliners,
      unchanged,
      timestamp: new Date(),
    };

    setCachedData(cacheKey, summary);
    return summary;
  } catch (error) {
    console.error('Error fetching BVC market summary:', error);
    throw error;
  }
}

/**
 * Get sector performance
 */
export async function fetchBVCSectorPerformance(): Promise<BVCSectorPerformance[]> {
  const cacheKey = 'bvc:sectors';
  const cached = getCachedData<BVCSectorPerformance[]>(cacheKey);
  if (cached) return cached;

  try {
    const stocks = await fetchBVCStocks();

    // Group by sector
    const sectorMap = new Map<string, BVCStock[]>();
    stocks.forEach((stock) => {
      if (stock.sector) {
        if (!sectorMap.has(stock.sector)) {
          sectorMap.set(stock.sector, []);
        }
        sectorMap.get(stock.sector)!.push(stock);
      }
    });

    // Calculate sector performance
    const sectors: BVCSectorPerformance[] = Array.from(sectorMap.entries()).map(
      ([sector, sectorStocks]) => {
        const avgPerformance =
          sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length;
        const totalVolume = sectorStocks.reduce((sum, s) => sum + s.volume, 0);

        return {
          sector,
          performance: avgPerformance,
          volume: totalVolume,
          stocks: sectorStocks.length,
        };
      }
    );

    setCachedData(cacheKey, sectors);
    return sectors;
  } catch (error) {
    console.error('Error fetching BVC sector performance:', error);
    return [];
  }
}

/**
 * Clear all cache
 */
export function clearBVCCache(): void {
  cache.clear();
  console.log('BVC cache cleared');
}

/**
 * Get cache statistics
 */
export function getBVCCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    ttl: CACHE_TTL,
  };
}
