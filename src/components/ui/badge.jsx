import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-mono text-xs font-semibold tracking-[.08em] uppercase px-2 py-0.5 rounded-sm border",
  {
    variants: {
      variant: {
        default: "bg-bg-elevated text-text-secondary border-border",
        primary: "bg-primary-dim text-primary border-primary",
        success: "bg-green-dim text-green border-green",
        danger: "bg-red-dim text-red border-red",
        warning: "bg-primary-dim text-primary border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = ({ className, variant, ...props }) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { Badge, badgeVariants };
