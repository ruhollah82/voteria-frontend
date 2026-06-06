import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentVoter } from "./CommentVoter";
import { ReplyComposer } from "./ReplyComposer";
import { useCommentStore } from "@/store/commentStore";

const MAX_DEPTH = 6;

export function CommentItem({ comment, postId, depth = 0 }) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);

  const toggleCollapse = useCommentStore((s) => s.toggleCollapse);
  const deleteComment = useCommentStore((s) => s.deleteComment);
  const editComment = useCommentStore((s) => s.editComment);

  const isCurrentUser = author === "u/you" || author === "u/voterian";

  const handleEdit = async () => {
    if (!editBody.trim() || editBody === comment.body) {
      setEditing(false);
      return;
    }
    await editComment(postId, comment.id, editBody.trim());
    setEditing(false);
  };

  const author = comment.author ?? "u/??";
  const initials = author.startsWith("u/")
    ? author.slice(2, 4).toUpperCase()
    : author.slice(0, 2).toUpperCase();

  return (
    <div className={cn("group/comment flex gap-2.5", depth > 0 && "mt-3")}>
      {/* collapse gutter */}
      <div className="flex flex-col items-center gap-0">
        <Avatar
          size="sm"
          className="mt-0.5 shrink-0 cursor-pointer"
          onClick={() => toggleCollapse(postId, comment.id)}
        >
          <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
        </Avatar>
        {!comment.collapsed && (comment.children?.length > 0 || true) && (
          <button
            onClick={() => toggleCollapse(postId, comment.id)}
            aria-label="Collapse thread"
            className="mt-1 w-px flex-1 rounded-full bg-border transition-colors hover:bg-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        )}
      </div>

      {/* content */}
      <div className="min-w-0 flex-1 pb-1">
        {/* header */}
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{author}</span>
          <span>{comment.votes} points</span>
          <span>·</span>
          <span>{comment.createdAt}</span>
          {comment.edited && <span className="italic">(edited)</span>}

          <div className="ml-auto flex items-center opacity-0 transition-opacity group-hover/comment:opacity-100">
            <Button
              size="icon-xs"
              variant="ghost"
              className="h-6 w-6"
              aria-label={comment.collapsed ? "Expand" : "Collapse"}
              onClick={() => toggleCollapse(postId, comment.id)}
            >
              {comment.collapsed ? (
                <ChevronDown className="size-3.5" />
              ) : (
                <ChevronUp className="size-3.5" />
              )}
            </Button>

            {isCurrentUser && !comment.deleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    className="h-6 w-6"
                    aria-label="Comment options"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditing(true);
                      setEditBody(comment.body);
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => deleteComment(postId, comment.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* collapsed view */}
        {comment.collapsed ? (
          <button
            className="mt-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => toggleCollapse(postId, comment.id)}
          >
            {comment.children?.length
              ? `[+] ${comment.children.length} ${comment.children.length === 1 ? "reply" : "replies"} collapsed`
              : "[+] comment collapsed"}
          </button>
        ) : (
          <>
            {/* body */}
            {editing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  autoFocus
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="min-h-20 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditing(false);
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      handleEdit();
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className={cn(
                  "mt-1 text-sm leading-6",
                  comment.deleted && "italic text-muted-foreground",
                )}
              >
                {comment.body}
              </p>
            )}

            {/* actions */}
            {!comment.deleted && (
              <div className="mt-1.5 flex items-center gap-1">
                <CommentVoter
                  postId={postId}
                  commentId={comment.id}
                  votes={comment.votes}
                  userVote={comment.userVote ?? 0}
                />
                <Button
                  size="xs"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-muted-foreground"
                  onClick={() => setReplying((v) => !v)}
                >
                  <MessageSquare className="size-3.5" />
                  Reply
                </Button>
              </div>
            )}

            {/* reply composer */}
            {replying && (
              <ReplyComposer
                postId={postId}
                parentId={comment.id}
                onClose={() => setReplying(false)}
              />
            )}

            {/* recursive children */}
            {comment.children?.length > 0 && (
              <div
                className={cn("mt-1 space-y-0", depth >= MAX_DEPTH && "pl-0")}
              >
                {comment.children.map((child) => (
                  <CommentItem
                    key={child.id}
                    comment={child}
                    postId={postId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
