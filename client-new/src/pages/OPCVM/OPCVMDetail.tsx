import { useParams } from 'react-router-dom';
import { useOPCVMDetail, useOPCVMHistory } from '../../hooks/useOPCVM';
import { CategoryBadge } from '../../components/opcvm/CategoryBadge';
import { RiskIndicator } from '../../components/opcvm/RiskIndicator';
import { PerformanceChart } from '../../components/opcvm/PerformanceChart';
import { PerformanceSimulator } from '../../components/opcvm/PerformanceSimulator';

const formatPercent = (value?: number) => (value || value === 0 ? `${value.toFixed(2)}%` : '--');

export const OPCVMDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: fund, isLoading } = useOPCVMDetail(id);
  const { data: history } = useOPCVMHistory(id, '6M');

  if (isLoading) {
    return <div className="skeleton h-64 w-full" />;
  }

  if (!fund) {
    return (
      <div className="alert alert-warning">
        <span>OPCVM introuvable.</span>
      </div>
    );
  }

  const changeColor =
    fund.dailyChange === undefined ? '' : fund.dailyChange >= 0 ? 'text-success' : 'text-error';

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl border border-base-300/60 p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CategoryBadge category={fund.category} />
              {fund.isin && <span className="badge badge-outline">{fund.isin}</span>}
            </div>
            <h1 className="text-3xl font-bold">{fund.name}</h1>
            <p className="text-base-content/70">{fund.managementCompany}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-base-content/60 uppercase">VL</p>
            <p className="text-3xl font-semibold text-mono">{fund.currentVL.toFixed(2)} MAD</p>
            <p className={`text-sm ${changeColor}`}>
              Var jour: {fund.dailyChange !== undefined ? `${fund.dailyChange.toFixed(2)}%` : '--'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">1 an</p>
            <p className="text-lg font-semibold text-success">{formatPercent(fund.return1Year)}</p>
          </div>
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">3 ans</p>
            <p className="text-lg font-semibold text-success">{formatPercent(fund.return3Years)}</p>
          </div>
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">5 ans</p>
            <p className="text-lg font-semibold text-success">{formatPercent(fund.return5Years)}</p>
          </div>
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">Depuis creation</p>
            <p className="text-lg font-semibold text-success">
              {formatPercent(fund.returnSinceInception)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">Risque</p>
            <RiskIndicator level={fund.riskLevel} />
          </div>
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">Frais de gestion</p>
            <p className="text-lg font-semibold">{fund.managementFee.toFixed(2)}% / an</p>
          </div>
          <div className="p-3 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60">Min. souscription</p>
            <p className="text-lg font-semibold">{fund.minSubscription.toLocaleString('fr-MA')} MAD</p>
          </div>
        </div>

        {fund.description && (
          <div className="p-4 rounded-xl bg-base-200/60">
            <p className="text-xs text-base-content/60 uppercase">Description</p>
            <p className="text-base-content/80">{fund.description}</p>
          </div>
        )}
      </div>

      {history && history.length > 0 && <PerformanceChart data={history} />}

      <PerformanceSimulator funds={[fund]} />
    </div>
  );
};
