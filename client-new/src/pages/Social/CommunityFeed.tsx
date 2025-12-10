import { useState } from 'react';
import { CreatePostForm } from '../../components/social/CreatePostForm';
import PostCard from '../../components/social/PostCard';
import { usePostsBySymbol, useLikePost } from '../../hooks/useSocial';

export function CommunityFeed() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data: posts = [] as any[], isLoading } = usePostsBySymbol(filter, page);
  const likeMutation = useLikePost();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Communauté</h1>
      <CreatePostForm />

      <div className="btn-group mb-4">
        <button className={`btn ${!filter ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter(undefined); setPage(1); }}>All</button>
        <button className={`btn ${filter === 'BULLISH' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter('BULLISH'); setPage(1); }}>Bullish</button>
        <button className={`btn ${filter === 'BEARISH' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setFilter('BEARISH'); setPage(1); }}>Bearish</button>
      </div>

      {isLoading && <div>Chargement...</div>}

      <div className="space-y-3">
        {posts.map((p: any) => (
          <PostCard key={p.id} post={p} onLike={(id) => likeMutation.mutate(id)} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button className="btn btn-sm" onClick={() => setPage((s) => s + 1)}>Charger plus</button>
      </div>
    </div>
  );
}

export default CommunityFeed;
