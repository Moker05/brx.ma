import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWallet,
  getPortfolioHistory,
  addPosition,
  deletePosition,
  updatePositionPrices,
  resetWallet,
  type AddPositionRequest,
} from '../../services/portfolioAPI';
import { AddAssetModal } from '../../components/portfolio/AddAssetModal';
import { PortfolioChart } from '../../components/portfolio/PortfolioChart';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiTrash2,
  FiPlus,
  FiEdit2,
} from 'react-icons/fi';

type PeriodType = '1W' | '1M' | '1Y' | 'MAX';

export const PortfolioNew = () => {
  const queryClient = useQueryClient();
  const [userId] = useState('demo-user-001');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('1M');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssetType, setFilterAssetType] = useState<'ALL' | 'CRYPTO' | 'STOCK' | 'OPCVM'>(
    'ALL'
  );

  // Fetch wallet data
  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: _refetchWallet,
  } = useQuery({
    queryKey: ['wallet', userId],
    queryFn: () => getWallet(userId),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch portfolio history
  const { data: portfolioHistory } = useQuery({
    queryKey: ['portfolioHistory', userId, selectedPeriod],
    queryFn: () => getPortfolioHistory(userId, selectedPeriod),
    refetchInterval: 60000, // Refresh every minute
  });

  // Update prices mutation
  const updatePricesMutation = useMutation({
    mutationFn: () => updatePositionPrices(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
    },
    onError: (error) => {
      console.warn('Mise à jour des prix indisponible', error);
    },
  });

  // Add position mutation
  const addPositionMutation = useMutation({
    mutationFn: (position: AddPositionRequest) => addPosition(userId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioHistory', userId] });
    },
  });

  // Delete position mutation
  const deletePositionMutation = useMutation({
    mutationFn: (positionId: string) => deletePosition(positionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
    },
  });

  // Reset wallet mutation
  const resetWalletMutation = useMutation({
    mutationFn: () => resetWallet(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', userId] });
      queryClient.invalidateQueries({ queryKey: ['portfolioHistory', userId] });
    },
  });

  const handleAddAsset = async (asset: AddPositionRequest) => {
    await addPositionMutation.mutateAsync(asset);
  };

  const handleDeletePosition = async (positionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette position ?')) {
      await deletePositionMutation.mutateAsync(positionId);
    }
  };

  const handleReset = async () => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir réinitialiser votre portefeuille ? Toutes vos positions et transactions seront perdues.'
      )
    ) {
      await resetWalletMutation.mutateAsync();
    }
  };

  const handleUpdatePrices = async () => {
    await updatePricesMutation.mutateAsync();
  };

  // Auto-refresh des prix (espacé pour éviter le spam si l'API est indisponible)
  useEffect(() => {
    const safeRefresh = () => {
      if (updatePricesMutation.isPending) return;
      updatePricesMutation.mutate(undefined, {
        onError: (error: any) => {
          console.error('Erreur de mise à jour des prix:', error);
          // Silently fail but log the error for debugging
        }
      });
    };

    safeRefresh();
    const interval = setInterval(safeRefresh, 120000); // toutes les 2 minutes
    return () => clearInterval(interval);
  }, [updatePricesMutation]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCrypto = (amount: number) => {
    return amount.toFixed(8);
  };

  // Filter positions
  const filteredPositions = wallet?.positions.filter((pos) => {
    const matchesSearch =
      pos.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterAssetType === 'ALL' || pos.assetType === filterAssetType;
    return matchesSearch && matchesType;
  });

  // Filter transactions
  const filteredTransactions = wallet?.transactions.filter((tx) => {
    return tx.symbol.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const periodPnL = useMemo(() => {
    if (!portfolioHistory || portfolioHistory.length === 0) {
      return { change: 0, percent: 0 };
    }
    const sorted = [...portfolioHistory].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const change = last.totalValue - first.totalValue;
    const percent = first.totalValue > 0 ? (change / first.totalValue) * 100 : 0;
    return { change, percent };
  }, [portfolioHistory]);

  if (walletLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="alert alert-error">
        <span>Erreur lors du chargement du portefeuille</span>
      </div>
    );
  }

  const { portfolio } = wallet;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mon Portfolio</h1>
          <p className="text-base-content/70 mt-1">Gestion complète de vos actifs – suivi en temps réel</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-primary btn-sm gap-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus />
            Ajouter un actif
          </button>
          <button
            className="btn btn-outline btn-sm gap-2"
            onClick={handleUpdatePrices}
            disabled={updatePricesMutation.isPending}
          >
            <FiRefreshCw className={updatePricesMutation.isPending ? 'animate-spin' : ''} />
            Actualiser les prix
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
            <div className="space-y-2">
              <div>
                <p
                  className={`text-2xl font-bold ${
                    portfolio.totalProfitLoss >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  Total : {portfolio.totalProfitLoss >= 0 ? '+' : ''}
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
              <div className="text-sm text-base-content/70">Période sélectionnée</div>
              <div
                className={`text-lg font-semibold ${
                  periodPnL.change >= 0 ? 'text-success' : 'text-error'
                }`}
              >
                {periodPnL.change >= 0 ? '+' : ''}
                {formatCurrency(periodPnL.change)} MAD ({periodPnL.percent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Portfolio Value */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
        <div className="card-body">
          <h3 className="text-lg font-medium opacity-90">Valeur totale du portefeuille</h3>
          <p className="text-4xl font-bold">{formatCurrency(portfolio.totalValue)} MAD</p>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Evolution du portefeuille</h2>
            <div className="btn-group">
              <button
                className={`btn btn-sm ${selectedPeriod === '1W' ? 'btn-active' : ''}`}
                onClick={() => setSelectedPeriod('1W')}
              >
                1S
              </button>
              <button
                className={`btn btn-sm ${selectedPeriod === '1M' ? 'btn-active' : ''}`}
                onClick={() => setSelectedPeriod('1M')}
              >
                1M
              </button>
              <button
                className={`btn btn-sm ${selectedPeriod === '1Y' ? 'btn-active' : ''}`}
                onClick={() => setSelectedPeriod('1Y')}
              >
                1A
              </button>
              <button
                className={`btn btn-sm ${selectedPeriod === 'MAX' ? 'btn-active' : ''}`}
                onClick={() => setSelectedPeriod('MAX')}
              >
                Max
              </button>
            </div>
          </div>

          <PortfolioChart data={portfolioHistory || []} period={selectedPeriod} />
        </div>
      </div>

      {/* Positions */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Positions actuelles</h2>
            <div className="flex gap-2">
              <select
                className="select select-bordered select-sm"
                value={filterAssetType}
                onChange={(e) => setFilterAssetType(e.target.value as any)}
              >
                <option value="ALL">Tous les actifs</option>
                <option value="CRYPTO">Crypto</option>
                <option value="STOCK">Actions</option>
                <option value="OPCVM">OPCVM</option>
              </select>
              <input
                type="text"
                placeholder="Rechercher..."
                className="input input-bordered input-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {!filteredPositions || filteredPositions.length === 0 ? (
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
              <span>Aucune position trouvée. Ajoutez un actif pour commencer !</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Actif</th>
                    <th className="text-right">Quantité</th>
                    <th className="text-right">Prix moyen achat</th>
                    <th className="text-right">Prix actuel</th>
                    <th className="text-right">Investi</th>
                    <th className="text-right">Valeur actuelle</th>
                    <th className="text-right">P&L</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((position) => (
                    <tr key={position.id}>
                      <td>
                        <div>
                          <div className="font-bold">{position.symbol}</div>
                          <div className="text-sm opacity-50">
                            {position.name || position.assetType}
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-semibold">
                        {formatCrypto(position.quantity)}
                      </td>
                      <td className="text-right">
                        {formatCurrency(position.avgPurchasePrice)} MAD
                      </td>
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
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-xs">
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => handleDeletePosition(position.id)}
                          >
                            <FiTrash2 />
                          </button>
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

          {!filteredTransactions || filteredTransactions.length === 0 ? (
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
                    <th>Actif</th>
                    <th className="text-right">Quantité</th>
                    <th className="text-right">Prix unitaire</th>
                    <th className="text-right">Total</th>
                    <th className="text-right">Frais</th>
                    <th className="text-right">PnL réalisé</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
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
                          className={`badge ${tx.type === 'BUY' ? 'badge-success' : 'badge-error'}`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <div className="font-bold">{tx.symbol}</div>
                        <div className="text-xs opacity-50">{tx.assetType}</div>
                      </td>
                      <td className="text-right">{formatCrypto(tx.quantity)}</td>
                      <td className="text-right">{formatCurrency(tx.price)} MAD</td>
                      <td className="text-right font-semibold">
                        {formatCurrency(tx.totalAmount)} MAD
                      </td>
                      <td className="text-right text-sm opacity-70">
                        {formatCurrency(tx.fee)} MAD
                      </td>
                      <td className="text-right">
                        {tx.realizedPnL !== null && tx.realizedPnL !== undefined ? (
                          <span
                            className={`font-semibold ${
                              tx.realizedPnL >= 0 ? 'text-success' : 'text-error'
                            }`}
                          >
                            {tx.realizedPnL >= 0 ? '+' : ''}
                            {formatCurrency(tx.realizedPnL)} MAD
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAsset}
      />
    </div>
  );
};
