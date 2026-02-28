import { cn } from "../../lib/utils";

export const ToggleButton = ({ label, variant = "primary", active, onClick, disabled }) => (
  <button
    className={cn(
      "px-5 py-3 rounded-md border font-display text-[17px] font-bold tracking-[.03em] cursor-pointer transition-all",
      "disabled:opacity-55 disabled:cursor-default",
      active
        ? variant === "green"
          ? "bg-green border-green text-white"
          : variant === "red"
            ? "bg-red border-red text-white"
            : "bg-primary border-primary text-white"
        : "bg-bg-elevated border-border text-text-secondary"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);
