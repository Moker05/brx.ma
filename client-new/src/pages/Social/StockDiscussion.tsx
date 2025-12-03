import React from 'react';
import { useParams } from 'react-router-dom';
import { CreatePostForm } from '../../components/social/CreatePostForm';
import PostCard from '../../components/social/PostCard';
import { usePostsBySymbol, useLikePost } from '../../hooks/useSocial';

export function StockDiscussion() {
  const { symbol } = useParams();
  const { data: posts = [], isLoading } = usePostsBySymbol(symbol, 1);
  const likeMutation = useLikePost();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Discussion: {symbol}</h1>
      <CreatePostForm defaultSymbol={symbol} />

      {isLoading && <div>Chargement...</div>}

      <div className="space-y-3">
        {posts.map((p: any) => (
          <PostCard key={p.id} post={p} onLike={(id) => likeMutation.mutate(id)} />
        ))}
      </div>
    </div>
  );
}

export default StockDiscussion;
