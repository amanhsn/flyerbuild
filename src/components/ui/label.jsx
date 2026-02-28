import { cn } from "../../lib/utils";

const Label = ({ className, ...props }) => (
  <label
    className={cn(
      "font-mono text-xs text-text-muted uppercase tracking-[.08em]",
      className
    )}
    {...props}
  />
);

export { Label };
