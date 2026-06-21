import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, ListFilter, Sparkles, TrendingUp } from "lucide-react";

const filters = [
  { label: "Best", icon: Sparkles },
  { label: "Hot", icon: Flame },
  { label: "Rising", icon: TrendingUp },
];

export function FeedFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-none">
      <div className="flex items-center gap-2 overflow-x-auto p-1.5">
        <span className="hidden shrink-0 px-2 text-xs font-medium text-muted-foreground sm:inline">
          <ListFilter className="size-4" />
        </span>
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.label;

          return (
            <Button
              key={filter.label}
              size="sm"
              variant="ghost"
              className={cn(
                "h-8 shrink-0 px-2.5 text-muted-foreground",
                isActive &&
                  "bg-muted text-foreground shadow-sm hover:bg-muted hover:text-foreground",
              )}
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.label)}
            >
              <Icon className="size-4" />
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
