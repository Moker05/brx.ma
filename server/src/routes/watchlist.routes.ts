import { Router } from 'express';

const router = Router();

// TODO: Implement watchlist routes (requires authentication)
router.get('/', (_req, res) => {
  res.status(501).json({ message: 'Get watchlist - Coming soon (auth required)' });
});

router.post('/', (_req, res) => {
  res.status(501).json({ message: 'Add to watchlist - Coming soon (auth required)' });
});

router.delete('/:id', (_req, res) => {
  res.status(501).json({ message: 'Remove from watchlist - Coming soon (auth required)' });
});

export default router;
