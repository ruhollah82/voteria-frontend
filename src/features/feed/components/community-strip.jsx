import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpacesStore } from "@/store/spacesStore";

export function CommunityStrip() {
  const { subscribedSpaces } = useSpacesStore();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {subscribedSpaces.map((space) => (
        <Button
          key={space.name}
          variant="outline"
          size="sm"
          className="h-8 shrink-0 bg-card"
        >
          v/{space.name}
          <Badge className="ms-1 hidden bg-muted/70 min-[420px]:inline-flex">
            {space.topic}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
