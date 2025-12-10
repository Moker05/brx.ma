/**
 * Application Metrics Collector
 * Tracks performance and usage metrics
 */

interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private maxSize = 1000;

  /**
   * Record a metric
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only last N metrics
    if (this.metrics.length > this.maxSize) {
      this.metrics = this.metrics.slice(-this.maxSize);
    }
  }

  /**
   * Get metrics by name
   */
  getMetrics(name?: string): Metric[] {
    if (!name) return [...this.metrics];
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get average value for a metric
   */
  getAverage(name: string, minutes: number = 5): number {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    const recentMetrics = this.metrics.filter(
      m => m.name === name && m.timestamp >= cutoff
    );

    if (recentMetrics.length === 0) return 0;

    const sum = recentMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / recentMetrics.length;
  }

  /**
   * Get metrics summary
   */
  getSummary(): Record<string, any> {
    const now = Date.now();
    const last5min = new Date(now - 5 * 60 * 1000);
    const last1hour = new Date(now - 60 * 60 * 1000);

    return {
      totalMetrics: this.metrics.length,
      last5Minutes: this.metrics.filter(m => m.timestamp >= last5min).length,
      lastHour: this.metrics.filter(m => m.timestamp >= last1hour).length,
      averageResponseTime: this.getAverage('http.response.time', 5),
      requestsPerMinute: this.getMetrics('http.request').filter(
        m => m.timestamp >= last5min
      ).length / 5,
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

// Singleton instance
export const metrics = new MetricsCollector();

// Helper functions
export const trackHttpRequest = (): void => {
  metrics.record('http.request', 1);
};

export const trackHttpResponse = (statusCode: number, duration: number): void => {
  metrics.record('http.response.time', duration, {
    statusCode: statusCode.toString(),
  });
};

export const trackDatabaseQuery = (duration: number, operation: string): void => {
  metrics.record('db.query.time', duration, { operation });
};

export const trackCacheHit = (hit: boolean): void => {
  metrics.record('cache.hit', hit ? 1 : 0);
};

export const trackError = (type: string): void => {
  metrics.record('error', 1, { type });
};

export default metrics;
