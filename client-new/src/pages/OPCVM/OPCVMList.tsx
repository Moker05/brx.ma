import type { OPCVM } from '../../services/opcvmAPI';
import { OPCVMTable } from '../../components/opcvm/OPCVMTable';
import type { SortField } from '../../components/opcvm/OPCVMTable';
import { OPCVMCard } from '../../components/opcvm/OPCVMCard';

interface OPCVMListProps {
  data: OPCVM[];
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (field: SortField) => void;
}

export const OPCVMList = ({ data, sortBy, sortOrder, onSortChange }: OPCVMListProps) => {
  return (
    <div className="space-y-4">
      <div className="hidden lg:block">
        <OPCVMTable data={data} sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {data.map((fund) => (
          <OPCVMCard key={fund.id} fund={fund} />
        ))}
      </div>
    </div>
  );
};
