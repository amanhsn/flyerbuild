export const ChartCard = ({ title, data = [], height = 120 }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-bg-raised border border-border rounded-lg p-4">
      <div className="font-mono text-xs text-text-muted uppercase tracking-[.08em] mb-3">
        {title}
      </div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="font-mono text-xs text-text-secondary">{d.value}</div>
            <div
              className="w-full max-w-[40px] rounded-t-sm min-h-[2px] transition-[height] duration-300 ease-out"
              style={{
                height: `${(d.value / maxVal) * (height - 30)}px`,
                background: d.color || "var(--primary)",
              }}
            />
            <div className="font-mono text-[8px] text-text-muted text-center leading-tight">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
