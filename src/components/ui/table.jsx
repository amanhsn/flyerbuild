import { cn } from "../../lib/utils";

const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn("w-full caption-bottom", className)} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b [&_tr]:border-border", className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr
    className={cn(
      "border-b border-border transition-colors hover:bg-bg-elevated",
      className
    )}
    {...props}
  />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      "h-10 px-3 text-left align-middle font-mono text-xs text-text-muted uppercase tracking-[.08em] font-semibold",
      className
    )}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td
    className={cn(
      "px-3 py-2.5 align-middle font-mono text-xs text-text-secondary",
      className
    )}
    {...props}
  />
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
