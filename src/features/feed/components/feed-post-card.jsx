import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowBigDown, ArrowBigUp, Bookmark, MessageCircle, Share2 } from "lucide-react";

export function FeedPostCard({ post }) {
  return (
    <Card className="overflow-hidden">
      <article className="grid grid-cols-[3rem_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-1 border-e border-border bg-muted/40 py-4">
          <Button size="icon-sm" variant="ghost" aria-label="Upvote">
            <ArrowBigUp className="size-4" />
          </Button>
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {post.votes}
          </span>
          <Button size="icon-sm" variant="ghost" aria-label="Downvote">
            <ArrowBigDown className="size-4" />
          </Button>
        </div>

        <div className="min-w-0 p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Avatar size="sm">
              <AvatarFallback>{post.community.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">v/{post.community}</span>
            <span>posted by {post.author}</span>
            <span>{post.createdAt}</span>
          </div>

          <div className="mt-3 space-y-2">
            <h2 className="text-lg font-semibold text-card-foreground">
              {post.title}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {post.description}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap items-center gap-1">
            <Button size="sm" variant="ghost">
              <MessageCircle className="size-4" />
              {post.comments} comments
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="size-4" />
              Share
            </Button>
            <Button size="sm" variant="ghost">
              <Bookmark className="size-4" />
              Save
            </Button>
          </div>
        </div>
      </article>
    </Card>
  );
}
