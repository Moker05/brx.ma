import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { getBVCStocksData } from '../data/bvc-stocks-data';
import { scrapeAfricanMarkets, convertToStockAnalysisFormat } from './africanMarketsScraperService';

const STOCK_ANALYSIS_URL = 'https://stockanalysis.com/list/casablanca-stock-exchange/';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

interface StockAnalysisData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap?: number;
  revenue: number;
}

interface ScrapedBVCData {
  stocks: StockAnalysisData[];
  timestamp: Date;
}

let cachedData: ScrapedBVCData | null = null;

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate stock data object
 */
function isValidStockData(stock: any): boolean {
  return (
    stock &&
    typeof stock === 'object' &&
    (stock.s || stock.symbol || stock.ticker) &&
    (stock.n || stock.name) &&
    typeof (stock.price || stock.lastPrice) !== 'undefined'
  );
}

/**
 * Fetch data from StockAnalysis.com with retry logic
 */
async function fetchWithRetry(retries = MAX_RETRIES): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Fetching data from StockAnalysis.com (attempt ${attempt}/${retries})...`);

      const response = await axios.get(STOCK_ANALYSIS_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
        },
        timeout: 15000,
        validateStatus: (status) => status === 200,
      });

      if (!response.data || typeof response.data !== 'string') {
        throw new Error('Invalid response: empty or non-HTML content');
      }

      return response.data;

    } catch (error) {
      const isLastAttempt = attempt === retries;
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error(`❌ HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`);
      } else if (axiosError.code === 'ECONNABORTED') {
        console.error('❌ Request timeout');
      } else if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'EAI_AGAIN') {
        console.error('❌ DNS resolution failed');
      } else {
        console.error(`❌ Request failed: ${axiosError.message}`);
      }

      if (isLastAttempt) {
        throw error;
      }

      const delay = RETRY_DELAY * attempt;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw new Error('Failed to fetch after all retries');
}

/**
 * Scrape stock data from StockAnalysis.com
 * Extracts embedded JSON from page source
 */
export async function scrapeStockAnalysis(): Promise<StockAnalysisData[]> {
  try {
    // Check cache
    if (cachedData && Date.now() - cachedData.timestamp.getTime() < CACHE_TTL) {
      console.log('✅ Using cached data');
      return cachedData.stocks;
    }

    // Try African Markets first (more reliable)
    try {
      console.log('🌍 Trying African Markets scraper...');
      const africanStocks = await scrapeAfricanMarkets();
      const converted = convertToStockAnalysisFormat(africanStocks);

      // Update cache
      cachedData = {
        stocks: converted,
        timestamp: new Date(),
      };

      console.log(`✅ Successfully scraped ${converted.length} stocks from African Markets`);
      return converted;
    } catch (africanError: any) {
      console.error('❌ African Markets failed:', africanError.message);
      console.log('⚠️  Falling back to StockAnalysis.com scraper...');
    }

    const html = await fetchWithRetry();
    const $ = cheerio.load(html);

    // Extract embedded JSON from script tags using multiple strategies
    const scripts = $('script').toArray();
    let stockData: StockAnalysisData[] = [];

    function tryParseJsonArray(candidate: string): any[] | null {
      try {
        const parsed = JSON.parse(candidate);
        if (Array.isArray(parsed)) return parsed;
        return null;
      } catch (e) {
        return null;
      }
    }

    // Strategy 1: Look for explicit "stockData" property
    for (const script of scripts) {
      const content = $(script).html() || '';
      if (!content) continue;

      // Attempt patterns that may contain the payload
      const patterns = [
        /"stockData"\s*:\s*(\[.*?\])/s,
        /stockData\s*[:=]\s*(\[.*?\])/s,
        /var\s+stockData\s*=\s*(\[.*?\])/s,
        /window\.__INITIAL_STATE__\s*=\s*(\{.*?\})/s,
      ];

      for (const p of patterns) {
        const m = content.match(p);
        if (m && m[1]) {
          const arr = tryParseJsonArray(m[1]);
          if (arr && arr.length > 0 && arr.every(isValidStockData)) {
            stockData = arr
              .filter(isValidStockData)
              .map((item: any) => ({
                symbol: (item.s || item.symbol || item.ticker || '').toString().replace(/^cbse\//i, '').toUpperCase().trim(),
                name: (item.n || item.name || item.fullName || item.ticker || '').toString().trim(),
                price: parseFloat((item.price || item.lastPrice || 0).toString()) || 0,
                change: parseFloat((item.change || item.changePercent || 0).toString()) || 0,
                marketCap: parseFloat((item.marketCap || 0).toString()) || 0,
                revenue: parseFloat((item.revenue || 0).toString()) || 0,
              }))
              .filter(stock => stock.symbol && stock.name);
            break;
          }
        }
      }

      if (stockData.length) break;
    }

    // Strategy 2: Look for any JSON array in scripts that resemble stock objects
    if (stockData.length === 0) {
      for (const script of scripts) {
        const content = $(script).html() || '';
        // Find largest JSON-ish array substring
        const arrayMatch = content.match(/(\[\s*\{[\s\S]*?\}\s*\])/s);
        if (arrayMatch && arrayMatch[1]) {
          const arr = tryParseJsonArray(arrayMatch[1]);
          if (arr && arr.length > 0) {
            // Heuristic: check first item for keys like s, n, symbol, name
            const first = arr[0];
            const keys = Object.keys(first || {});
            const hasStockKeys = keys.some((k) => ['s', 'n', 'symbol', 'ticker', 'name'].includes(k));
            if (hasStockKeys && arr.every(isValidStockData)) {
              stockData = arr
                .filter(isValidStockData)
                .map((item: any) => ({
                  symbol: (item.s || item.symbol || item.ticker || '').toString().replace(/^cbse\//i, '').toUpperCase().trim(),
                  name: (item.n || item.name || item.fullName || item.ticker || '').toString().trim(),
                  price: parseFloat((item.price || item.lastPrice || 0).toString()) || 0,
                  change: parseFloat((item.change || item.changePercent || 0).toString()) || 0,
                  marketCap: parseFloat((item.marketCap || 0).toString()) || 0,
                  revenue: parseFloat((item.revenue || 0).toString()) || 0,
                }))
                .filter(stock => stock.symbol && stock.name);
              break;
            }
          }
        }
      }
    }

    // Strategy 3: Look for <script type="application/json"> blocks
    if (stockData.length === 0) {
      const jsonScripts = $('script[type="application/json"]').toArray();
      for (const s of jsonScripts) {
        const content = $(s).html() || '';
        const arr = tryParseJsonArray(content);
        if (arr && arr.length > 0) {
          const first = arr[0];
          const keys = Object.keys(first || {});
          const hasStockKeys = keys.some((k) => ['s', 'n', 'symbol', 'ticker', 'name'].includes(k));
          if (hasStockKeys && arr.every(isValidStockData)) {
            stockData = arr
              .filter(isValidStockData)
              .map((item: any) => ({
                symbol: (item.s || item.symbol || item.ticker || '').toString().replace(/^cbse\//i, '').toUpperCase().trim(),
                name: (item.n || item.name || item.fullName || item.ticker || '').toString().trim(),
                price: parseFloat((item.price || item.lastPrice || 0).toString()) || 0,
                change: parseFloat((item.change || item.changePercent || 0).toString()) || 0,
                marketCap: parseFloat((item.marketCap || 0).toString()) || 0,
                revenue: parseFloat((item.revenue || 0).toString()) || 0,
              }))
              .filter(stock => stock.symbol && stock.name);
            break;
          }
        }
      }
    }

    if (stockData.length === 0) {
      throw new Error('No stock data found in page');
    }

    // Update cache
    cachedData = {
      stocks: stockData,
      timestamp: new Date(),
    };

    console.log(`✅ Scraped ${stockData.length} BVC stocks from StockAnalysis.com`);
    return stockData;

  } catch (error: any) {
    console.error('❌ Error scraping StockAnalysis.com:', error.message);

    // Return cached data if available
    if (cachedData) {
      console.log('⚠️  Using stale cached data due to scraping error');
      return cachedData.stocks;
    }

    // Fallback to local BVC data
    console.log('⚠️  Scraping failed, using local BVC data as fallback');
    return convertBVCDataToStockAnalysis();
  }
}

/**
 * Convert local BVC data to StockAnalysisData format
 */
function convertBVCDataToStockAnalysis(): StockAnalysisData[] {
  const bvcStocks = getBVCStocksData();

  return bvcStocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.lastPrice,
    change: stock.changePercent,
    marketCap: stock.marketCap,
    revenue: 0, // Not available in BVC data
  }));
}

/**
 * Calculate MASI index (weighted average of all stocks)
 */
export function calculateMASI(stocks: StockAnalysisData[]): { value: number; change: number } {
  const totalMarketCap = stocks.reduce((sum, s) => sum + (s.marketCap || 0), 0);
  const weightedChange = stocks.reduce((sum, s) => {
    const weight = totalMarketCap > 0 ? (s.marketCap || 0) / totalMarketCap : 0;
    return sum + (s.change * weight);
  }, 0);

  // Mock MASI value (could be calculated properly with historical data)
  const masiValue = 13000 + (weightedChange * 100);
  
  return {
    value: Number(masiValue.toFixed(2)),
    change: Number(weightedChange.toFixed(2)),
  };
}

/**
 * Get top gainers (sorted by change %)
 */
export function getTopGainers(stocks: StockAnalysisData[], limit = 5): StockAnalysisData[] {
  return [...stocks]
    .filter(s => s.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, limit);
}

/**
 * Get top losers (sorted by change %)
 */
export function getTopLosers(stocks: StockAnalysisData[], limit = 5): StockAnalysisData[] {
  return [...stocks]
    .filter(s => s.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, limit);
}

/**
 * Calculate sector performance
 * Note: StockAnalysis doesn't provide sector data, so we'll map it manually
 */
export function getSectorPerformance(stocks: StockAnalysisData[]): { sector: string; change: number }[] {
  // Build sector mapping from the authoritative server-side BVC data
  const reference = getBVCStocksData();
  const sectorMap = new Map<string, string>();
  reference.forEach((s) => {
    if (s.symbol && s.symbol.trim()) {
      sectorMap.set(s.symbol.toUpperCase(), s.sector || '');
    }
  });

  const sectorData = new Map<string, { totalChange: number; count: number }>();

  stocks.forEach(stock => {
    const sector = sectorMap.get(stock.symbol.toUpperCase()) || 'Other';
    const current = sectorData.get(sector) || { totalChange: 0, count: 0 };
    sectorData.set(sector, {
      totalChange: current.totalChange + stock.change,
      count: current.count + 1,
    });
  });

  return Array.from(sectorData.entries())
    .map(([sector, data]) => ({
      sector,
      change: Number((data.totalChange / data.count).toFixed(2)),
    }))
    .sort((a, b) => b.change - a.change);
}
