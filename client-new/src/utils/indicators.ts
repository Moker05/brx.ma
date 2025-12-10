// Technical Indicators calculation utilities

import type { CandlestickData } from 'lightweight-charts';

/**
 * Simple Moving Average (SMA)
 */
export const calculateSMA = (values: number[], period: number): (number | null)[] => {
  const result: (number | null)[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    const slice = values.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, v) => sum + v, 0) / period;
    result.push(avg);
  }
  return result;
};

/**
 * Exponential Moving Average (EMA)
 */
export const calculateEMA = (values: number[], period: number): (number | null)[] => {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);
  let ema: number | null = null;

  values.forEach((value, idx) => {
    if (idx === period - 1) {
      const firstSlice = values.slice(0, period);
      ema = firstSlice.reduce((sum, v) => sum + v, 0) / period;
      result.push(ema);
      return;
    }
    if (idx < period - 1 || ema === null) {
      result.push(null);
      return;
    }
    ema = (value - ema) * multiplier + ema;
    result.push(ema);
  });

  return result;
};

/**
 * Bollinger Bands
 */
export const calculateBollingerBands = (
  values: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } => {
  const middle = calculateSMA(values, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < values.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }

    const slice = values.slice(i - period + 1, i + 1);
    const mean = middle[i]!;
    const variance = slice.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / period;
    const std = Math.sqrt(variance);

    upper.push(mean + std * stdDev);
    lower.push(mean - std * stdDev);
  }

  return { upper, middle, lower };
};

/**
 * Relative Strength Index (RSI)
 */
export const calculateRSI = (values: number[], period: number = 14): (number | null)[] => {
  const result: (number | null)[] = [];

  for (let i = 0; i < values.length; i++) {
    if (i < period) {
      result.push(null);
      continue;
    }

    let gains = 0;
    let losses = 0;

    for (let j = i - period + 1; j <= i; j++) {
      const change = values[j] - values[j - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) {
      result.push(100);
      continue;
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    result.push(rsi);
  }

  return result;
};

/**
 * MACD (Moving Average Convergence Divergence)
 */
export const calculateMACD = (
  values: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } => {
  const fastEMA = calculateEMA(values, fastPeriod);
  const slowEMA = calculateEMA(values, slowPeriod);

  const macd: (number | null)[] = fastEMA.map((fast, idx) => {
    const slow = slowEMA[idx];
    if (fast === null || slow === null) return null;
    return fast - slow;
  });

  const macdValues = macd.filter((v) => v !== null) as number[];
  const signalEMA = calculateEMA(macdValues, signalPeriod);

  const signal: (number | null)[] = [];
  let signalIdx = 0;

  for (let i = 0; i < macd.length; i++) {
    if (macd[i] === null) {
      signal.push(null);
    } else {
      signal.push(signalEMA[signalIdx] ?? null);
      signalIdx++;
    }
  }

  const histogram: (number | null)[] = macd.map((m, idx) => {
    const s = signal[idx];
    if (m === null || s === null) return null;
    return m - s;
  });

  return { macd, signal, histogram };
};

/**
 * Stochastic Oscillator
 */
export const calculateStochastic = (
  candles: CandlestickData[],
  kPeriod: number = 14,
  dPeriod: number = 3
): { k: (number | null)[]; d: (number | null)[] } => {
  const k: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < kPeriod - 1) {
      k.push(null);
      continue;
    }

    const slice = candles.slice(i - kPeriod + 1, i + 1);
    const highest = Math.max(...slice.map((c) => c.high));
    const lowest = Math.min(...slice.map((c) => c.low));
    const current = candles[i].close;

    if (highest === lowest) {
      k.push(50);
      continue;
    }

    const kValue = ((current - lowest) / (highest - lowest)) * 100;
    k.push(kValue);
  }

  const kValues = k.filter((v) => v !== null) as number[];
  const dSMA = calculateSMA(kValues, dPeriod);

  const d: (number | null)[] = [];
  let dIdx = 0;

  for (let i = 0; i < k.length; i++) {
    if (k[i] === null) {
      d.push(null);
    } else {
      d.push(dSMA[dIdx] ?? null);
      dIdx++;
    }
  }

  return { k, d };
};

/**
 * Average True Range (ATR)
 */
