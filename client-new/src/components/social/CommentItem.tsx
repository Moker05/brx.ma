// React default import not required with the automatic JSX runtime

export function CommentItem({ comment }: { comment: any }) {
  return (
    <div className="p-2 border-b border-base-200">
      <div className="text-sm font-semibold">{comment.user?.displayName || 'Anon'}</div>
      <div className="text-xs text-base-content/60">{new Date(comment.createdAt).toLocaleString()}</div>
      <div className="mt-2 text-sm">{comment.content}</div>
      <div className="mt-2 text-xs text-base-content/60">❤️ {comment.likesCount}</div>
    </div>
  );
}

export default CommentItem;
