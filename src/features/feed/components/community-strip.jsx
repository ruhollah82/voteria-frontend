import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { communities } from "@/lib/voteria-data";

export function CommunityStrip() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {communities.map((community) => (
        <Button
          key={community.name}
          variant="outline"
          size="sm"
          className="h-8 shrink-0 bg-card"
        >
          v/{community.name}
          <Badge className="ms-1 hidden bg-muted/70 min-[420px]:inline-flex">
            {community.topic}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