export const calculateATR = (candles: CandlestickData[], period: number = 14): (number | null)[] => {
  const tr: number[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      tr.push(candles[i].high - candles[i].low);
      continue;
    }

    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const trueRange = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    tr.push(trueRange);
  }

  return calculateSMA(tr, period);
};

/**
 * Ichimoku Cloud
 */
export const calculateIchimoku = (candles: CandlestickData[]): {
  tenkan: (number | null)[];
  kijun: (number | null)[];
  senkouA: (number | null)[];
  senkouB: (number | null)[];
  chikou: (number | null)[];
} => {
  const tenkan: (number | null)[] = [];
  const kijun: (number | null)[] = [];
  const senkouA: (number | null)[] = [];
  const senkouB: (number | null)[] = [];
  const chikou: (number | null)[] = [];

  const calculateDonchian = (period: number, index: number) => {
    if (index < period - 1) return null;
    const slice = candles.slice(index - period + 1, index + 1);
    const high = Math.max(...slice.map((c) => c.high));
    const low = Math.min(...slice.map((c) => c.low));
    return (high + low) / 2;
  };

  for (let i = 0; i < candles.length; i++) {
    // Tenkan-sen (Conversion Line): (9-period high + 9-period low) / 2
    tenkan.push(calculateDonchian(9, i));

    // Kijun-sen (Base Line): (26-period high + 26-period low) / 2
    kijun.push(calculateDonchian(26, i));

    // Senkou Span A: (Tenkan-sen + Kijun-sen) / 2, shifted 26 periods ahead
    const t = tenkan[i];
    const k = kijun[i];
    senkouA.push(t !== null && k !== null ? (t + k) / 2 : null);

    // Senkou Span B: (52-period high + 52-period low) / 2, shifted 26 periods ahead
    senkouB.push(calculateDonchian(52, i));

    // Chikou Span: Close price, shifted 26 periods back
    chikou.push(candles[i].close);
  }

  return { tenkan, kijun, senkouA, senkouB, chikou };
};

/**
 * Parabolic SAR
 */
export const calculateParabolicSAR = (
  candles: CandlestickData[],
  acceleration: number = 0.02,
  maximum: number = 0.2
): (number | null)[] => {
  const result: (number | null)[] = [];
  if (candles.length < 2) return result;

  let sar = candles[0].low;
  let ep = candles[0].high;
  let af = acceleration;
  let isUptrend = true;

  result.push(sar);

  for (let i = 1; i < candles.length; i++) {
    const candle = candles[i];

    // Calculate SAR
    sar = sar + af * (ep - sar);

    if (isUptrend) {
      if (candle.low < sar) {
        isUptrend = false;
        sar = ep;
        ep = candle.low;
        af = acceleration;
      } else {
        if (candle.high > ep) {
          ep = candle.high;
          af = Math.min(af + acceleration, maximum);
        }
      }
    } else {
      if (candle.high > sar) {
        isUptrend = true;
        sar = ep;
        ep = candle.high;
        af = acceleration;
      } else {
        if (candle.low < ep) {
          ep = candle.low;
          af = Math.min(af + acceleration, maximum);
        }
      }
    }

    result.push(sar);
  }

  return result;
};

/**
 * Williams %R
 */
export const calculateWilliamsR = (candles: CandlestickData[], period: number = 14): (number | null)[] => {
  const result: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    const slice = candles.slice(i - period + 1, i + 1);
    const highest = Math.max(...slice.map((c) => c.high));
    const lowest = Math.min(...slice.map((c) => c.low));
    const close = candles[i].close;

    if (highest === lowest) {
      result.push(-50);
      continue;
    }

    const wr = ((highest - close) / (highest - lowest)) * -100;
    result.push(wr);
  }

  return result;
};

/**
 * Commodity Channel Index (CCI)
 */
export const calculateCCI = (candles: CandlestickData[], period: number = 20): (number | null)[] => {
  const result: (number | null)[] = [];
  const typicalPrices = candles.map((c) => (c.high + c.low + c.close) / 3);

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    const slice = typicalPrices.slice(i - period + 1, i + 1);
    const sma = slice.reduce((sum, v) => sum + v, 0) / period;
    const meanDeviation = slice.reduce((sum, v) => sum + Math.abs(v - sma), 0) / period;

    if (meanDeviation === 0) {
      result.push(0);
      continue;
    }

    const cci = (typicalPrices[i] - sma) / (0.015 * meanDeviation);
    result.push(cci);
  }

  return result;
};
