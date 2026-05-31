import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Image, Link2, PenLine } from "lucide-react";

export function FeedComposer() {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>VT</AvatarFallback>
        </Avatar>
        <Input
          className="h-10 rounded-lg bg-muted/60"
          placeholder="Start a conversation"
        />
        <Button size="icon" variant="ghost" aria-label="Write text post">
          <PenLine className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Attach media">
          <Image className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Add link">
          <Link2 className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
