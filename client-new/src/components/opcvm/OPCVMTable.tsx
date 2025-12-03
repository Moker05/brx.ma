import { useNavigate } from 'react-router-dom';
import { CategoryBadge } from './CategoryBadge';
import { RiskIndicator } from './RiskIndicator';
import type { OPCVM } from '../../services/opcvmAPI';

export type SortField = 'return1Year' | 'return3Years' | 'return5Years' | 'returnSinceInception';

interface OPCVMTableProps {
  data: OPCVM[];
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (field: SortField) => void;
}

const formatPercent = (value?: number) => (value || value === 0 ? `${value.toFixed(2)}%` : '--');
const formatNumber = (value: number) => value.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const OPCVMTable = ({ data, sortBy, sortOrder, onSortChange }: OPCVMTableProps) => {
  const navigate = useNavigate();

  const headers: Array<{ key: SortField; label: string }> = [
    { key: 'return1Year', label: '1 an' },
    { key: 'return3Years', label: '3 ans' },
    { key: 'return5Years', label: '5 ans' },
    { key: 'returnSinceInception', label: 'Depuis creation' },
  ];

  return (
    <div className="overflow-x-auto glass rounded-2xl border border-base-300/60">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Fonds</th>
            <th>VL</th>
            <th>Var J</th>
            <th>Risque</th>
            <th>Frais</th>
            <th>Min. Souscription</th>
            {headers.map((h) => (
              <th key={h.key}>
                <button
                  className="flex items-center gap-1 text-left"
                  onClick={() => onSortChange(h.key)}
                >
                  {h.label}
                  {sortBy === h.key && (
                    <span className="text-xs text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((fund) => {
            const changeColor =
              fund.dailyChange === undefined ? '' : fund.dailyChange >= 0 ? 'text-success' : 'text-error';

            return (
              <tr
                key={fund.id}
                className="cursor-pointer hover:bg-base-200/60"
                onClick={() => navigate(`/opcvm/${fund.id}`)}
              >
                <td>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{fund.name}</p>
                      <CategoryBadge category={fund.category} />
                    </div>
                    <p className="text-sm text-base-content/60">{fund.managementCompany}</p>
                  </div>
                </td>
                <td className="text-right text-mono font-semibold">{formatNumber(fund.currentVL)} MAD</td>
                <td className={`text-right text-mono font-semibold ${changeColor}`}>
                  {fund.dailyChange !== undefined ? `${fund.dailyChange.toFixed(2)}%` : '--'}
                </td>
                <td>
                  <RiskIndicator level={fund.riskLevel} />
                </td>
                <td className="text-sm">{fund.managementFee.toFixed(2)}% / an</td>
                <td className="text-sm">{fund.minSubscription.toLocaleString('fr-MA')} MAD</td>
                {headers.map((h) => (
                  <td key={h.key} className="text-right text-mono">
                    {formatPercent(fund[h.key])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
