import { useState } from "react";
import { Icon } from "../../icons/Icon";
import { mono, disp } from "../../styles/helpers";

export const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border)",
      background: "var(--bg-raised)",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "12px 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--bg-elevated)", border: "none", cursor: "pointer",
          color: "var(--text-primary)",
        }}
      >
        <span style={disp(14, 600)}>{title}</span>
        <Icon
          n="chevR"
          size={14}
          color="var(--text-muted)"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s" }}
        />
      </button>
      {open && (
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
};
