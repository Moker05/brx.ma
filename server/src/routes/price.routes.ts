import { Router } from 'express';
import { updateAllPositionPrices } from '../controllers/price.controller';

const router = Router();

// Update position prices
router.post('/update/:userId?', updateAllPositionPrices);

export default router;
