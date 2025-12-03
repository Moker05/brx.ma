const markets = [
  { symbol: 'ATW', name: 'Attijariwafa Bank', price: 485.5, change: 0.49, volume: '1.2M', sector: 'Banques' },
  { symbol: 'BCP', name: 'BCP', price: 265.0, change: 1.34, volume: '950K', sector: 'Banques' },
  { symbol: 'IAM', name: 'Maroc Telecom', price: 125.8, change: -0.94, volume: '740K', sector: 'Télécom' },
  { symbol: 'CIH', name: 'CIH Bank', price: 315.2, change: -0.88, volume: '500K', sector: 'Banques' },
  { symbol: 'ADH', name: 'Addoha', price: 13.4, change: 2.12, volume: '2.4M', sector: 'Immobilier' },
];

const sectors = [
  { name: 'Banques', change: 0.72 },
  { name: 'Télécom', change: -0.12 },
  { name: 'Immobilier', change: 0.34 },
  { name: 'Distribution', change: 0.18 },
  { name: 'Énergie', change: 1.12 },
];

const formatChange = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

export const Markets = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70 font-semibold">Marchés</p>
          <h1 className="text-3xl font-bold font-display">Actions BVC</h1>
          <p className="text-base-content/70">Vue type investing.com : watchlist, movers, secteur.</p>
        </div>
        <div className="join">
          <button className="btn btn-ghost btn-sm join-item">Tous</button>
          <button className="btn btn-ghost btn-sm join-item">Gainers</button>
          <button className="btn btn-ghost btn-sm join-item">Losers</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Watchlist</h3>
            <span className="text-xs text-base-content/60">Dernier + variation + volume</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Symbole</th>
                  <th>Nom</th>
                  <th className="text-right">Dernier</th>
                  <th className="text-right">Var%</th>
                  <th className="text-right">Volume</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m) => (
                  <tr key={m.symbol} className="hover">
                    <td className="font-semibold">{m.symbol}</td>
                    <td>{m.name}</td>
                    <td className="text-right text-mono font-semibold">{m.price.toFixed(2)}</td>
                    <td className={`text-right font-semibold ${m.change >= 0 ? 'text-success' : 'text-error'}`}>{formatChange(m.change)}</td>
                    <td className="text-right text-base-content/70">{m.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Vue secteur</h3>
              <span className="text-xs text-base-content/60">Heatmap</span>
            </div>
            <div className="space-y-2">
              {sectors.map((s) => {
                const positive = s.change >= 0;
                const color = positive ? 'text-success' : 'text-error';
                return (
                  <div key={s.name} className="flex items-center justify-between p-2 rounded-lg bg-base-300/50">
                    <div className="font-semibold">{s.name}</div>
                    <div className={`text-sm ${color}`}>{formatChange(s.change)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Moteurs du marché</h3>
              <span className="text-xs text-base-content/60">Gainers/Losers</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                {markets
                  .filter((m) => m.change > 0)
                  .slice(0, 2)
                  .map((m) => (
                    <div key={m.symbol} className="p-2 rounded-lg bg-success/10 border border-success/20">
                      <div className="font-semibold">{m.symbol}</div>
                      <div className="text-xs text-base-content/60">{m.name}</div>
                      <div className="text-success text-sm">{formatChange(m.change)}</div>
                    </div>
                  ))}
              </div>
              <div className="space-y-2">
                {markets
                  .filter((m) => m.change < 0)
                  .slice(0, 2)
                  .map((m) => (
                    <div key={m.symbol} className="p-2 rounded-lg bg-error/10 border border-error/20">
                      <div className="font-semibold">{m.symbol}</div>
                      <div className="text-xs text-base-content/60">{m.name}</div>
                      <div className="text-error text-sm">{formatChange(m.change)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
