import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { OPCVM } from '../../services/opcvmAPI';
import { useOPCVMSimulation } from '../../hooks/useOPCVM';

interface PerformanceSimulatorProps {
  funds: OPCVM[];
}

const freqOptions = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
  { value: 'yearly', label: 'Annuel' },
  { value: 'none', label: 'Aucun versement' },
];

export const PerformanceSimulator = ({ funds }: PerformanceSimulatorProps) => {
  const [selectedId, setSelectedId] = useState<string>(funds[0]?.id || '');
  const [principal, setPrincipal] = useState(10000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(6.5);
  const [contribution, setContribution] = useState(500);
  const [contributionFrequency, setContributionFrequency] = useState<'monthly' | 'quarterly' | 'yearly' | 'none'>('monthly');
  const [managementFee, setManagementFee] = useState(1.0);

  const { mutate, data, isPending } = useOPCVMSimulation();

  const selectedFund = useMemo(() => funds.find((f) => f.id === selectedId), [funds, selectedId]);

  useEffect(() => {
    if (!selectedId && funds[0]) {
      setSelectedId(funds[0].id);
    }
  }, [funds, selectedId]);

  useEffect(() => {
    if (selectedFund) {
      if (selectedFund.return1Year) setRate(selectedFund.return1Year);
      setManagementFee(selectedFund.managementFee);
    }
  }, [selectedFund]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      opcvmId: selectedId,
      principal,
      years,
      rate,
      contribution: contributionFrequency === 'none' ? 0 : contribution,
      contributionFrequency,
      managementFee,
    });
  };

  const chartData =
    data?.timeline.map((point) => ({
      year: `An ${point.year}`,
      value: point.value,
    })) || [];

  if (!funds.length) {
    return (
      <div className="glass rounded-2xl border border-base-300/60 p-4">
        <p className="text-base-content/70">Charge des fonds en cours...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-base-300/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-base-content/60">Simulateur</p>
          <h3 className="text-xl font-semibold">Projection de performance</h3>
        </div>
        <span className="badge badge-ghost">Beta</span>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="label">
              <span className="label-text text-sm">OPCVM</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>
                  {fund.name} ({fund.managementCompany})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">
                <span className="label-text text-sm">Capital initial (MAD)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={principal}
                min={0}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-sm">Duree (annees)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={years}
                min={1}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">
                <span className="label-text text-sm">Taux attendu (%)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={rate}
                step="0.1"
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-sm">Frais de gestion (%)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={managementFee}
                step="0.1"
                onChange={(e) => setManagementFee(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">
                <span className="label-text text-sm">Versement periodique (MAD)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={contribution}
                min={0}
                onChange={(e) => setContribution(Number(e.target.value))}
                disabled={contributionFrequency === 'none'}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text text-sm">Frequence</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={contributionFrequency}
                onChange={(e) => setContributionFrequency(e.target.value as any)}
              >
                {freqOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className={`btn btn-primary w-full ${isPending ? 'loading' : ''}`} type="submit">
            Lancer la simulation
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-base-200/70 border border-base-300/60">
              <p className="text-xs text-base-content/60">Valeur finale estimee</p>
              <p className="text-2xl font-semibold text-primary">
                {data ? `${data.finalValue.toLocaleString('fr-MA', { maximumFractionDigits: 0 })} MAD` : '--'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-base-200/70 border border-base-300/60">
              <p className="text-xs text-base-content/60">Plus-value nette</p>
              <p className="text-2xl font-semibold text-success">
                {data ? `${data.netGain.toLocaleString('fr-MA', { maximumFractionDigits: 0 })} MAD` : '--'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-base-200/70 border border-base-300/60">
              <p className="text-xs text-base-content/60">Frais cumules</p>
              <p className="text-lg font-semibold text-warning">
                {data ? `${data.feesTotal.toLocaleString('fr-MA', { maximumFractionDigits: 0 })} MAD` : '--'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-base-200/70 border border-base-300/60">
              <p className="text-xs text-base-content/60">Plus-value brute</p>
              <p className="text-lg font-semibold">
                {data ? `${data.grossGain.toLocaleString('fr-MA', { maximumFractionDigits: 0 })} MAD` : '--'}
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="simColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" tick={{ fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #1f2937' }}
                  formatter={(value: number) => [`${value.toLocaleString('fr-MA')} MAD`, 'Valeur']}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#simColor)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </form>
    </div>
  );
};
