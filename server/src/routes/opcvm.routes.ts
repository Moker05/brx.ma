import { Router, Request, Response } from 'express';
import {
  getOPCVMByCategoryHandler,
  getOPCVMDetails,
  getOPCVMHistoryHandler,
  listOPCVM,
  simulateOPCVMInvestment,
} from '../controllers/opcvm.controller';
import {
  fetchOPCVMFromDataGov,
  getOPCVMStats,
  clearOPCVMCache,
} from '../services/opcvmDataGovService';

const router = Router();

// List & filters (existing mock data)
router.get('/', listOPCVM);

// NEW: Real OPCVM data from AMMC/data.gov.ma
router.get('/real', async (req: Request, res: Response) => {
  try {
    const opcvmData = await fetchOPCVMFromDataGov();
    res.json({
      success: true,
      count: opcvmData.length,
      data: opcvmData,
      source: 'AMMC - data.gov.ma (enhanced)',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OPCVM data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// NEW: OPCVM statistics
router.get('/real/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getOPCVMStats();
    res.json({
      success: true,
      data: stats,
      source: 'AMMC - data.gov.ma',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch OPCVM stats',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// NEW: Clear OPCVM cache
router.post('/real/cache/clear', async (req: Request, res: Response) => {
  try {
    clearOPCVMCache();
    res.json({
      success: true,
      message: 'OPCVM cache cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Category filter
router.get('/category/:category', getOPCVMByCategoryHandler);

// History before id catch-all
router.get('/:id/history', getOPCVMHistoryHandler);

// Simulation
router.post('/simulate', simulateOPCVMInvestment);

// Details
router.get('/:id', getOPCVMDetails);

export default router;
