import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallet, resetWallet } from '../../services/tradingService';
import type { VirtualWallet } from '../../services/tradingService';
import { getCryptoMarkets } from '../../services/coinGeckoAPI';
import { FiTrendingUp, FiTrendingDown, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

export const VirtualTrading = () => {
  const [wallet, setWallet] = useState<VirtualWallet | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch crypto prices for P&L calculations
  const { data: cryptoMarkets } = useQuery({
    queryKey: ['cryptoMarkets'],
    queryFn: () => getCryptoMarkets('usd', 50, 1),
    refetchInterval: 30000,
  });

  // Load wallet data
  const loadWallet = async () => {
    setLoading(true);
    try {
      // Build price map from crypto markets
      const prices: Record<string, number> = {};
      if (cryptoMarkets) {
        cryptoMarkets.forEach((crypto) => {
          prices[crypto.symbol.toUpperCase()] = crypto.current_price;
        });
      }

      const walletData = await getWallet(prices);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, [cryptoMarkets]);

  const handleReset = () => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir réinitialiser le trading virtuel ? Toutes vos positions et transactions seront perdues.'
      )
    ) {
      resetWallet();
      loadWallet();
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCrypto = (amount: number) => {
    return amount.toFixed(8);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="alert alert-error">
        <span>Erreur lors du chargement du trading virtuel</span>
      </div>
    );
  }

  const { portfolio } = wallet;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trading virtuel</h1>
          <p className="text-base-content/70 mt-1">Solde initial : 100 000 MAD pour tester vos stratégies</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-2" onClick={loadWallet}>
            <FiRefreshCw />
            Actualiser
          </button>
          <button className="btn btn-error btn-outline btn-sm gap-2" onClick={handleReset}>
            <FiTrash2 />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-medium text-base-content/70">Solde disponible</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.availableBalance)} MAD</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-medium text-base-content/70">Valeur investie</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.totalInvested)} MAD</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-medium text-base-content/70">Valeur actuelle</h3>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.totalCurrentValue)} MAD</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="text-sm font-medium text-base-content/70">Profit/Perte</h3>
            <div>
              <p
                className={`text-2xl font-bold ${
                  portfolio.totalProfitLoss >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {portfolio.totalProfitLoss >= 0 ? '+' : ''}
                {formatCurrency(portfolio.totalProfitLoss)} MAD
              </p>
              <p
                className={`text-sm font-semibold ${
                  portfolio.totalProfitLossPercent >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {portfolio.totalProfitLossPercent >= 0 ? '+' : ''}
                {portfolio.totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Portfolio Value */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
        <div className="card-body">
          <h3 className="text-lg font-medium opacity-90">Valeur totale (cash + positions)</h3>
          <p className="text-4xl font-bold">{formatCurrency(portfolio.totalValue)} MAD</p>
        </div>
      </div>

      {/* Positions */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Positions actuelles</h2>

          {wallet.positions.length === 0 ? (
            <div className="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Aucune position ouverte. Rendez-vous sur la page Crypto pour commencer à trader !
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th className="text-right">Quantité</th>
                    <th className="text-right">Prix moyen achat</th>
                    <th className="text-right">Prix actuel</th>
                    <th className="text-right">Investi</th>
                    <th className="text-right">Valeur actuelle</th>
                    <th className="text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.positions.map((position) => (
                    <tr key={position.id}>
                      <td>
                        <div className="font-bold">{position.symbol}</div>
                        <div className="text-sm opacity-50">{position.assetType}</div>
                      </td>
                      <td className="text-right font-semibold">{formatCrypto(position.quantity)}</td>
                      <td className="text-right">{formatCurrency(position.avgPurchasePrice)} MAD</td>
                      <td className="text-right font-semibold">
                        {formatCurrency(position.currentPrice || position.avgPurchasePrice)} MAD
                      </td>
                      <td className="text-right">{formatCurrency(position.totalInvested)} MAD</td>
                      <td className="text-right font-semibold">
                        {formatCurrency(position.currentValue || position.totalInvested)} MAD
                      </td>
                      <td className="text-right">
                        <div
                          className={`flex items-center justify-end gap-1 font-semibold ${
                            (position.profitLoss || 0) >= 0 ? 'text-success' : 'text-error'
                          }`}
                        >
                          {(position.profitLoss || 0) >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                          <div>
                            <div>
                              {(position.profitLoss || 0) >= 0 ? '+' : ''}
                              {formatCurrency(Math.abs(position.profitLoss || 0))} MAD
                            </div>
                            <div className="text-xs">
                              ({(position.profitLossPercent || 0) >= 0 ? '+' : ''}
                              {(position.profitLossPercent || 0).toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Transactions History */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title mb-4">Historique des transactions</h2>

          {wallet.transactions.length === 0 ? (
            <div className="alert">
              <span>Aucune transaction pour le moment.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Asset</th>
                    <th className="text-right">Quantité</th>
                    <th className="text-right">Prix unitaire</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Frais</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="text-sm">
                        {new Date(tx.timestamp).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            tx.type === 'BUY' ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="font-bold">{tx.symbol}</td>
                      <td className="text-right">{formatCrypto(tx.quantity)}</td>
                      <td className="text-right">{formatCurrency(tx.price)} MAD</td>
                      <td className="text-right font-semibold">{formatCurrency(tx.totalAmount)} MAD</td>
                      <td className="text-right text-sm opacity-70">{formatCurrency(tx.fee)} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
