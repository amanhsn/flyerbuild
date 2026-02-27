import { useState, useMemo } from "react";
import { mono, disp } from "../../styles/helpers";

/**
 * DataTable — reusable sortable data table.
 * columns: [{ key, label, width?, render?(row) }]
 * rows: array of objects
 * onRowClick: (row) => void
 * selectedId: highlight row matching this id
 */
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
    <div style={{
      border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
      overflow: "hidden", background: "var(--bg-raised)",
    }}>
      <div style={{ overflowX: "auto" }}>
        {/* Header */}
        <div style={{
          display: "flex", borderBottom: "1px solid var(--border)",
          background: "var(--bg-elevated)", padding: "0 12px",
          minWidth: "fit-content",
        }}>
          {columns.map(col => (
            <div
              key={col.key}
              onClick={() => handleSort(col.key)}
              style={{
                ...mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" }),
                padding: "10px 6px", cursor: "pointer", userSelect: "none",
                flex: col.width ? `0 0 ${col.width}` : 1,
              }}
            >
              {col.label} {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </div>
          ))}
        </div>

        {/* Rows */}
        {sorted.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", ...mono(12, "var(--text-muted)") }}>
            {emptyMessage}
          </div>
        ) : (
          sorted.map((row, i) => (
            <div
              key={row.id ?? i}
              onClick={() => onRowClick?.(row)}
              style={{
                display: "flex", padding: "0 12px", cursor: onRowClick ? "pointer" : "default",
                borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none",
                background: selectedId && row.id === selectedId ? "var(--primary-glow)" : "transparent",
                transition: "background .15s",
                minWidth: "fit-content",
              }}
            >
              {columns.map(col => (
                <div
                  key={col.key}
                  style={{
                    ...mono(11, "var(--text-secondary)"),
                    padding: "10px 6px", overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", flex: col.width ? `0 0 ${col.width}` : 1,
                  }}
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
