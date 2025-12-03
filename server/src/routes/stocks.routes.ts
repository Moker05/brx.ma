import { Router } from 'express';
import axios from 'axios';

const router = Router();
const PYTHON_API = process.env.PYTHON_API_URL || 'http://localhost:5001';

// Proxy to Python microservice
router.get('/', async (req, res, next) => {
  try {
    const response = await axios.get(`${PYTHON_API}/api/stocks`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(`${PYTHON_API}/api/stocks/${symbol}`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/:symbol/history', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(`${PYTHON_API}/api/stocks/${symbol}/history`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/:symbol/intraday', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(`${PYTHON_API}/api/stocks/${symbol}/intraday`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

export default router;
