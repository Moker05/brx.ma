import React from 'react';
import type { Post } from '../../services/socialAPI';
import { UserAvatar } from './UserAvatar';
import { TierBadge } from './TierBadge';

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <UserAvatar name={post.user?.displayName || 'Anonymous'} avatar={post.user?.avatar} size="sm" verified={post.user?.verified} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{post.user?.displayName || 'Anonymous'}</div>
                <TierBadge tier={post.user?.tier || 'BRONZE'} size="sm" />
                <div className="text-sm text-base-content/60">· {new Date(post.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm text-base-content/60">{post.symbol} • {post.assetType}</div>
            </div>
            <div className="mt-2 text-sm whitespace-pre-wrap">{post.content}</div>
            <div className="mt-3 flex items-center gap-4">
              <button className="btn btn-ghost btn-sm" onClick={() => onLike?.(post.id)}>❤️ {post.likesCount}</button>
              <div className="text-sm text-base-content/60">💬 {post.commentsCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
