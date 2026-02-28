import { cn } from "../../lib/utils";

const Select = ({ className, ...props }) => (
  <select
    className={cn(
      "w-full px-3.5 py-2.5 bg-bg-overlay text-text-primary border border-border rounded-sm font-mono text-xs cursor-pointer",
      "disabled:cursor-default disabled:opacity-55",
      className
    )}
    {...props}
  />
);

export { Select };
