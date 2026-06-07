import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCommentStore } from "@/store/commentStore";

export function CommentVoter({ postId, commentId, votes, userVote }) {
  const vote = useCommentStore((s) => s.vote);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const handleVote = (direction) => {
    if (!token) {
      navigate("/login");
      return;
    }
    vote(postId, commentId, direction);
  };

  return (
    <div className="flex items-center gap-0.5">
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label="Upvote"
        onClick={() => handleVote(1)}
        className={cn(
          "h-6 w-6 rounded",
          userVote === 1 && "text-primary hover:text-primary",
        )}
      >
        <ArrowUp className="size-3.5" />
      </Button>
      <span
        className={cn(
          "min-w-6 text-center text-xs font-semibold tabular-nums",
          userVote === 1 && "text-primary",
          userVote === -1 && "text-destructive",
        )}
      >
        {votes}
      </span>
      <Button
        size="icon-xs"
        variant="ghost"
        aria-label="Downvote"
        onClick={() => handleVote(-1)}
        className={cn(
          "h-6 w-6 rounded",
          userVote === -1 && "text-destructive hover:text-destructive",
        )}
      >
        <ArrowDown className="size-3.5" />
      </Button>
    </div>
  );
}
