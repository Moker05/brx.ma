import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import type { AddPositionRequest } from '../../services/portfolioAPI';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: AddPositionRequest) => Promise<void>;
}

export const AddAssetModal = ({ isOpen, onClose, onSubmit }: AddAssetModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddPositionRequest>({
    symbol: '',
    assetType: 'CRYPTO',
    market: 'CRYPTO',
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    name: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        symbol: '',
        assetType: 'CRYPTO',
        market: 'CRYPTO',
        quantity: 0,
        purchasePrice: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        name: '',
        notes: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Erreur lors de l\'ajout de l\'actif');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetTypeChange = (assetType: 'STOCK' | 'CRYPTO' | 'OPCVM') => {
    let market: 'BVC' | 'CRYPTO' | 'OTHER' = 'OTHER';
    if (assetType === 'STOCK') market = 'BVC';
    if (assetType === 'CRYPTO') market = 'CRYPTO';

    setFormData({
      ...formData,
      assetType,
      market,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl">Ajouter un actif</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Asset Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Type d'actif</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn btn-sm flex-1 ${
                    formData.assetType === 'CRYPTO' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => handleAssetTypeChange('CRYPTO')}
                >
                  Crypto
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-1 ${
                    formData.assetType === 'STOCK' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => handleAssetTypeChange('STOCK')}
                >
                  Action (BVC)
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-1 ${
                    formData.assetType === 'OPCVM' ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => handleAssetTypeChange('OPCVM')}
                >
                  OPCVM
                </button>
              </div>
            </div>

            {/* Symbol and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Symbole *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: BTC, ATW, etc."
                  className="input input-bordered"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nom (optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bitcoin, Attijariwafa Bank"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Quantité *</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.00000001"
                  min="0"
                  className="input input-bordered"
                  value={formData.quantity || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Prix d'achat (MAD) *</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input input-bordered"
                  value={formData.purchasePrice || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purchasePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date d'achat</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>

            {/* Total Investment Display */}
            <div className="alert">
              <div>
                <div className="text-sm">Montant total investi</div>
                <div className="text-xl font-bold">
                  {(formData.quantity * formData.purchasePrice).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  MAD
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Notes (optionnel)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-20"
                placeholder="Ajoutez des notes personnelles..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={loading || !formData.symbol || !formData.quantity || !formData.purchasePrice}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FiPlus />
              )}
              Ajouter l'actif
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};
