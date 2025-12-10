import cron from 'node-cron';
import { scrapeStockAnalysis } from '../services/stockAnalysisScraperService';

let task: cron.ScheduledTask | null = null;

export function startBVCPrewarmJob() {
  // Run immediately once to pre-warm cache
  (async () => {
    try {
      console.log('🔁 Pre-warming BVC cache (initial run)');
      const data = await scrapeStockAnalysis();
      console.log(`🔁 Pre-warm fetched ${data.length} items`);
    } catch (err) {
      console.error('Pre-warm failed:', (err as Error).message);
    }
  })();

  // Schedule every 15 minutes
  task = cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('🔁 Scheduled pre-warm: fetching BVC data');
      const data = await scrapeStockAnalysis();
      console.log(`🔁 Scheduled pre-warm fetched ${data.length} items`);
    } catch (err) {
      console.error('Scheduled pre-warm failed:', (err as Error).message);
    }
  });

  task.start();
  return task;
}

export function stopBVCPrewarmJob() {
  if (task) {
    task.stop();
    task = null;
  }
}
