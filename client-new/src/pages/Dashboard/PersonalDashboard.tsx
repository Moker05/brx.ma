import { getUserDashboardData } from '../../services/userDataService';
import { useAuth } from '../../context/AuthContext';
// icons removed (unused)

const formatChange = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export const PersonalDashboard = () => {
  const { user } = useAuth();
  const data = getUserDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 font-semibold">Espace client</p>
          <h1 className="text-3xl font-bold font-display">Bienvenue{user?.email ? `, ${user.email}` : ''}</h1>
          <p className="text-base-content/70">Portefeuille, watchlist, indices MASI/MADEX et crypto en un coup d'œil.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-sm text-base-content/60">Solde disponible</div>
          <div className="text-2xl font-bold">{data.balance.toLocaleString('fr-FR')} MAD</div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-sm text-base-content/60">Valeur portefeuille</div>
          <div className="text-2xl font-bold">{data.portfolioValue.toLocaleString('fr-FR')} MAD</div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-sm text-base-content/60">P&L</div>
          <div className={`text-2xl font-bold ${data.pnl >= 0 ? 'text-success' : 'text-error'}`}>
            {data.pnl >= 0 ? '+' : ''}{data.pnl.toLocaleString('fr-FR')} MAD
          </div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-sm text-base-content/60">P&L %</div>
          <div className={`text-2xl font-bold ${data.pnlPercent >= 0 ? 'text-success' : 'text-error'}`}>
            {formatChange(data.pnlPercent)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Indices</h3>
            <span className="text-xs text-base-content/60">MASI/MADEX</span>
          </div>
          <div className="space-y-2">
            {data.indices.map((idx) => (
              <div key={idx.label} className="flex items-center justify-between p-2 rounded-lg bg-base-300/50">
                <div>
                  <div className="font-semibold">{idx.label}</div>
                  <div className="text-sm text-base-content/60">{idx.value.toLocaleString('fr-FR')}</div>
                </div>
                <div className={`text-sm font-semibold ${idx.change >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatChange(idx.change)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Crypto</h3>
            <span className="text-xs text-base-content/60">Spot</span>
          </div>
          <div className="space-y-2">
            {data.crypto.map((c) => (
              <div key={c.symbol} className="flex items-center justify-between p-2 rounded-lg bg-base-300/50">
                <div className="font-semibold">{c.symbol}</div>
                <div className="text-right">
                  <div className="text-mono font-semibold">{c.price.toLocaleString('fr-FR')}</div>
                  <div className={`text-sm ${c.change >= 0 ? 'text-success' : 'text-error'}`}>{formatChange(c.change)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Watchlist</h3>
            <span className="text-xs text-base-content/60">BVC + Crypto</span>
          </div>
          <div className="space-y-2">
            {data.watchlist.map((w) => (
              <div key={w.symbol} className="flex items-center justify-between p-2 rounded-lg bg-base-300/50">
                <div>
                  <div className="font-semibold">{w.symbol}</div>
                  <div className="text-xs text-base-content/60">{w.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-mono font-semibold">{w.price.toLocaleString('fr-FR')}</div>
                  <div className={`text-sm ${w.change >= 0 ? 'text-success' : 'text-error'}`}>{formatChange(w.change)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Portefeuille</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="text-right">Quantité</th>
                <th className="text-right">PM</th>
                <th className="text-right">Cours</th>
                <th className="text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {data.positions.map((p) => {
                const pnl = (p.currentPrice - p.avgPrice) * p.quantity;
                const pnlPct = ((p.currentPrice - p.avgPrice) / p.avgPrice) * 100;
                const positive = pnl >= 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="font-semibold">{p.symbol}</div>
                      <div className="text-xs text-base-content/60">{p.name}</div>
                    </td>
                    <td className="text-right">{p.quantity}</td>
                    <td className="text-right text-mono">{p.avgPrice.toFixed(2)}</td>
                    <td className="text-right text-mono">{p.currentPrice.toFixed(2)}</td>
                    <td className={`text-right font-semibold ${positive ? 'text-success' : 'text-error'}`}>
                      {positive ? '+' : ''}{pnl.toFixed(2)} ({formatChange(pnlPct)})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Historique achats/ventes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Symbole</th>
                <th className="text-right">Quantité</th>
                <th className="text-right">Prix</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((t) => (
                <tr key={t.id}>
                  <td className="text-sm">{new Date(t.timestamp).toLocaleString('fr-FR')}</td>
                  <td>
                    <span className={`badge ${t.type === 'BUY' ? 'badge-success' : 'badge-error'}`}>{t.type}</span>
                  </td>
                  <td className="font-semibold">{t.symbol}</td>
                  <td className="text-right">{t.quantity}</td>
                  <td className="text-right text-mono">{t.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
