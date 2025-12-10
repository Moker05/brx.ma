import { useEffect, useRef, useState } from 'react';
import { BVC_STOCKS } from '../../data/bvc-tradingview-mapping';

interface TickerTapeProps {
  onStockClick: (tradingViewSymbol: string, ticker: string) => void;
}

export function TradingViewTickerTape({ onStockClick }: TickerTapeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const widgetId = useRef(`tradingview_ticker_${Math.random().toString(36).slice(2, 11)}`);

  useEffect(() => {
    let mounted = true;

    const loadWidget = () => {
      try {
        if (!containerRef.current) return;

        // Clear any previous content
        containerRef.current.innerHTML = '';

        // Create the widget container structure
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container';
        widgetContainer.style.width = '100%';
        widgetContainer.style.height = '60px';

        const widgetContent = document.createElement('div');
        widgetContent.className = 'tradingview-widget-container__widget';
        widgetContainer.appendChild(widgetContent);

        // Add copyright (required by TradingView)
        const copyright = document.createElement('div');
        copyright.className = 'tradingview-widget-copyright';
        copyright.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';
        widgetContainer.appendChild(copyright);

        // Create and configure the script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;

        // Select top 25 stocks for better performance
        const symbols = BVC_STOCKS.slice(0, 25).map((s) => ({
          proName: s.tradingViewSymbol,
          title: `${s.name}`
        }));

        const config = {
          symbols: symbols,
          showSymbolLogo: true,
          isTransparent: false,
          displayMode: 'adaptive',
          colorTheme: 'dark',
          locale: 'fr'
        };

        script.innerHTML = JSON.stringify(config);
        widgetContent.appendChild(script);
        containerRef.current.appendChild(widgetContainer);

        // Add click handler after widget loads (delay to ensure DOM is ready)
        setTimeout(() => {
          if (!mounted || !containerRef.current) return;

          const handleClick = (ev: MouseEvent) => {
            const target = ev.target as HTMLElement;
            if (!target) return;

            // Try to find the stock symbol in the clicked element or its parents
            let el: HTMLElement | null = target;
            while (el && el !== containerRef.current) {
              const text = el.innerText?.trim() || '';

              // Try to match by stock name or ticker
              const found = BVC_STOCKS.find((s) =>
                text.includes(s.name) ||
                text.includes(s.ticker) ||
                text.includes(s.tradingViewSymbol.split(':')[1] || '')
              );

              if (found) {
                onStockClick(found.tradingViewSymbol, found.ticker);
                return;
              }

              el = el.parentElement;
            }
          };

          containerRef.current.addEventListener('click', handleClick);
        }, 3000);

      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Erreur lors du chargement du Ticker Tape');
        }
      }
    };

    loadWidget();

    return () => {
      mounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onStockClick]);

  return (
    <div className="w-full">
      {error && <div className="alert alert-error text-sm p-2">{error}</div>}
      <div ref={containerRef} className="w-full" id={widgetId.current} />
    </div>
  );
}

export default TradingViewTickerTape;
