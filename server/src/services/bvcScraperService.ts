import axios from 'axios';
import type { BVCStock, BVCIndex } from '../types/bvc.types';

/**
 * Real scraper for Bourse de Casablanca
 *
 * IMPORTANT: Le site BVC utilise du contenu dynamique (React/Next.js)
 * Pour un scraping complet, il faudrait utiliser Puppeteer ou Playwright
 *
 * Cette version utilise des sources alternatives plus accessibles
 */

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Try to fetch from Médias24 (alternative source)
 * Médias24 a une structure HTML plus simple
 */
async function fetchFromMedias24(): Promise<BVCStock[]> {
  try {
    // Note: Médias24 Bourse peut avoir des données plus accessibles
    await axios.get('https://bourse.medias24.com/', {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // const _$ = cheerio.load(response.data);
    const stocks: BVCStock[] = [];

    // TODO: Parser le HTML de Médias24
    // Structure à identifier sur leur site

    return stocks;
  } catch (error) {
    console.error('Error scraping Médias24:', error);
    return [];
  }
}

/**
 * Try Yahoo Finance for international-listed Moroccan stocks
 */
async function fetchFromYahooFinance(symbols: string[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  try {
    // Certaines actions marocaines sont listées sur Yahoo Finance
    // Format: SYMBOL.CS (Casablanca Stock Exchange)
    for (const symbol of symbols) {
      try {
        const yahooSymbol = `${symbol}.CS`;
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`;

        const response = await axios.get(url, {
          timeout: 5000,
          params: {
            interval: '1d',
            range: '1d',
          },
        });

        const result = response.data?.chart?.result?.[0];
        if (result?.meta?.regularMarketPrice) {
          prices.set(symbol, result.meta.regularMarketPrice);
        }
      } catch (err) {
        // Symbol not found on Yahoo, skip
        continue;
      }
    }
  } catch (error) {
    console.error('Error fetching from Yahoo Finance:', error);
  }

  return prices;
}

/**
 * Mapping des symboles majeurs pour Yahoo Finance
 */
const MAJOR_STOCKS = [
  'ATW', // Attijariwafa Bank
  'BCP', // Banque Centrale Populaire
  'IAM', // Maroc Telecom
  'CIH', // CIH Bank
  'BOA', // Bank of Africa
  'TQM', // Taqa Morocco
];

/**
 * Fetch real BVC data with fallback strategy
 */
export async function fetchRealBVCData(): Promise<{
  stocks: BVCStock[];
  indices: BVCIndex[];
  source: string;
}> {
  const cacheKey = 'real-bvc-data';
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  console.log('🔄 Fetching real BVC data...');

  // Strategy 1: Try Médias24
  const medias24Stocks = await fetchFromMedias24();

  // Strategy 2: Try Yahoo Finance for major stocks
  const yahooprices = await fetchFromYahooFinance(MAJOR_STOCKS);

  // If we got some data, use it
  if (medias24Stocks.length > 0 || yahooprices.size > 0) {
    console.log(`✅ Got ${medias24Stocks.length} stocks from Médias24`);
    console.log(`✅ Got ${yahooprices.size} prices from Yahoo Finance`);

    const result = {
      stocks: medias24Stocks,
      indices: [], // TODO: Fetch indices
      source: medias24Stocks.length > 0 ? 'medias24' : 'yahoo',
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  // Fallback: Return empty (will use mock data)
  console.warn('⚠️  No real data available, using mock data');
  return {
    stocks: [],
    indices: [],
    source: 'mock',
  };
}

/**
 * Check if we have recent real data
 */
export function hasRealData(): boolean {
  const cached = cache.get('real-bvc-data');
  if (!cached) return false;

  return (
    Date.now() - cached.timestamp < CACHE_TTL &&
    cached.data.stocks.length > 0
  );
}

/**
 * SOLUTION RECOMMANDÉE:
 *
 * Pour obtenir des données réelles fiables, 3 options:
 *
 * 1. **API Officielle BVC** (Meilleure option)
 *    - Contacter la Bourse de Casablanca
 *    - Demander accès API payant ou partenariat
 *    - Données certifiées et temps réel
 *
 * 2. **Scraping avec Puppeteer** (Option technique)
 *    - Installer: npm install puppeteer
 *    - Naviguer sur le site BVC avec un vrai navigateur
 *    - Extraire les données du DOM après chargement JS
 *    - Plus lent mais plus fiable
 *
 * 3. **Service Tiers** (Option rapide)
 *    - Alpha Vantage, Financial Modeling Prep
 *    - Peut avoir quelques actions marocaines
 *    - Facile à intégrer
 *
 * CODE PUPPETEER EXEMPLE:
 *
 * ```typescript
 * import puppeteer from 'puppeteer';
 *
 * export async function scrapeBVCWithPuppeteer() {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *
 *   await page.goto('https://www.casablanca-bourse.com/fr/live-market/marche-actions');
 *   await page.waitForSelector('.stock-table');
 *
 *   const stocks = await page.evaluate(() => {
 *     // Extraire les données du DOM
 *     const rows = document.querySelectorAll('.stock-row');
 *     return Array.from(rows).map(row => ({
 *       symbol: row.querySelector('.symbol').textContent,
 *       price: parseFloat(row.querySelector('.price').textContent),
 *       // ...
 *     }));
 *   });
 *
 *   await browser.close();
 *   return stocks;
 * }
 * ```
 */
