export const MiniProgress = ({ val, total, color }) => {
  const barColor = color || "var(--primary)";
  return (
    <div className="flex-1 flex items-center gap-2">
      <div className="flex-1 h-[3px] bg-bg-overlay rounded-sm">
        <div
          className="h-full rounded-sm transition-[width] duration-400 ease-out"
          style={{
            width: `${total > 0 ? (val / total) * 100 : 0}%`,
            background: barColor,
          }}
        />
      </div>
      <span className="font-mono text-xs text-text-muted shrink-0">{val}/{total}</span>
    </div>
  );
};
