import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
// Routes
import authRoutes from './routes/auth.routes';
import stocksRoutes from './routes/stocks.routes';
import cryptoRoutes from './routes/crypto.routes';
import portfolioRoutes from './routes/portfolio.routes';
import watchlistRoutes from './routes/watchlist.routes';
import tradingRoutes from './routes/trading.routes';
import priceRoutes from './routes/price.routes';
import bvcRoutes from './routes/bvc.routes';
import opcvmRoutes from './routes/opcvm.routes';
import socialRoutes from './routes/social.routes';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Prisma Client - TEMPORARY: Disabled until adapter is configured
// Using the centralized prisma instance from utils/prisma.ts
import { prisma } from './utils/prisma';

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/bvc', bvcRoutes);
app.use('/api/opcvm', opcvmRoutes);
app.use('/api/social', socialRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 CORS origin: ${process.env.CORS_ORIGIN}`);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');

  server.close(async () => {
    console.log('✅ HTTP server closed');

    // Only disconnect if prisma is available
    if (prisma) {
      await prisma.$disconnect();
      console.log('✅ Database connection closed');
    } else {
      console.log('⚠️  No database connection to close (Prisma disabled)');
    }

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;
