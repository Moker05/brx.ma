/**
 * Monitoring & Health Check Routes
 */
import { Router, Request, Response } from 'express';
import { metrics } from '../utils/metrics';
import { prisma } from '../utils/prisma';

const router = Router();

/**
 * Basic health check
 */
router.get('/health', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * Detailed health check with dependencies
 */
router.get('/health/detailed', async (_req: Request, res: Response): Promise<void> => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: 'unknown',
      memory: 'ok',
      disk: 'ok',
    },
    metrics: {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    },
  };

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }

  // Memory check (warn if > 80% used)
  const memUsage = process.memoryUsage();
  const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  if (memPercentage > 80) {
    health.checks.memory = 'warning';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Application metrics endpoint
 */
router.get('/metrics', (_req: Request, res: Response): void => {
  res.json({
    summary: metrics.getSummary(),
    process: {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: process.uptime(),
    },
  });
});

/**
 * Readiness check (for Kubernetes)
 */
router.get('/ready', async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check if app can handle requests
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: 'Database not ready' });
  }
});

/**
 * Liveness check (for Kubernetes)
 */
router.get('/live', (_req: Request, res: Response): void => {
  // Simple check that process is alive
  res.status(200).json({ alive: true });
});

export default router;
