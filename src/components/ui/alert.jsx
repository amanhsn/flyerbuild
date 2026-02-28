import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex gap-3",
  {
    variants: {
      variant: {
        default: "bg-bg-raised border-border text-text-primary",
        danger: "bg-red-glow border-red-dim text-text-red",
        success: "bg-green-glow border-green-dim text-text-green",
        warning: "bg-primary-glow border-primary-dim text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = ({ className, variant, ...props }) => (
  <div
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);

const AlertTitle = ({ className, ...props }) => (
  <h5
    className={cn("font-mono text-sm font-semibold", className)}
    {...props}
  />
);

const AlertDescription = ({ className, ...props }) => (
  <div
    className={cn("font-mono text-xs [&_p]:leading-relaxed", className)}
    {...props}
  />
);

export { Alert, AlertTitle, AlertDescription, alertVariants };
