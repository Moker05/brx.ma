import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import { getBVCStocksData } from '../data/bvc-stocks-data';

const AFRICAN_MARKETS_URL = 'https://www.african-markets.com/en/stock-markets/bvc/listed-companies';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

/**
 * Mapping to correct company names from African Markets to official BVC names
 */
const NAME_CORRECTIONS: Record<string, string> = {
  'TGCC': 'Travaux Generaux de Construction - Casablanca',
  'TGC': 'Travaux Generaux de Construction - Casablanca',
  'AFMA': 'Aluminium du Maroc',
  'AGMA': 'Assurances Generales du Maroc',
  'ATL': 'Atlantasanad',
  'ATW': 'Attijariwafa Bank',
  'BCP': 'Banque Centrale Populaire',
  'BCI': 'BMCI',
  'BOA': 'Bank of Africa',
  'CFG': 'CFG Bank',
  'CIH': 'CIH Bank',
  'CMA': 'Ciments du Maroc',
  'CMG': 'CMGP Group',
  'CSR': 'Cosumar',
  'DCP': 'Dari Couspate',
  'DHO': 'Delta Holding',
  'DIS': 'Disty Technologies',
  'DSW': 'Disway',
  'EQD': 'Eqdom',
  'FBR': 'Fenie Brossette',
  'GAZ': 'Afriquia Gaz',
  'HPS': 'Hightech Payment Systems',
  'IAM': 'Maroc Telecom',
  'IBM': 'IB Maroc.com',
  'IMR': 'Immorente Invest',
  'INV': 'Involys',
  'JET': 'Jet Contractors',
  'LAF': 'LafargeHolcim Maroc',
  'LBV': 'Label Vie',
  'LES': 'Lesieur Cristal',
  'M2M': 'M2M Group',
  'MLE': 'Maghrebail',
  'MNG': 'Managem',
  'MLS': 'Maroc Leasing',
  'MSA': 'Marsa Maroc',
  'OXY': 'Maghreb Oxygene',
  'PRO': 'Promopharm',
  'REB': 'Rebab Company',
  'RDS': 'Residences Dar Saada',
  'SAL': 'Salafin',
  'SCM': 'Sanlam Maroc',
  'SID': 'Sonasid',
  'SOT': 'Sothema',
  'STR': 'Stroc Industrie',
  'TAQ': 'Taqa Morocco',
  'TMA': 'TotalEnergies Marketing Maroc',
  'TQM': 'TotalEnergies Marketing Maroc',
  'UNI': 'Unimer',
  'WAA': 'Wafa Assurance',
  'ZDJ': 'Zellidja',
};

interface AfricanMarketsStock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change1D: number;
  changeYTD: number;
  marketCap: number;
  date: string;
}

interface CachedAfricanMarketsData {
  stocks: AfricanMarketsStock[];
  timestamp: Date;
}

let cachedData: CachedAfricanMarketsData | null = null;

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse price string to number (handles commas and formats like "1,105.00")
 */
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/,/g, '').trim();
  return parseFloat(cleaned) || 0;
}

/**
 * Parse percentage string to number (handles formats like "+0.90%" or "-1.23%")
 */
function parsePercentage(percentStr: string): number {
  if (!percentStr) return 0;
  const cleaned = percentStr.replace(/[+%]/g, '').trim();
  return parseFloat(cleaned) || 0;
}

/**
 * Parse market cap (handles formats like "155.97" in billions MAD)
 */
function parseMarketCap(mcapStr: string): number {
  if (!mcapStr) return 0;
  const cleaned = mcapStr.replace(/,/g, '').trim();
  const value = parseFloat(cleaned) || 0;
  // Convert billions to actual value
  return value * 1_000_000_000;
}

/**
 * Fetch data from African Markets with retry logic
 */
async function fetchWithRetry(retries = MAX_RETRIES): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Fetching data from African Markets (attempt ${attempt}/${retries})...`);

      const response = await axios.get(AFRICAN_MARKETS_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
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
 * Scrape stock data from African Markets
 */
export async function scrapeAfricanMarkets(): Promise<AfricanMarketsStock[]> {
  try {
    // Check cache
    if (cachedData && Date.now() - cachedData.timestamp.getTime() < CACHE_TTL) {
      console.log('✅ Using cached African Markets data');
      return cachedData.stocks;
    }

    const html = await fetchWithRetry();
    const $ = cheerio.load(html);

    const stocks: AfricanMarketsStock[] = [];

    // Find the main table with id "tab_P4f1upj6uh"
    $('table#tab_P4f1upj6uh tbody tr').each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');

      if (cells.length >= 7) {
        const companyLink = cells.eq(0).find('a');
        let name = companyLink.text().trim();
        const href = companyLink.attr('href') || '';

        // Extract symbol from href (e.g., "?code=ATW")
        const codeMatch = href.match(/code=([A-Z0-9.]+)/i);
        const symbol = codeMatch ? codeMatch[1].replace('.MA', '').toUpperCase() : name.substring(0, 3).toUpperCase();

        // Correct the name if we have a better version
        if (NAME_CORRECTIONS[symbol]) {
          name = NAME_CORRECTIONS[symbol];
        } else if (NAME_CORRECTIONS[name]) {
          name = NAME_CORRECTIONS[name];
        }

        const sector = cells.eq(1).text().trim();
        const priceStr = cells.eq(2).text().trim();
        const change1DStr = cells.eq(3).text().trim();
        const changeYTDStr = cells.eq(4).text().trim();
        const marketCapStr = cells.eq(5).text().trim();
        const date = cells.eq(6).text().trim();

        const stock: AfricanMarketsStock = {
          symbol,
          name,
          sector,
          price: parsePrice(priceStr),
          change1D: parsePercentage(change1DStr),
          changeYTD: parsePercentage(changeYTDStr),
          marketCap: parseMarketCap(marketCapStr),
          date,
        };

        // Only add if we have valid data
        if (stock.symbol && stock.name && stock.price > 0) {
          stocks.push(stock);
        }
      }
    });

    if (stocks.length === 0) {
      throw new Error('No stock data found in table');
    }

    // Update cache
    cachedData = {
      stocks,
      timestamp: new Date(),
    };

    console.log(`✅ Scraped ${stocks.length} BVC stocks from African Markets`);
    return stocks;

  } catch (error: any) {
    console.error('❌ Error scraping African Markets:', error.message);

    // Return cached data if available
    if (cachedData) {
      console.log('⚠️  Using stale cached data due to scraping error');
      return cachedData.stocks;
    }

    // Fallback to local BVC data
    console.log('⚠️  Scraping failed, using local BVC data as fallback');
    return convertBVCDataToAfricanMarkets();
  }
}

/**
 * Convert local BVC data to African Markets format
 */
function convertBVCDataToAfricanMarkets(): AfricanMarketsStock[] {
  const bvcStocks = getBVCStocksData();

  return bvcStocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector || 'Unknown',
    price: stock.lastPrice,
    change1D: stock.changePercent,
    changeYTD: stock.changePercent * 50, // Rough estimate
    marketCap: stock.marketCap || 0,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
  }));
}

/**
 * Convert African Markets data to StockAnalysisData format for compatibility
 */
export function convertToStockAnalysisFormat(africanStocks: AfricanMarketsStock[]): Array<{
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  revenue: number;
  sector: string;
}> {
  return africanStocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change1D,
    marketCap: stock.marketCap,
    revenue: 0,
    sector: stock.sector,
  }));
}
