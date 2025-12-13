/**
 * Casablanca Bourse Scraper Service
 * Scrapes real-time stock data from casablancabourse.com
 * PRIMARY DATA SOURCE (African Markets as backup)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.casablancabourse.com';

export interface CasablancaBourseStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  volumeDH: number;
  marketCap: number;
  logoUrl: string;
  detailUrl: string;
  chartData?: {
    dates: string[];
    prices: number[];
  };
}

export interface MarketSummary {
  masi: {
    value: number;
    change: number;
    changePercent: number;
  };
  madex?: {
    value: number;
    change: number;
    changePercent: number;
  };
  totalMarketCap: number;
  timestamp: Date;
}

/**
 * Scrape all stocks from Casablanca Bourse
 */
export async function scrapeCasablancaBourseStocks(): Promise<CasablancaBourseStock[]> {
  try {
    console.log('🇲🇦 Scraping Casablanca Bourse...');

    const response = await axios.get(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const stocks: CasablancaBourseStock[] = [];

    // Find all stock rows in the table
    $('table tbody tr').each((index, element) => {
      try {
        const $row = $(element);

        // Extract logo and symbol
        const logoImg = $row.find('img[src*="/images/logos/"]').attr('src');
        const symbol = logoImg ? logoImg.split('/').pop()?.replace('.png', '') : '';

        if (!symbol) return; // Skip if no symbol found

        // Extract company name
        const name = $row.find('td').eq(1).text().trim() || symbol;

        // Extract volume (Actions)
        const volumeText = $row.find('td').eq(3).text().trim().replace(/\s/g, '');
        const volume = parseFloat(volumeText) || 0;

        // Extract volume DH (convert M/B to number)
        const volumeDHText = $row.find('td').eq(4).text().trim();
        const volumeDH = parseVolumeOrCap(volumeDHText);

        // Extract market cap (convert M/B to number)
        const marketCapText = $row.find('td').eq(5).text().trim();
        const marketCap = parseVolumeOrCap(marketCapText);

        // Extract price
        const priceText = $row.find('td').eq(6).text().trim().replace(/[^\d.]/g, '');
        const price = parseFloat(priceText) || 0;

        // Extract change and changePercent
        const changeText = $row.find('td').eq(7).text().trim();
        const { change, changePercent } = parseChange(changeText);

        // Build stock object
        const stock: CasablancaBourseStock = {
          symbol,
          name,
          price,
          change,
          changePercent,
          volume,
          volumeDH,
          marketCap,
          logoUrl: logoImg ? BASE_URL + logoImg : '',
          detailUrl: `${BASE_URL}/${symbol}/action/capitalisation`,
        };

        // Try to extract chart data from script tags
        const chartData = extractChartData(response.data, index);
        if (chartData) {
          stock.chartData = chartData;
        }

        stocks.push(stock);
      } catch (error) {
        console.error(`Error parsing stock at index ${index}:`, error);
      }
    });

    console.log(`✅ Scraped ${stocks.length} stocks from Casablanca Bourse`);
    return stocks;

  } catch (error: any) {
    console.error('❌ Error scraping Casablanca Bourse:', error.message);
    throw new Error(`Failed to scrape Casablanca Bourse: ${error.message}`);
  }
}

/**
 * Get market summary (MASI, MADEX indices, total market cap)
 * Scrapes from homepage
 */
export async function getMarketSummary(): Promise<MarketSummary> {
  try {
    console.log('📊 Scraping market summary from Casablanca Bourse...');

    const response = await axios.get(BASE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const fullText = $('body').text();

    // Extract MASI Index
    let masiValue = 0;
    let masiChange = 0;
    let masiChangePercent = 0;

    const masiMatch = fullText.match(/MASI\s*Index[\s\S]{0,200}?(\d+[.,]\d+)/i);
    if (masiMatch) {
      masiValue = parseFloat(masiMatch[1].replace(',', ''));
    }

    const masiChangeMatch = fullText.match(/MASI[\s\S]{0,100}?([-+]?\d+[.,]\d+)\s*%/i);
    if (masiChangeMatch) {
      masiChangePercent = parseFloat(masiChangeMatch[1].replace(',', '.'));
    }

    // Extract MADEX
    let madexValue = 0;
    let madexChange = 0;
    let madexChangePercent = 0;

    const madexMatch = fullText.match(/MADEX[\s\S]{0,200}?(\d+[.,]\d+)/i);
    if (madexMatch) {
      madexValue = parseFloat(madexMatch[1].replace(',', ''));
    }

    const madexChangeMatch = fullText.match(/MADEX[\s\S]{0,100}?([-+]?\d+[.,]\d+)\s*%/i);
    if (madexChangeMatch) {
      madexChangePercent = parseFloat(madexChangeMatch[1].replace(',', '.'));
    }

    // Extract total market capitalization
    let totalMarketCap = 0;

    const marketCapMatch = fullText.match(/(\d+[.,]\d+)\s*Billion\s*MAD/i);
    if (marketCapMatch) {
      totalMarketCap = parseFloat(marketCapMatch[1].replace(',', '.')) * 1_000_000_000;
    }

    // Alternative pattern
    if (totalMarketCap === 0) {
      const capMatch2 = fullText.match(/Capitalisation[\s\S]{0,100}?(\d+[.,]\d+)\s*B/i);
      if (capMatch2) {
        totalMarketCap = parseFloat(capMatch2[1].replace(',', '.')) * 1_000_000_000;
      }
    }

    console.log(`✅ Market: MASI=${masiValue}, MADEX=${madexValue}, Cap=${(totalMarketCap/1e9).toFixed(2)}B MAD`);

    return {
      masi: {
        value: masiValue,
        change: masiChange,
        changePercent: masiChangePercent,
      },
      madex: {
        value: madexValue,
        change: madexChange,
        changePercent: madexChangePercent,
      },
      totalMarketCap,
      timestamp: new Date(),
    };

  } catch (error: any) {
    console.error('❌ Error getting market summary:', error.message);
    throw new Error(`Failed to get market summary: ${error.message}`);
  }
}

/**
 * Parse volume/market cap text (handles M/B suffixes)
 * Examples: "198.86 M" -> 198860000, "7.9 B" -> 7900000000
 */
function parseVolumeOrCap(text: string): number {
  if (!text) return 0;

  const cleaned = text.trim().toUpperCase();
  const match = cleaned.match(/(\d+[.,]?\d*)\s*([MB])?/);

  if (!match) return 0;

  const value = parseFloat(match[1].replace(',', '.'));
  const suffix = match[2];

  if (suffix === 'M') return value * 1_000_000;
  if (suffix === 'B') return value * 1_000_000_000;

  return value;
}

/**
 * Parse change text
 * Examples: "↑ 9.99 %" -> {change: 9.99, changePercent: 9.99}
 *           "↓ -2.50 %" -> {change: -2.50, changePercent: -2.50}
 */
function parseChange(text: string): { change: number; changePercent: number } {
  if (!text) return { change: 0, changePercent: 0 };

  const cleaned = text.trim();
  const isNegative = cleaned.includes('↓') || cleaned.includes('-');

  const match = cleaned.match(/(\d+[.,]\d+)/);
  if (!match) return { change: 0, changePercent: 0 };

  const value = parseFloat(match[1].replace(',', '.'));
  const finalValue = isNegative ? -value : value;

  return {
    change: finalValue,
    changePercent: finalValue,
  };
}

/**
 * Extract chart data from JavaScript in HTML
 * Looks for Chart.js data arrays like: const data0 = {...}
 */
function extractChartData(html: string, chartIndex: number): { dates: string[]; prices: number[] } | null {
  try {
    // Pattern to match: const data0 = { labels: [...], datasets: [{data: [...]}] }
    const pattern = new RegExp(`const data${chartIndex}\\s*=\\s*{([^}]+labels:\\s*\\[([^\\]]+)\\][^}]+data:\\s*\\[([^\\]]+)\\])`, 's');
    const match = html.match(pattern);

    if (!match) return null;

    // Extract labels (dates)
    const labelsMatch = match[2];
    const dates = labelsMatch
      .split(',')
      .map(d => d.trim().replace(/['"]/g, ''))
      .filter(d => d.length > 0);

    // Extract prices
    const pricesMatch = match[3];
    const prices = pricesMatch
      .split(',')
      .map(p => parseFloat(p.trim()))
      .filter(p => !isNaN(p));

    if (dates.length === 0 || prices.length === 0) return null;

    return { dates, prices };

  } catch (error) {
    return null;
  }
}

/**
 * Get single stock details
 */
export async function getStockDetails(symbol: string): Promise<CasablancaBourseStock | null> {
  try {
    const stocks = await scrapeCasablancaBourseStocks();
    return stocks.find(s => s.symbol === symbol) || null;
  } catch (error) {
    console.error(`Error getting stock ${symbol}:`, error);
    return null;
  }
}

export default {
  scrapeCasablancaBourseStocks,
  getMarketSummary,
  getStockDetails,
};
