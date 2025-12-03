import { Router } from 'express';
import {
  getWallet,
  addPosition,
  updatePosition,
  deletePosition,
  executeBuyOrder,
  executeSellOrder,
  getPortfolioHistory,
  createPortfolioSnapshot,
  resetWallet,
} from '../controllers/portfolio.controller';

const router = Router();

// Wallet routes
router.get('/wallet/:userId?', getWallet);
router.post('/wallet/:userId?/reset', resetWallet);

// Position management routes
router.post('/positions/:userId?', addPosition);
router.put('/positions/:positionId', updatePosition);
router.delete('/positions/:positionId', deletePosition);

// Trading routes
router.post('/buy/:userId?', executeBuyOrder);
router.post('/sell/:userId?', executeSellOrder);

// Portfolio history routes
router.get('/history/:userId?', getPortfolioHistory);
router.post('/snapshot/:userId?', createPortfolioSnapshot);

export default router;
