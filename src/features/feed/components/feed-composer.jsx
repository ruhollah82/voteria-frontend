import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image, Link2, Plus } from "lucide-react";

export function FeedComposer() {
  return (
    <Card className="border-dashed bg-card/80 p-2.5 shadow-none">
      <div className="flex min-w-0 items-center gap-2">
        <Avatar>
          <AvatarFallback>VT</AvatarFallback>
        </Avatar>
        <Input
          className="h-9 min-w-0 bg-muted/50"
          placeholder="Create a post"
        />
        <Button size="icon-sm" variant="ghost" aria-label="Attach media">
          <Image className="size-4" />
        </Button>
        <Button className="hidden sm:inline-flex" size="icon-sm" variant="ghost" aria-label="Add link">
          <Link2 className="size-4" />
        </Button>
        <Button size="icon-sm" aria-label="Create post">
          <Plus className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
