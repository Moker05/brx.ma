import { Router } from 'express';
import * as cryptoController from '../controllers/cryptoController';

const router = Router();

// GET /api/crypto/markets - List cryptocurrencies with market data
router.get('/markets', cryptoController.getMarkets);

// GET /api/crypto/trending - Get trending cryptocurrencies
router.get('/trending', cryptoController.getTrending);

// GET /api/crypto/search - Search cryptocurrencies
router.get('/search', cryptoController.searchCrypto);

// GET /api/crypto/prices - Get simple prices for multiple coins
router.get('/prices', cryptoController.getPrices);

// GET /api/crypto/coins/:id/ohlc - OHLC data
router.get('/coins/:id/ohlc', cryptoController.getOHLC);

// GET /api/crypto/:id - Get specific cryptocurrency details
router.get('/:id', cryptoController.getCryptoById);

// GET /api/crypto/:id/history - Get historical price data
router.get('/:id/history', cryptoController.getHistory);

export default router;
