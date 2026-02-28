import { cn } from "../../lib/utils";

const Skeleton = ({ className, ...props }) => (
  <div
    className={cn(
      "bg-gradient-to-r from-bg-elevated via-bg-overlay to-bg-elevated bg-[length:800px_100%] animate-shimmer rounded-md",
      className
    )}
    {...props}
  />
);

export { Skeleton };
