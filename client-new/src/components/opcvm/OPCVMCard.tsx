import { useNavigate } from 'react-router-dom';
import type { OPCVM } from '../../services/opcvmAPI';
import { CategoryBadge } from './CategoryBadge';
import { RiskIndicator } from './RiskIndicator';

interface OPCVMCardProps {
  fund: OPCVM;
}

const formatPercent = (value?: number) => (value || value === 0 ? `${value.toFixed(2)}%` : '--');

export const OPCVMCard = ({ fund }: OPCVMCardProps) => {
  const navigate = useNavigate();
  const changeColor =
    fund.dailyChange === undefined ? '' : fund.dailyChange >= 0 ? 'text-success' : 'text-error';

  return (
    <div
      className="glass rounded-2xl border border-base-300/60 p-4 space-y-3 hover:border-primary/50 transition"
      onClick={() => navigate(`/opcvm/${fund.id}`)}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-base-content/60">{fund.managementCompany}</p>
          <h3 className="text-xl font-semibold">{fund.name}</h3>
        </div>
        <CategoryBadge category={fund.category} />
      </div>

      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-base-content/60 uppercase">VL</p>
          <p className="text-lg font-semibold text-mono">{fund.currentVL.toFixed(2)} MAD</p>
        </div>
        <div>
          <p className="text-xs text-base-content/60 uppercase">Var jour</p>
          <p className={`text-lg font-semibold text-mono ${changeColor}`}>
            {fund.dailyChange !== undefined ? `${fund.dailyChange.toFixed(2)}%` : '--'}
          </p>
        </div>
      </div>

      <RiskIndicator level={fund.riskLevel} />

      <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
};
