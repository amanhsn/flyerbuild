import { useState } from "react";
import { Icon } from "../../icons/Icon";
import { cn } from "../../lib/utils";

export const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-md border border-border bg-bg-raised overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3.5 py-3 flex items-center justify-between bg-bg-elevated border-none cursor-pointer text-text-primary"
      >
        <span className="font-display text-sm font-semibold tracking-wide">{title}</span>
        <Icon
          n="chevR"
          size={14}
          color="var(--text-muted)"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s" }}
        />
      </button>
      {open && (
        <div className="px-3.5 py-3 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
};
