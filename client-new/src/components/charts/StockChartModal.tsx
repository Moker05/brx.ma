import { useEffect } from 'react';
import TradingViewChart from './TradingViewChart';

interface StockChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticker: string;
  stockName: string;
  tradingViewSymbol: string;
}

export function StockChartModal({ isOpen, onClose, ticker, stockName, tradingViewSymbol }: StockChartModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" aria-modal="true" role="dialog" aria-label={`Graphique ${ticker}`}>
      <div className="modal-box w-11/12 max-w-7xl p-0">
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div>
            <div className="text-lg font-bold">{stockName}</div>
            <div className="text-sm text-base-content/60">{ticker} • {tradingViewSymbol}</div>
          </div>
          <div className="flex items-center gap-2">
            <a className="btn btn-ghost btn-sm" href={`/stocks/${ticker}`}>Voir le portefeuille</a>
            <button className="btn btn-circle btn-ghost" onClick={onClose} aria-label="Fermer"><span>✕</span></button>
          </div>
        </div>

        <div className="p-4 bg-base-100">
          <TradingViewChart symbol={tradingViewSymbol} height={600} />
        </div>

        <div className="p-4 border-t border-base-300 flex justify-end gap-3">
          <a className="btn btn-sm btn-outline" href={`/stocks/${ticker}`}>Analyse complète</a>
          <a className="btn btn-sm" href={`/stock/${ticker}/discussion`}>Discussion</a>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

export default StockChartModal;
