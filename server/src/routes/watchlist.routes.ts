import { Router } from 'express';

const router = Router();

// TODO: Implement watchlist routes (requires authentication)
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get watchlist - Coming soon (auth required)' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Add to watchlist - Coming soon (auth required)' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Remove from watchlist - Coming soon (auth required)' });
});

export default router;
