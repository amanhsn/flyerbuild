import { cn } from "../../lib/utils";

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full px-3 py-2.5 bg-bg-elevated border border-border-bright rounded-md text-text-primary font-mono text-sm outline-none transition-colors",
      "focus:border-primary",
      "disabled:bg-bg-overlay disabled:border-border disabled:cursor-default",
      className
    )}
    {...props}
  />
);

export { Input };
