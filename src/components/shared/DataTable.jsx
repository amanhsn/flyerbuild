import { useState, useMemo } from "react";
import { EmptyState } from "./EmptyState";
import { cn } from "../../lib/utils";

export const DataTable = ({ columns, rows, onRowClick, selectedId, emptyMessage = "No data" }) => {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-bg-raised">
      <div className="overflow-x-auto">
        {/* Header */}
        <div className="flex border-b border-border bg-bg-elevated px-3 min-w-fit">
          {columns.map(col => (
            <div
              key={col.key}
              onClick={() => handleSort(col.key)}
              className="font-mono text-xs text-text-muted uppercase tracking-[.08em] py-2.5 px-1.5 cursor-pointer select-none"
              style={{ flex: col.width ? `0 0 ${col.width}` : 1 }}
            >
              {col.label} {sortKey === col.key ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}
            </div>
          ))}
        </div>

        {/* Rows */}
        {sorted.length === 0 ? (
          <EmptyState icon="list" message={emptyMessage} pad={24} />
        ) : (
          sorted.map((row, i) => (
            <div
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "flex px-3 min-w-fit transition-colors",
                onRowClick ? "cursor-pointer" : "cursor-default",
                i < sorted.length - 1 && "border-b border-border",
                selectedId && row.id === selectedId ? "bg-primary-glow" : "bg-transparent"
              )}
            >
              {columns.map(col => (
                <div
                  key={col.key}
                  className="font-mono text-xs text-text-secondary py-2.5 px-1.5 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ flex: col.width ? `0 0 ${col.width}` : 1 }}
                >
                  {col.render ? col.render(row) : row[col.key] ?? "--"}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
