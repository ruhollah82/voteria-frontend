import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Flame, LayoutGrid, ListFilter, Sparkles, TrendingUp } from "lucide-react";

const filters = [
  { label: "Best", icon: Sparkles },
  { label: "Hot", icon: Flame },
  { label: "Rising", icon: TrendingUp },
];

export function FeedFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-2 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1">
        {filters.map((filter) => {
          const Icon = filter.icon;

          return (
            <Button
              key={filter.label}
              size="sm"
              variant={activeFilter === filter.label ? "secondary" : "ghost"}
              onClick={() => onFilterChange(filter.label)}
            >
              <Icon className="size-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        <Separator orientation="vertical" className="hidden h-5 sm:block" />
        <Button size="icon-sm" variant="ghost" aria-label="Change feed layout">
          <LayoutGrid className="size-4" />
        </Button>
        <Button size="icon-sm" variant="ghost" aria-label="Open feed filters">
          <ListFilter className="size-4" />
        </Button>
      </div>
    </div>
  );
}
