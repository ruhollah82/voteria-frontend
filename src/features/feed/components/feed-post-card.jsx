import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";

export function FeedPostCard({ post }) {
  return (
    <Card className="shadow-none transition-colors hover:border-ring/40">
      <article className="p-3 sm:p-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar size="sm" className="mt-0.5">
            <AvatarFallback>
              {post.community.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate font-medium text-foreground">
                v/{post.community}
              </span>
              <span>by {post.author}</span>
              <span>{post.createdAt}</span>
            </div>
            <h2 className="mt-1 text-base font-semibold leading-6 text-card-foreground sm:text-lg">
              <Link to={`/post/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
          </div>
          <Button size="icon-sm" variant="ghost" aria-label="More post options">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center rounded-lg bg-muted p-0.5">
            <Button size="icon-sm" variant="ghost" aria-label="Upvote">
              <ArrowUp className="size-4" />
            </Button>
            <span className="min-w-8 px-1 text-center text-xs font-semibold tabular-nums">
              {post.votes}
            </span>
            <Button size="icon-sm" variant="ghost" aria-label="Downvote">
              <ArrowDown className="size-4" />
            </Button>
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <Button size="sm" variant="ghost" className="px-2">
              <MessageCircle className="size-4" />
              <span className="hidden min-[420px]:inline">{post.comments}</span>
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <Share2 className="size-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Save post">
              <Bookmark className="size-4" />
            </Button>
          </div>
        </div>
      </article>
    </Card>
  );
}
