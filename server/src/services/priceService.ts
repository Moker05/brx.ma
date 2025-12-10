import axios from 'axios';
import { AssetType } from '@prisma/client';

// Cache for price data (5 minute TTL)
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get current price for a crypto asset
 */
export async function getCryptoPrice(symbol: string): Promise<number | null> {
  const cacheKey = `crypto:${symbol}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    // Using CoinGecko API
    const coinId = cryptoSymbolToId(symbol);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );

    const priceUSD = response.data[coinId]?.usd;
    if (!priceUSD) return null;

    // Convert to MAD (approximate rate: 1 USD = 10 MAD)
    const priceMAD = priceUSD * 10;

    priceCache.set(cacheKey, { price: priceMAD, timestamp: Date.now() });
    return priceMAD;
  } catch (error) {
    console.error(`Error fetching crypto price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get current price for a stock (BVC)
 */
export async function getStockPrice(symbol: string): Promise<number | null> {
  const cacheKey = `stock:${symbol}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    // Import BVC service
    const { fetchBVCStock } = await import('./bvcService');
    const stock = await fetchBVCStock(symbol);

    if (!stock) {
      console.warn(`Stock ${symbol} not found in BVC`);
      return null;
    }

    priceCache.set(cacheKey, { price: stock.lastPrice, timestamp: Date.now() });
    return stock.lastPrice;
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get current price for an OPCVM
 */
export async function getOPCVMPrice(symbol: string): Promise<number | null> {
  const cacheKey = `opcvm:${symbol}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    // TODO: Implement OPCVM price API
    console.warn(`OPCVM price API not implemented yet for ${symbol}`);
    return null;
  } catch (error) {
    console.error(`Error fetching OPCVM price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Get current price for any asset type
 */
export async function getAssetPrice(
  symbol: string,
  assetType: AssetType
): Promise<number | null> {
  switch (assetType) {
    case 'CRYPTO':
      return getCryptoPrice(symbol);
    case 'STOCK':
      return getStockPrice(symbol);
    case 'OPCVM':
      return getOPCVMPrice(symbol);
    default:
      return null;
  }
}

/**
 * Get multiple asset prices in bulk
 */
export async function getBulkAssetPrices(
  assets: Array<{ symbol: string; assetType: AssetType }>
): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();

  await Promise.all(
    assets.map(async (asset) => {
      const price = await getAssetPrice(asset.symbol, asset.assetType);
      if (price !== null) {
        priceMap.set(`${asset.symbol}:${asset.assetType}`, price);
      }
    })
  );

  return priceMap;
}

/**
 * Update positions with current prices
 */
export async function updatePositionPrices(positions: any[]): Promise<any[]> {
  const assets = positions.map((pos) => ({
    symbol: pos.symbol,
    assetType: pos.assetType,
  }));

  const priceMap = await getBulkAssetPrices(assets);

  return positions.map((pos) => {
    const key = `${pos.symbol}:${pos.assetType}`;
    const currentPrice = priceMap.get(key) || pos.avgPurchasePrice;
    const currentValue = pos.quantity * currentPrice;
    const profitLoss = currentValue - pos.totalInvested;
    const profitLossPercent = (profitLoss / pos.totalInvested) * 100;

    return {
      ...pos,
      currentPrice,
      currentValue,
      profitLoss,
      profitLossPercent,
      lastUpdated: new Date(),
    };
  });
}

/**
 * Convert crypto symbol to CoinGecko ID
 */
function cryptoSymbolToId(symbol: string): string {
  const symbolMap: Record<string, string> = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    BNB: 'binancecoin',
    SOL: 'solana',
    XRP: 'ripple',
    ADA: 'cardano',
    AVAX: 'avalanche-2',
    DOT: 'polkadot',
    MATIC: 'matic-network',
    LINK: 'chainlink',
    UNI: 'uniswap',
    LTC: 'litecoin',
    ATOM: 'cosmos',
    ETC: 'ethereum-classic',
    XLM: 'stellar',
    ALGO: 'algorand',
    VET: 'vechain',
    FIL: 'filecoin',
    TRX: 'tron',
  };

  return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase();
}

/**
 * Clear price cache
 */
export function clearPriceCache(): void {
  priceCache.clear();
}
