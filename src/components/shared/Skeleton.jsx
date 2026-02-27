export const Skeleton = ({ width = "100%", height = 16, radius, style }) => (
  <div
    className="skeleton"
    style={{
      width,
      height,
      borderRadius: radius,
      ...style,
    }}
  />
);

export const SkeletonKpiCard = () => (
  <div style={{
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 10,
    flex: 1, minWidth: 0,
  }}>
    <Skeleton width={80} height={10} />
    <Skeleton width={48} height={28} />
    <Skeleton height={3} radius={2} />
  </div>
);

export const SkeletonSurveyCard = ({ delay = 0 }) => (
  <div
    className="survey-card"
    style={{ pointerEvents: "none", animationDelay: `${delay}ms` }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", gap: 7 }}>
          <Skeleton width={60} height={18} radius="var(--radius-sm)" />
          <Skeleton width={80} height={18} radius="var(--radius-sm)" />
        </div>
        <Skeleton width="70%" height={18} />
        <Skeleton width="50%" height={14} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 13, paddingTop: 11, borderTop: "1px solid var(--border)" }}>
      <Skeleton width={60} height={14} />
      <Skeleton width={50} height={14} />
      <Skeleton width={40} height={14} style={{ marginLeft: "auto" }} />
    </div>
  </div>
);
