import { useMemo, useState } from 'react';
import { useOPCVMList } from '../../hooks/useOPCVM';
import { OPCVMFilters } from '../../components/opcvm/OPCVMFilters';
import type { OPCVMFilterState } from '../../components/opcvm/OPCVMFilters';
import { OPCVMList } from './OPCVMList';
import { PerformanceSimulator } from '../../components/opcvm/PerformanceSimulator';
import type { SortField } from '../../components/opcvm/OPCVMTable';
import { CategoryBadge } from '../../components/opcvm/CategoryBadge';
import type { OPCVM as OPCVMData, OPCVMCategory } from '../../services/opcvmAPI';

const defaultFilters: OPCVMFilterState = {
  sortBy: 'return1Year',
  sortOrder: 'desc',
};

const highlightByCategory = (data: OPCVMData[], category: OPCVMCategory) =>
  data.find((item) => item.category === category) || data[0];

export const OPCVM = () => {
  const [filters, setFilters] = useState<OPCVMFilterState>(defaultFilters);

  const { data: opcvmData = [], isLoading } = useOPCVMList(filters);

  const companies = useMemo(
    () => Array.from(new Set(opcvmData.map((f) => f.managementCompany))).sort(),
    [opcvmData]
  );

  const top1Year = useMemo(
    () =>
      [...opcvmData].sort(
        (a, b) => (b.return1Year || 0) - (a.return1Year || 0)
      )[0],
    [opcvmData]
  );

  const avgReturn1Y = useMemo(() => {
    if (!opcvmData.length) return 0;
    const sum = opcvmData.reduce((acc, f) => acc + (f.return1Year || 0), 0);
    return sum / opcvmData.length;
  }, [opcvmData]);

  const handleSortChange = (field: SortField) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleFilterChange = (next: Partial<OPCVMFilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  };

  const handleReset = () => setFilters(defaultFilters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80 font-semibold">
          OPCVM
        </p>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold font-display">Fonds OPCVM Maroc</h1>
            <p className="text-base-content/70">
              Vue complete: VL, rendements, filtres multi-criteres et simulateur de performance.
            </p>
          </div>
          {top1Year && (
            <div className="glass rounded-2xl border border-primary/40 px-4 py-3">
              <p className="text-xs text-base-content/60">Top 1 an</p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold">{top1Year.name}</p>
                  <p className="text-sm text-base-content/60">{top1Year.managementCompany}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-success">
                    {(top1Year.return1Year || 0).toFixed(2)}%
                  </p>
                  <CategoryBadge category={top1Year.category} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl border border-base-300/60 p-4">
          <p className="text-xs text-base-content/60 uppercase">Fonds actifs</p>
          <p className="text-3xl font-bold">{opcvmData.length}</p>
          <p className="text-sm text-base-content/60">sur l-univers OPCVM charge</p>
        </div>
        <div className="glass rounded-2xl border border-base-300/60 p-4">
          <p className="text-xs text-base-content/60 uppercase">Rendement moyen 1 an</p>
          <p className="text-3xl font-bold text-success">{avgReturn1Y.toFixed(2)}%</p>
          <p className="text-sm text-base-content/60">Base sur les fonds charges</p>
        </div>
        <div className="glass rounded-2xl border border-base-300/60 p-4">
          <p className="text-xs text-base-content/60 uppercase">Categories phares</p>
          <div className="flex gap-2 flex-wrap mt-2">
            {(['ACTIONS', 'OBLIGATIONS', 'MONETAIRE'] as OPCVMCategory[]).map((cat) => {
              const fund = highlightByCategory(opcvmData, cat);
              return fund ? <CategoryBadge key={cat} category={fund.category} /> : null;
            })}
          </div>
        </div>
      </div>

      <OPCVMFilters
        filters={filters}
        companies={companies}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {isLoading ? (
            <div className="skeleton h-64 w-full" />
          ) : (
            <OPCVMList
              data={opcvmData}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={handleSortChange}
            />
          )}
        </div>
        <div>
          <PerformanceSimulator funds={opcvmData} />
        </div>
      </div>
    </div>
  );
};
