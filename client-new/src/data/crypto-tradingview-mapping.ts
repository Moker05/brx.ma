export interface CryptoAsset {
  ticker: string;
  name: string;
  category: string;
  tradingViewSymbol: string;
}

/**
 * Map CoinGecko coin ID to TradingView symbol
 * Default to BINANCE exchange for most coins
 */
export function coinGeckoToTradingView(coinGeckoId: string, symbol: string): string {
  const specialMappings: Record<string, string> = {
    'bitcoin': 'BINANCE:BTCUSDT',
    'ethereum': 'BINANCE:ETHUSDT',
    'binancecoin': 'BINANCE:BNBUSDT',
    'ripple': 'BINANCE:XRPUSDT',
    'cardano': 'BINANCE:ADAUSDT',
    'solana': 'BINANCE:SOLUSDT',
    'polkadot': 'BINANCE:DOTUSDT',
    'dogecoin': 'BINANCE:DOGEUSDT',
    'avalanche-2': 'BINANCE:AVAXUSDT',
    'chainlink': 'BINANCE:LINKUSDT',
    'polygon': 'BINANCE:MATICUSDT',
    'uniswap': 'BINANCE:UNIUSDT',
    'litecoin': 'BINANCE:LTCUSDT',
    'cosmos': 'BINANCE:ATOMUSDT',
    'stellar': 'BINANCE:XLMUSDT',
    'near': 'BINANCE:NEARUSDT',
    'algorand': 'BINANCE:ALGOUSDT',
    'vechain': 'BINANCE:VETUSDT',
    'filecoin': 'BINANCE:FILUSDT',
    'aave': 'BINANCE:AAVEUSDT',
    'tether': 'BINANCE:USDTUSD',
    'usd-coin': 'BINANCE:USDCUSDT',
    'dai': 'BINANCE:DAIUSDT',
    'pancakeswap-token': 'BINANCE:CAKEUSDT',
    'sushi': 'BINANCE:SUSHIUSDT',
    'the-sandbox': 'BINANCE:SANDUSDT',
    'decentraland': 'BINANCE:MANAUSDT',
    'axie-infinity': 'BINANCE:AXSUSDT',
    'monero': 'BINANCE:XMRUSDT',
    'shiba-inu': 'BINANCE:SHIBUSDT',
    'matic-network': 'BINANCE:MATICUSDT',
    'tron': 'BINANCE:TRXUSDT',
    'bitcoin-cash': 'BINANCE:BCHUSDT',
    'ethereum-classic': 'BINANCE:ETCUSDT',
  };

  if (specialMappings[coinGeckoId]) return specialMappings[coinGeckoId];

  const normalizedSymbol = symbol.toUpperCase();
  return `BINANCE:${normalizedSymbol}USDT`;
}

/**
 * Get category from CoinGecko market cap rank
 */
export function getCryptoCategory(rank: number): string {
  if (!rank || rank <= 0) return 'Unknown';
  if (rank <= 10) return 'Top 10';
  if (rank <= 50) return 'Large Cap';
  if (rank <= 200) return 'Mid Cap';
  return 'Small Cap';
}

