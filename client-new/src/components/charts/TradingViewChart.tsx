import { useEffect, useRef, useState } from 'react';

interface TradingViewChartProps {
  symbol: string; // e.g. 'CSEMA:ATW'
  height?: number;
  interval?: string;
  theme?: 'dark' | 'light';
  onLoadingChange?: (loading: boolean) => void;
}

declare global {
  interface Window {
    TradingView?: any;
  }
}

const TV_SCRIPT_SRC = 'https://s3.tradingview.com/tv.js';

export function TradingViewChart({ symbol, height = 500, interval = 'D', theme = 'dark', onLoadingChange }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<any>(null);

  // Load the TradingView script once and create the widget. When `symbol` changes
  // attempt to update the existing widget (preferred) instead of recreating it.
  useEffect(() => {
    let mounted = true;

    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.TradingView) return resolve();
        const script = document.createElement('script');
        script.src = TV_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('TradingView script failed to load'));
        document.head.appendChild(script);
      });
    };

    const createWidget = () => {
      try {
        if (!containerRef.current) throw new Error('Container missing');
        // Clear any previous widget
        containerRef.current.innerHTML = '';

        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          timezone: 'Africa/Casablanca',
          theme: theme === 'dark' ? 'Dark' : 'Light',
          style: '1',
          locale: 'fr',
          container_id: containerRef.current.id,
          allow_symbol_change: true,
          enable_publishing: false,
          hide_side_toolbar: false,
          toolbar_bg: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la création du widget');
        setLoading(false);
      }
    };

    const tryUpdateSymbol = async (newSymbol: string) => {
      if (!widgetRef.current) return false;
      try {
        // Try common APIs in order of availability.
        // 1) activeChart().setSymbol
        const widget = widgetRef.current;
        if (typeof widget.activeChart === 'function') {
          const chart = widget.activeChart();
          if (chart && typeof chart.setSymbol === 'function') {
            chart.setSymbol(newSymbol);
            return true;
          }
        }

        // 2) chart().setSymbol (alternate naming)
        if (typeof (widget as any).chart === 'function') {
          const c = (widget as any).chart();
          if (c && typeof c.setSymbol === 'function') {
            c.setSymbol(newSymbol);
            return true;
          }
        }

        // 3) widget.setSymbol (some integrations expose this)
        if (typeof (widget as any).setSymbol === 'function') {
          (widget as any).setSymbol(newSymbol);
          return true;
        }

        return false;
      } catch (e) {
        return false;
      }
    };

    setLoading(true);
    setError(null);

    loadScript()
      .then(() => {
        if (!mounted) return;
        // If widget doesn't exist yet, create it.
        if (!widgetRef.current) {
          createWidget();
          return;
        }

        // If widget exists and symbol changed, try to update it without recreating.
        tryUpdateSymbol(symbol).then((ok) => {
          if (!ok) {
            // fallback: recreate widget
            try {
              if (containerRef.current) containerRef.current.innerHTML = '';
              widgetRef.current = null;
              createWidget();
            } catch (e) {
              // ignore
            }
          }
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message ?? 'Impossible de charger TradingView');
        setLoading(false);
      });

    return () => {
      mounted = false;
      // Cleanup: try to remove widget DOM
      try {
        if (widgetRef.current && typeof (widgetRef.current as any).remove === 'function') {
          (widgetRef.current as any).remove();
        }
        if (containerRef.current) containerRef.current.innerHTML = '';
      } catch (e) {
        // ignore
      }
    };
  // We intentionally depend on symbol, interval and theme so updates are handled.
  }, [symbol, interval, theme]);

  // Ensure container has a stable unique id (avoid duplication across renders)
  const idRef = useRef<string>(`tv_chart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);

  // notify parent when internal loading state changes
  useEffect(() => {
    if (typeof onLoadingChange === 'function') {
      try {
        onLoadingChange(loading);
      } catch (e) {
        // ignore
      }
    }
  }, [loading, onLoadingChange]);

  return (
    <div className="w-full" style={{ height }}>
      {loading && (
        <div className="w-full h-full flex items-center justify-center bg-base-200">
          <div className="loader" />
        </div>
      )}
      {error && (
        <div className="p-4 bg-error/10 text-error">{error}</div>
      )}
      <div id={idRef.current} ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default TradingViewChart;
