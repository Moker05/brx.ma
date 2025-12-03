import type { OPCVMCategory } from '../../services/opcvmAPI';

const categoryStyles: Record<OPCVMCategory, string> = {
  ACTIONS: 'badge badge-primary',
  OBLIGATIONS: 'badge badge-info',
  MONETAIRE: 'badge badge-success',
  DIVERSIFIE: 'badge badge-warning',
  CONTRACTUEL: 'badge badge-neutral',
  ALTERNATIF: 'badge badge-secondary',
};

const categoryLabels: Record<OPCVMCategory, string> = {
  ACTIONS: 'Actions',
  OBLIGATIONS: 'Obligations',
  MONETAIRE: 'Monetaire',
  DIVERSIFIE: 'Diversifie',
  CONTRACTUEL: 'Contractuel',
  ALTERNATIF: 'Alternatif',
};

interface CategoryBadgeProps {
  category: OPCVMCategory;
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  return <span className={categoryStyles[category]}>{categoryLabels[category]}</span>;
};