export const CRYPTO_ASSETS: CryptoAsset[] = [
  // Top Cryptocurrencies
  { ticker: 'BTC', name: 'Bitcoin', category: 'Layer 1', tradingViewSymbol: 'BINANCE:BTCUSDT' },
  { ticker: 'ETH', name: 'Ethereum', category: 'Layer 1', tradingViewSymbol: 'BINANCE:ETHUSDT' },
  { ticker: 'BNB', name: 'BNB', category: 'Exchange', tradingViewSymbol: 'BINANCE:BNBUSDT' },
  { ticker: 'SOL', name: 'Solana', category: 'Layer 1', tradingViewSymbol: 'BINANCE:SOLUSDT' },
  { ticker: 'XRP', name: 'Ripple', category: 'Payment', tradingViewSymbol: 'BINANCE:XRPUSDT' },
  { ticker: 'ADA', name: 'Cardano', category: 'Layer 1', tradingViewSymbol: 'BINANCE:ADAUSDT' },
  { ticker: 'AVAX', name: 'Avalanche', category: 'Layer 1', tradingViewSymbol: 'BINANCE:AVAXUSDT' },
  { ticker: 'DOGE', name: 'Dogecoin', category: 'Meme', tradingViewSymbol: 'BINANCE:DOGEUSDT' },
  { ticker: 'DOT', name: 'Polkadot', category: 'Layer 0', tradingViewSymbol: 'BINANCE:DOTUSDT' },
  { ticker: 'MATIC', name: 'Polygon', category: 'Layer 2', tradingViewSymbol: 'BINANCE:MATICUSDT' },
  { ticker: 'LINK', name: 'Chainlink', category: 'Oracle', tradingViewSymbol: 'BINANCE:LINKUSDT' },
  { ticker: 'UNI', name: 'Uniswap', category: 'DeFi', tradingViewSymbol: 'BINANCE:UNIUSDT' },
  { ticker: 'LTC', name: 'Litecoin', category: 'Payment', tradingViewSymbol: 'BINANCE:LTCUSDT' },
  { ticker: 'ATOM', name: 'Cosmos', category: 'Layer 0', tradingViewSymbol: 'BINANCE:ATOMUSDT' },
  { ticker: 'XLM', name: 'Stellar', category: 'Payment', tradingViewSymbol: 'BINANCE:XLMUSDT' },
  { ticker: 'NEAR', name: 'NEAR Protocol', category: 'Layer 1', tradingViewSymbol: 'BINANCE:NEARUSDT' },
  { ticker: 'ALGO', name: 'Algorand', category: 'Layer 1', tradingViewSymbol: 'BINANCE:ALGOUSDT' },
  { ticker: 'VET', name: 'VeChain', category: 'Supply Chain', tradingViewSymbol: 'BINANCE:VETUSDT' },
  { ticker: 'FIL', name: 'Filecoin', category: 'Storage', tradingViewSymbol: 'BINANCE:FILUSDT' },
  { ticker: 'AAVE', name: 'Aave', category: 'DeFi', tradingViewSymbol: 'BINANCE:AAVEUSDT' },
  
  // Stablecoins
  { ticker: 'USDT', name: 'Tether', category: 'Stablecoin', tradingViewSymbol: 'BINANCE:USDTUSD' },
  { ticker: 'USDC', name: 'USD Coin', category: 'Stablecoin', tradingViewSymbol: 'BINANCE:USDCUSDT' },
  { ticker: 'DAI', name: 'Dai', category: 'Stablecoin', tradingViewSymbol: 'BINANCE:DAIUSDT' },
  
  // DeFi
  { ticker: 'CAKE', name: 'PancakeSwap', category: 'DeFi', tradingViewSymbol: 'BINANCE:CAKEUSDT' },
  { ticker: 'SUSHI', name: 'SushiSwap', category: 'DeFi', tradingViewSymbol: 'BINANCE:SUSHIUSDT' },
  
  // NFT & Gaming
  { ticker: 'SAND', name: 'The Sandbox', category: 'Metaverse', tradingViewSymbol: 'BINANCE:SANDUSDT' },
  { ticker: 'MANA', name: 'Decentraland', category: 'Metaverse', tradingViewSymbol: 'BINANCE:MANAUSDT' },
  { ticker: 'AXS', name: 'Axie Infinity', category: 'Gaming', tradingViewSymbol: 'BINANCE:AXSUSDT' },
  
  // Privacy
  { ticker: 'XMR', name: 'Monero', category: 'Privacy', tradingViewSymbol: 'BINANCE:XMRUSDT' },
];

export function getCryptoSymbol(ticker: string): string | undefined {
  return CRYPTO_ASSETS.find((crypto) => crypto.ticker === ticker)?.tradingViewSymbol;
}

export function getCryptoByTicker(ticker: string): CryptoAsset | undefined {
  return CRYPTO_ASSETS.find((crypto) => crypto.ticker === ticker);
}

export default CRYPTO_ASSETS;
