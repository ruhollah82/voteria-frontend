import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "inline-flex items-center rounded-md border border-transparent bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
      accent:
        "inline-flex items-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground",
      destructive:
        "inline-flex items-center rounded-md border border-transparent bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground",
    };

    return (
      <span
        ref={ref}
        className={cn(variants[variant] ?? variants.default, className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
