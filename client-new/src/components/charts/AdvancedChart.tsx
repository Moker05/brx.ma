import { useEffect, useMemo, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData, HistogramData, LineData, MouseEventParams } from 'lightweight-charts';
import * as indicators from '../../utils/indicators';

interface AdvancedChartProps {
  data: CandlestickData[];
  height?: number;
  symbol?: string;
}

type ChartMode = 'candles' | 'area' | 'line';
type DrawingMode = 'none' | 'horizontal' | 'trend';
type TabType = 'chart' | 'indicators' | 'settings';

type Drawing =
  | { type: 'horizontal'; price: number }
  | { type: 'trend'; points: { time: number; price: number }[] };

interface IndicatorState {
  sma20: boolean;
  sma50: boolean;
  ema12: boolean;
  ema26: boolean;
  bollinger: boolean;
  rsi: boolean;
  macd: boolean;
  stochastic: boolean;
  atr: boolean;
  ichimoku: boolean;
  parabolicSAR: boolean;
  williamsR: boolean;
  cci: boolean;
  volume: boolean;
}

const formatNumber = (value?: number, digits = 2) =>
  value === undefined ? '--' : value.toLocaleString('fr-FR', { maximumFractionDigits: digits, minimumFractionDigits: digits });

export const AdvancedChart = ({ data, height = 500, symbol = 'ATW' }: AdvancedChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const indicatorRefs = useRef<Map<string, ISeriesApi<'Line'>>>(new Map());

  const [mode, setMode] = useState<ChartMode>('candles');
  const [activeTab, setActiveTab] = useState<TabType>('chart');
  const [fullscreen, setFullscreen] = useState(false);
  const [hover, setHover] = useState<{ price: number; open: number; high: number; low: number; close: number; volume?: number; time: number | string } | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [pendingTrend, setPendingTrend] = useState<{ time: number; price: number }[]>([]);

  const [indicatorsEnabled, setIndicatorsEnabled] = useState<IndicatorState>({
    sma20: false,
    sma50: false,
    ema12: false,
    ema26: false,
    bollinger: false,
    rsi: false,
    macd: false,
    stochastic: false,
    atr: false,
    ichimoku: false,
    parabolicSAR: false,
    williamsR: false,
    cci: false,
    volume: true,
  });

  const candles = useMemo(() => data || [], [data]);

  const resizeOverlay = () => {
    if (!overlayRef.current || !containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    overlayRef.current.width = clientWidth;
    overlayRef.current.height = clientHeight;
  };

  const drawOverlay = () => {
    if (!overlayRef.current || !chartRef.current || !candleSeriesRef.current) return;
    const ctx = overlayRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

    const timeScale = chartRef.current.timeScale();
    const priceScale = candleSeriesRef.current.priceScale();

    const priceToY = (price: number) => priceScale.priceToCoordinate(price) ?? 0;
    const timeToX = (time: number) => timeScale.timeToCoordinate(time as any) ?? 0;

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#7cddff';

    drawings.forEach((d) => {
      if (d.type === 'horizontal') {
        const y = priceToY(d.price);
        ctx.strokeStyle = '#7cddff';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(overlayRef.current!.width, y);
        ctx.stroke();
      } else if (d.type === 'trend' && d.points.length === 2) {
        const [p1, p2] = d.points;
        ctx.strokeStyle = '#ffbe3c';
        ctx.beginPath();
        ctx.moveTo(timeToX(p1.time), priceToY(p1.price));
        ctx.lineTo(timeToX(p2.time), priceToY(p2.price));
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: '#1c2433' },
        horzLines: { color: '#1c2433' },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1f2937',
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#18d7a5',
      downColor: '#f87171',
      borderUpColor: '#18d7a5',
      borderDownColor: '#f87171',
      wickUpColor: '#18d7a5',
      wickDownColor: '#f87171',
    });

    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(62, 227, 153, 0.45)',
      bottomColor: 'rgba(62, 227, 153, 0.05)',
      lineColor: '#3ee399',
      lineWidth: 2,
      priceScaleId: 'right',
      visible: false,
    });

    const lineSeries = chart.addLineSeries({
      color: '#3ee399',
      lineWidth: 2,
      priceScaleId: 'right',
      visible: false,
    });

    const volumeSeries = chart.addHistogramSeries({
      color: 'rgba(148, 163, 184, 0.6)',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || (!param.seriesData.size && !param.point)) {
        setHover(null);
        return;
      }
      const candleData = param.seriesData.get(candleSeries);
      const volumeData = param.seriesData.get(volumeSeries);
      if (candleData && typeof candleData === 'object') {
        setHover({
          price: (candleData as any).close,
          open: (candleData as any).open,
          high: (candleData as any).high,
          low: (candleData as any).low,
          close: (candleData as any).close,
          volume: (volumeData as any)?.value,
          time: param.time as any,
        });
      }
    });

    chart.subscribeClick((param: MouseEventParams) => {
      if (drawingMode === 'none') return;
      if (!param.time || !param.point) return;
      const price = candleSeries.priceScale().coordinateToPrice(param.point.y);
      if (price === undefined || price === null) return;
      const time = param.time as number;

      if (drawingMode === 'horizontal') {
        setDrawings((prev) => [...prev, { type: 'horizontal', price }]);
      }

      if (drawingMode === 'trend') {
        const nextPoints = [...pendingTrend, { time, price }];
        if (nextPoints.length === 2) {
          setDrawings((prev) => [...prev, { type: 'trend', points: nextPoints }]);
          setPendingTrend([]);
        } else {
          setPendingTrend(nextPoints);
        }
      }
    });

    const handleResize = () => {
      if (containerRef.current && chart) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
      resizeOverlay();
      drawOverlay();
    };

    window.addEventListener('resize', handleResize);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    areaSeriesRef.current = areaSeries;
    lineSeriesRef.current = lineSeries;
    volumeSeriesRef.current = volumeSeries;

    resizeOverlay();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height, drawingMode]);

  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current || !areaSeriesRef.current || !volumeSeriesRef.current) return;
    if (!candles.length) return;

    candleSeriesRef.current.setData(candles);
    areaSeriesRef.current.setData(
      candles.map((c) => ({
        time: c.time,
        value: c.close,
      }))
    );
    lineSeriesRef.current?.setData(
      candles.map((c) => ({
        time: c.time,
        value: c.close,
      }))
    );
    volumeSeriesRef.current.setData(
      candles.map((c: any) => ({
        time: c.time,
        value: c.volume ?? 0,
        color: c.close >= c.open ? 'rgba(24, 215, 165, 0.45)' : 'rgba(248, 113, 113, 0.45)',
      })) as HistogramData[]
    );

    const closes = candles.map((c) => c.close);
    const times = candles.map((c) => c.time);

    // Helper function to create or get indicator series
    const getOrCreateIndicator = (key: string, color: string): ISeriesApi<'Line'> => {
      if (!indicatorRefs.current.has(key)) {
        const series = chartRef.current!.addLineSeries({
          color,
          lineWidth: 2,
          priceScaleId: 'right',
        });
        indicatorRefs.current.set(key, series);
      }
      return indicatorRefs.current.get(key)!;
    };

    // SMA 20
    if (indicatorsEnabled.sma20) {
      const series = getOrCreateIndicator('sma20', '#60a5fa');
      const values = indicators.calculateSMA(closes, 20)
        .map((val, idx) => (val ? { time: times[idx], value: val } : null))
        .filter(Boolean) as LineData[];
      series.setData(values);
      series.applyOptions({ visible: true });
    } else if (indicatorRefs.current.has('sma20')) {
      indicatorRefs.current.get('sma20')!.applyOptions({ visible: false });
    }

    // SMA 50
    if (indicatorsEnabled.sma50) {
      const series = getOrCreateIndicator('sma50', '#3b82f6');
      const values = indicators.calculateSMA(closes, 50)
        .map((val, idx) => (val ? { time: times[idx], value: val } : null))
        .filter(Boolean) as LineData[];
      series.setData(values);
      series.applyOptions({ visible: true });
    } else if (indicatorRefs.current.has('sma50')) {
      indicatorRefs.current.get('sma50')!.applyOptions({ visible: false });
    }

    // EMA 12
    if (indicatorsEnabled.ema12) {
      const series = getOrCreateIndicator('ema12', '#f59e0b');
      const values = indicators.calculateEMA(closes, 12)
        .map((val, idx) => (val ? { time: times[idx], value: val } : null))
        .filter(Boolean) as LineData[];
      series.setData(values);
      series.applyOptions({ visible: true });
    } else if (indicatorRefs.current.has('ema12')) {
      indicatorRefs.current.get('ema12')!.applyOptions({ visible: false });
    }

    // EMA 26
    if (indicatorsEnabled.ema26) {
      const series = getOrCreateIndicator('ema26', '#d97706');
      const values = indicators.calculateEMA(closes, 26)
        .map((val, idx) => (val ? { time: times[idx], value: val } : null))
        .filter(Boolean) as LineData[];
      series.setData(values);
      series.applyOptions({ visible: true });
    } else if (indicatorRefs.current.has('ema26')) {
      indicatorRefs.current.get('ema26')!.applyOptions({ visible: false });
    }

    // Bollinger Bands
    if (indicatorsEnabled.bollinger) {
      const bb = indicators.calculateBollingerBands(closes, 20, 2);
      const upperSeries = getOrCreateIndicator('bb_upper', '#8b5cf6');
      const middleSeries = getOrCreateIndicator('bb_middle', '#a78bfa');
      const lowerSeries = getOrCreateIndicator('bb_lower', '#8b5cf6');

      upperSeries.setData(
        bb.upper.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );
      middleSeries.setData(
        bb.middle.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );
      lowerSeries.setData(
        bb.lower.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );

      upperSeries.applyOptions({ visible: true });
      middleSeries.applyOptions({ visible: true });
      lowerSeries.applyOptions({ visible: true });
    } else {
      ['bb_upper', 'bb_middle', 'bb_lower'].forEach((key) => {
        if (indicatorRefs.current.has(key)) {
          indicatorRefs.current.get(key)!.applyOptions({ visible: false });
        }
      });
    }

    // Ichimoku Cloud
    if (indicatorsEnabled.ichimoku) {
      const ichimoku = indicators.calculateIchimoku(candles);

      const tenkanSeries = getOrCreateIndicator('ichimoku_tenkan', '#f43f5e');
      const kijunSeries = getOrCreateIndicator('ichimoku_kijun', '#3b82f6');
      const senkouASeries = getOrCreateIndicator('ichimoku_senkouA', '#22c55e');
      const senkouBSeries = getOrCreateIndicator('ichimoku_senkouB', '#ef4444');
      const chikouSeries = getOrCreateIndicator('ichimoku_chikou', '#a855f7');

      tenkanSeries.setData(
        ichimoku.tenkan.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );
      kijunSeries.setData(
        ichimoku.kijun.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );
      senkouASeries.setData(
        ichimoku.senkouA.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );
      senkouBSeries.setData(
        ichimoku.senkouB.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );
      chikouSeries.setData(
        ichimoku.chikou.map((val, idx) => (val ? { time: times[idx], value: val } : null)).filter(Boolean) as LineData[]
      );

      [tenkanSeries, kijunSeries, senkouASeries, senkouBSeries, chikouSeries].forEach((s) =>
        s.applyOptions({ visible: true })
      );
    } else {
      ['ichimoku_tenkan', 'ichimoku_kijun', 'ichimoku_senkouA', 'ichimoku_senkouB', 'ichimoku_chikou'].forEach((key) => {
        if (indicatorRefs.current.has(key)) {
          indicatorRefs.current.get(key)!.applyOptions({ visible: false });
        }
      });
    }

    // Parabolic SAR
    if (indicatorsEnabled.parabolicSAR) {
      const series = getOrCreateIndicator('psar', '#ec4899');
      const values = indicators.calculateParabolicSAR(candles)
        .map((val, idx) => (val ? { time: times[idx], value: val } : null))
        .filter(Boolean) as LineData[];
      series.setData(values);
      series.applyOptions({ visible: true });
    } else if (indicatorRefs.current.has('psar')) {
      indicatorRefs.current.get('psar')!.applyOptions({ visible: false });
    }

    // ATR
    if (indicatorsEnabled.atr) {
      const series = getOrCreateIndicator('atr', '#14b8a6');
      const values = indicators.calculateATR(candles, 14)
        .map((val, idx) => (val ? { time: times[idx], value: val } : null))
        .filter(Boolean) as LineData[];
      series.setData(values);
      series.applyOptions({ visible: true });
    } else if (indicatorRefs.current.has('atr')) {
      indicatorRefs.current.get('atr')!.applyOptions({ visible: false });
    }

    chartRef.current.timeScale().fitContent();
    drawOverlay();
  }, [candles, indicatorsEnabled]);

  useEffect(() => {
    if (!candleSeriesRef.current || !areaSeriesRef.current || !lineSeriesRef.current) return;
    candleSeriesRef.current.applyOptions({ visible: mode === 'candles' });
    areaSeriesRef.current.applyOptions({ visible: mode === 'area' });
    lineSeriesRef.current.applyOptions({ visible: mode === 'line' });
  }, [mode]);

  useEffect(() => {
    drawOverlay();
  }, [drawings]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const toggleIndicator = (key: keyof IndicatorState) => {
    setIndicatorsEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="badge badge-outline">{symbol}</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-xs" onClick={toggleFullscreen}>
            {fullscreen ? 'Fermer plein écran' : 'Plein écran'}
          </button>
        </div>
      </div>

      {/* Chart Controls with Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Chart Type Dropdown */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
            <span>Type de graphique</span>
            <span className="badge badge-sm badge-primary">
              {mode === 'candles' ? 'Chandeliers' : mode === 'area' ? 'Aire' : 'Ligne'}
            </span>
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-48 border border-white/5 mt-1 z-50">
            <li>
              <button
                className={mode === 'candles' ? 'active' : ''}
                onClick={() => {
                  setMode('candles');
                  document.activeElement?.blur();
                }}
              >
                Chandeliers
              </button>
            </li>
            <li>
              <button
                className={mode === 'area' ? 'active' : ''}
                onClick={() => {
                  setMode('area');
                  document.activeElement?.blur();
                }}
              >
                Aire
              </button>
            </li>
            <li>
              <button
                className={mode === 'line' ? 'active' : ''}
                onClick={() => {
                  setMode('line');
                  document.activeElement?.blur();
                }}
              >
                Ligne
              </button>
            </li>
          </ul>
        </div>

        {/* Indicators Dropdown */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
            <span>Indicateurs techniques</span>
            <span className="badge badge-sm badge-primary">
              {Object.values(indicatorsEnabled).filter(Boolean).length - 1}
            </span>
          </label>
          <div tabIndex={0} className="dropdown-content bg-base-200 rounded-box border border-white/5 mt-1 z-50 shadow-xl">
            <div className="p-4 max-h-[400px] overflow-y-auto w-[600px]">
              <div className="grid grid-cols-2 gap-6">
                {/* Moving Averages */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-3">Moyennes Mobiles</h4>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.sma20}
                      onChange={() => toggleIndicator('sma20')}
                    />
                    <span className="text-sm flex-1">SMA (20)</span>
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.sma50}
                      onChange={() => toggleIndicator('sma50')}
                    />
                    <span className="text-sm flex-1">SMA (50)</span>
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.ema12}
                      onChange={() => toggleIndicator('ema12')}
                    />
                    <span className="text-sm flex-1">EMA (12)</span>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.ema26}
                      onChange={() => toggleIndicator('ema26')}
                    />
                    <span className="text-sm flex-1">EMA (26)</span>
                    <div className="w-3 h-3 rounded-full bg-amber-700"></div>
                  </label>

                  <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-3 mt-4">Bandes & Nuages</h4>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.bollinger}
                      onChange={() => toggleIndicator('bollinger')}
                    />
                    <span className="text-sm flex-1">Bollinger Bands</span>
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.ichimoku}
                      onChange={() => toggleIndicator('ichimoku')}
                    />
                    <span className="text-sm font-semibold flex-1">Ichimoku Cloud</span>
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  </label>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-3">Autres</h4>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.parabolicSAR}
                      onChange={() => toggleIndicator('parabolicSAR')}
                    />
                    <span className="text-sm flex-1">Parabolic SAR</span>
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.atr}
                      onChange={() => toggleIndicator('atr')}
                    />
                    <span className="text-sm flex-1">ATR (14)</span>
                    <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                  </label>

                  <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-3 mt-4">Oscillateurs</h4>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.rsi}
                      onChange={() => toggleIndicator('rsi')}
                    />
                    <span className="text-sm flex-1">RSI (14)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.macd}
                      onChange={() => toggleIndicator('macd')}
                    />
                    <span className="text-sm flex-1">MACD</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.stochastic}
                      onChange={() => toggleIndicator('stochastic')}
                    />
                    <span className="text-sm flex-1">Stochastique</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.williamsR}
                      onChange={() => toggleIndicator('williamsR')}
                    />
                    <span className="text-sm flex-1">Williams %R</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={indicatorsEnabled.cci}
                      onChange={() => toggleIndicator('cci')}
                    />
                    <span className="text-sm flex-1">CCI (20)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Dropdown */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
            <span>Paramètres</span>
          </label>
          <div tabIndex={0} className="dropdown-content menu p-3 shadow bg-base-200 rounded-box w-64 border border-white/5 mt-1 z-50">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-2">Outils de dessin</h4>
                <div className="space-y-1">
                  <button
                    className={`btn btn-xs w-full justify-start ${drawingMode === 'none' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => {
                      setDrawingMode('none');
                      document.activeElement?.blur();
                    }}
                  >
                    Désactivé
                  </button>
                  <button
                    className={`btn btn-xs w-full justify-start ${drawingMode === 'horizontal' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => {
                      setDrawingMode('horizontal');
                      document.activeElement?.blur();
                    }}
                  >
                    Ligne horizontale
                  </button>
                  <button
                    className={`btn btn-xs w-full justify-start ${drawingMode === 'trend' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => {
                      setDrawingMode('trend');
                      document.activeElement?.blur();
                    }}
                  >
                    Ligne de tendance
                  </button>
                  <button
                    className="btn btn-xs btn-error btn-outline w-full"
                    onClick={() => {
                      setDrawings([]);
                      setPendingTrend([]);
                      document.activeElement?.blur();
                    }}
                  >
                    Effacer tout
                  </button>
                </div>
              </div>
              <div className="divider my-2"></div>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300/50 p-2 rounded">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={indicatorsEnabled.volume}
                  onChange={() => toggleIndicator('volume')}
                />
                <span className="text-sm">Afficher le volume</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl border border-white/5 bg-base-200/60 p-2 glass">
        <div className="absolute inset-x-0 top-2 px-3 text-xs text-base-content/70 flex items-center gap-4 z-10">
          <div className="flex items-center gap-2">
            <span className="text-base-content/60">O</span>
            <span className="text-mono">{formatNumber(hover?.open)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base-content/60">H</span>
            <span className="text-mono">{formatNumber(hover?.high)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base-content/60">L</span>
            <span className="text-mono">{formatNumber(hover?.low)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base-content/60">C</span>
            <span className="text-mono">{formatNumber(hover?.close)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base-content/60">Vol</span>
            <span className="text-mono">{hover?.volume ? hover.volume.toLocaleString('fr-FR') : '--'}</span>
          </div>
        </div>

        <div className="relative z-0">
          <div ref={containerRef} className="relative" style={{ height }} />
          <canvas ref={overlayRef} className="absolute inset-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
