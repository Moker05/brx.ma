import { useState, useEffect } from 'react';
import type { CryptoMarket } from '../../services/coinGeckoAPI';
import { executeBuyOrder, executeSellOrder, getPosition } from '../../services/tradingService';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: CryptoMarket | null;
  type: 'BUY' | 'SELL';
  onSuccess?: () => void;
}

export const TradeModal = ({ isOpen, onClose, crypto, type, onSuccess }: TradeModalProps) => {
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<number>(0);

  useEffect(() => {
    if (isOpen && crypto) {
      // Get current position
      const pos = getPosition(crypto.symbol.toUpperCase(), 'CRYPTO');
      setCurrentPosition(pos?.quantity || 0);
      setQuantity('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, crypto]);

  if (!isOpen || !crypto) return null;

  const price = crypto.current_price;
  const quantityNum = parseFloat(quantity) || 0;
  const totalAmount = quantityNum * price;
  const fee = totalAmount * 0.005; // 0.5%
  const totalCost = totalAmount + fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (quantityNum <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }

      const order = {
        userId: 'demo-user-001',
        symbol: crypto.symbol.toUpperCase(),
        assetType: 'CRYPTO' as const,
        market: 'CRYPTO' as const,
        quantity: quantityNum,
        price,
      };

      let result;
      if (type === 'BUY') {
        result = await executeBuyOrder(order);
      } else {
        result = await executeSellOrder(order);
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        <h3 className="font-bold text-lg mb-4">
          {type === 'BUY' ? 'Acheter' : 'Vendre'} {crypto.name}
        </h3>

        {/* Crypto Info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-base-200 rounded-lg">
          <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
          <div className="flex-1">
            <div className="font-bold">{crypto.symbol.toUpperCase()}</div>
            <div className="text-sm opacity-70">{crypto.name}</div>
          </div>
          <div className="text-right">
            <div className="font-bold">${price.toLocaleString()}</div>
            <div className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-success' : 'text-error'}`}>
              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Current Position */}
        {type === 'SELL' && (
          <div className="alert alert-info mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Position actuelle: {currentPosition.toFixed(8)} {crypto.symbol.toUpperCase()}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantité</span>
              {type === 'SELL' && currentPosition > 0 && (
                <button
                  type="button"
                  onClick={() => setQuantity(currentPosition.toString())}
                  className="label-text-alt link link-primary"
                >
                  Max: {currentPosition.toFixed(8)}
                </button>
              )}
            </label>
            <input
              type="number"
              step="0.00000001"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00000000"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Order Summary */}
          {quantityNum > 0 && (
            <div className="bg-base-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prix unitaire</span>
                <span className="font-medium">${price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantité</span>
                <span className="font-medium">{quantityNum.toFixed(8)}</span>
              </div>
              <div className="divider my-1"></div>
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm opacity-70">
                <span>Frais (0.5%)</span>
                <span>${fee.toFixed(2)}</span>
              </div>
              <div className="divider my-1"></div>
              <div className="flex justify-between font-bold">
                <span>{type === 'BUY' ? 'Total à payer' : 'Total à recevoir'}</span>
                <span className={type === 'BUY' ? 'text-error' : 'text-success'}>
                  ${(type === 'BUY' ? totalCost : totalAmount - fee).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`btn ${type === 'BUY' ? 'btn-success' : 'btn-error'}`}
              disabled={loading || quantityNum <= 0}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  {type === 'BUY' ? 'Acheter' : 'Vendre'} {crypto.symbol.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
