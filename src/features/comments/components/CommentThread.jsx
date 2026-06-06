import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommentStore } from "@/store/commentStore";
import { CommentItem } from "./CommentItem";
import { ReplyComposer } from "./ReplyComposer";

export function CommentThread({ postId }) {
  const fetchComments = useCommentStore((s) => s.fetchComments);
  const comments = useCommentStore((s) => s.commentsByPostId[postId]);
  const loading = useCommentStore((s) => s.loadingPostId === postId);

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

  const commentList = Array.isArray(comments) ? comments : [];
  const totalCount = countAll(commentList);

  return (
    <div className="mt-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {loading
            ? "Loading comments…"
            : `${totalCount} comment${totalCount !== 1 ? "s" : ""}`}
        </h3>
      </div>

      <ReplyComposer postId={postId} parentId={null} />

      <Separator className="my-4" />

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2.5">
              <Skeleton className="mt-0.5 size-6 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && commentList.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No comments yet. Be the first!
        </p>
      )}

      {!loading && commentList.length > 0 && (
        <div className="space-y-4">
          {commentList.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}

function countAll(list) {
  if (!Array.isArray(list)) return 0;
  return list.reduce((acc, c) => acc + 1 + countAll(c.children ?? []), 0);
}
