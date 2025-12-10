// React default import not required with the automatic JSX runtime
import { useParams, Link } from 'react-router-dom';
import TradingViewChart from '../components/charts/TradingViewChart';
import { BVC_STOCKS } from '../data/bvc-tradingview-mapping';

export function StockDetail() {
  const { ticker } = useParams();
  // Try to find by ticker or by tradingViewSymbol suffix
  const stock = BVC_STOCKS.find((s) => s.ticker === ticker) || BVC_STOCKS.find((s) => s.tradingViewSymbol.endsWith(`:${ticker}`));

  if (!stock) return <div>Action introuvable</div>;

  const tvSymbol = stock.tradingViewSymbol;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{stock.name}</h1>
          <div className="text-sm text-base-content/60">{stock.ticker} • {stock.sector}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn">Acheter</button>
          <button className="btn btn-ghost">Ajouter au portefeuille</button>
        </div>
      </div>

      <div className="card p-4">
        <TradingViewChart symbol={tvSymbol} height={600} />
      </div>

      <div className="card p-4">
        <div className="tabs">
          <a className="tab tab-bordered tab-active">Vue d'ensemble</a>
          <a className="tab tab-bordered">Analyse technique</a>
          <a className="tab tab-bordered">Actualités</a>
          <Link to={`/stock/${stock.ticker}/discussion`} className="tab tab-bordered">Discussion</Link>
        </div>
        <div className="mt-4">
          <p>Informations générales et indicateurs pour {stock.name}.</p>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;
