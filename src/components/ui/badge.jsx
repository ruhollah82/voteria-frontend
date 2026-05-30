import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700",
      accent:
        "rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-xs font-semibold",
      destructive:
        "rounded-full bg-destructive text-destructive-foreground px-2.5 py-1 text-xs font-semibold",
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
