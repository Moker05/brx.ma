import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCreatePost } from '../../hooks/useSocial';

export function CreatePostForm({ defaultSymbol }: { defaultSymbol?: string }) {
  const [symbol, setSymbol] = useState(defaultSymbol || '');
  const [assetType, setAssetType] = useState('STOCK');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState('NEUTRAL');
  const [targetPrice, setTargetPrice] = useState<number | undefined>(undefined);

  const mutation = useCreatePost();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({ symbol, assetType, content, sentiment, targetPrice });
    setContent('');
  };

  return (
    <form onSubmit={submit} className="card card-compact bg-base-100 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol (BTC, ATW...)" className="input input-bordered w-full" />
        <select value={assetType} onChange={(e) => setAssetType(e.target.value)} className="select select-bordered w-full">
          <option>STOCK</option>
          <option>CRYPTO</option>
          <option>OPCVM</option>
        </select>
        <select value={sentiment} onChange={(e) => setSentiment(e.target.value)} className="select select-bordered w-full">
          <option value="NEUTRAL">Neutral</option>
          <option value="BULLISH">Bullish</option>
          <option value="BEARISH">Bearish</option>
        </select>
      </div>
      <textarea className="textarea textarea-bordered w-full mt-3" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share your analysis..." />
      <div className="flex items-center gap-2 mt-3">
        <input type="number" className="input input-sm" value={targetPrice ?? ''} onChange={(e) => setTargetPrice(e.target.value ? Number(e.target.value) : undefined)} placeholder="Target price (optional)" />
        <button type="submit" className="btn btn-primary btn-sm">Publier</button>
        {(mutation as any).isLoading && <span className="ml-2">Envoi...</span>}
      </div>
    </form>
  );
}

export default CreatePostForm;
