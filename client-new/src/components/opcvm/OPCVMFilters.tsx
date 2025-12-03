import type { OPCVMCategory } from '../../services/opcvmAPI';
import type { SortField } from './OPCVMTable';

export interface OPCVMFilterState {
  category?: OPCVMCategory;
  company?: string;
  risk?: number;
  search?: string;
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
}

interface OPCVMFiltersProps {
  filters: OPCVMFilterState;
  companies: string[];
  onChange: (next: Partial<OPCVMFilterState>) => void;
  onReset: () => void;
}

const categories: OPCVMCategory[] = [
  'ACTIONS',
  'OBLIGATIONS',
  'MONETAIRE',
  'DIVERSIFIE',
  'CONTRACTUEL',
  'ALTERNATIF',
];

export const OPCVMFilters = ({ filters, companies, onChange, onReset }: OPCVMFiltersProps) => {
  return (
    <div className="glass rounded-2xl border border-base-300/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-base-content/60 uppercase tracking-wide">Filtrer</p>
          <h3 className="text-lg font-semibold">Affiner la liste des fonds</h3>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onReset}>
          Reinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="label">
            <span className="label-text text-sm">Recherche</span>
          </label>
          <input
            type="text"
            placeholder="Nom ou ISIN"
            className="input input-bordered w-full"
            value={filters.search || ''}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text text-sm">Categorie</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.category || ''}
            onChange={(e) =>
              onChange({ category: (e.target.value || undefined) as OPCVMCategory | undefined })
            }
          >
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text text-sm">Societe de gestion</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.company || ''}
            onChange={(e) => onChange({ company: e.target.value || undefined })}
          >
            <option value="">Toutes</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text text-sm">Niveau de risque</span>
          </label>
          <input
            type="range"
            min={1}
            max={7}
            value={filters.risk || 1}
            className="range range-primary"
            onChange={(e) => onChange({ risk: Number(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-base-content/60 px-1">
            <span>1</span>
            <span>4</span>
            <span>7</span>
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text text-sm">Tri par rendement</span>
          </label>
          <div className="join w-full">
            <select
              className="select select-bordered join-item w-full"
              value={filters.sortBy || ''}
              onChange={(e) =>
                onChange({ sortBy: (e.target.value || undefined) as SortField | undefined })
              }
            >
              <option value="">Aucun</option>
              <option value="return1Year">1 an</option>
              <option value="return3Years">3 ans</option>
              <option value="return5Years">5 ans</option>
              <option value="returnSinceInception">Depuis creation</option>
            </select>
            <button
              className="btn join-item"
              onClick={() =>
                onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
              }
            >
              {filters.sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
