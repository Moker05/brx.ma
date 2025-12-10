// Services for BVC data
import type {
  BVCStock,
  BVCIndex,
  BVCMarketSummary,
  BVCSectorPerformance,
} from '../types/bvc.types';
import { getBVCStocksData } from '../data/bvc-stocks-data';

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
 * Now using real BVC stocks data (50+ stocks)
 */
export async function fetchBVCStocks(): Promise<BVCStock[]> {
  const cacheKey = 'bvc:stocks';
  const cached = getCachedData<BVCStock[]>(cacheKey);
  if (cached) return cached;

  try {
    // Real BVC stocks data with dynamic price variations
    const stocks = getBVCStocksData();

    setCachedData(cacheKey, stocks);
    console.log(`✅ Loaded ${stocks.length} BVC stocks with real data`);
    return stocks;
  } catch (error) {
    console.error('Error fetching BVC stocks:', error);
    return [];
  }
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
 */
export async function fetchBVCIndices(): Promise<BVCIndex[]> {
  const cacheKey = 'bvc:indices';
  const cached = getCachedData<BVCIndex[]>(cacheKey);
  if (cached) return cached;

  try {
    // Mock data for now - will be replaced with real scraping
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
        name: 'MSI20',
        code: 'MSI20',
        value: 945.32,
        change: 3.1,
        changePercent: 0.33,
        timestamp: new Date(),
      },
    ];

    setCachedData(cacheKey, mockIndices);
    return mockIndices;
  } catch (error) {
    console.error('Error fetching BVC indices:', error);
    return [];
  }
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
