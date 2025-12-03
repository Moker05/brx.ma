import { FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

export interface PortfolioHeaderProps {
  onAddPosition: () => void;
  onUpdatePrices: () => void;
  onReset: () => void;
  isUpdatingPrices?: boolean;
}

export const PortfolioHeader = ({
  onAddPosition,
  onUpdatePrices,
  onReset,
  isUpdatingPrices = false,
}: PortfolioHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Mon Portfolio</h1>
        <p className="text-base-content/70 mt-1">
          Gestion complète de vos actifs – suivi en temps réel
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-primary btn-sm gap-2"
          onClick={onAddPosition}
        >
          <FiPlus />
          Ajouter un actif
        </button>

        <button
          className="btn btn-outline btn-sm gap-2"
          onClick={onUpdatePrices}
          disabled={isUpdatingPrices}
        >
          <FiRefreshCw className={isUpdatingPrices ? 'animate-spin' : ''} />
          Actualiser les prix
        </button>

        <button
          className="btn btn-error btn-outline btn-sm gap-2"
          onClick={onReset}
        >
          <FiTrash2 />
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
