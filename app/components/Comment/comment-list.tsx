import Comment from './comment'

export type CommentListProps={
    comments:Comment[];
}

export default function CommentList({ comments }:CommentListProps) {
  return (
    <div className="comment-list">
      {comments.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}