import { useLang } from "../../i18n/LangContext";
import { useIsMobile } from "../../hooks/useIsMobile";

export const ProfileScreen = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const rows = [
    [t("region"), "WERK / MEN"],
    [t("todayDone"), "2/5"],
    [t("syncStatus"), "Online"],
    [t("offlineCache"), "47 MB"],
  ];

  return (
    <div className="flex-1" style={{ padding: isMobile ? 16 : 24, maxWidth: 480 }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center rounded-full bg-primary" style={{
          width: 56, height: 56,
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#fff",
        }}>JJ</div>
        <div>
          <div className="font-display text-[22px] font-extrabold tracking-wide">Jonas Jacobs</div>
          <div className="font-mono text-xs text-text-secondary mt-0.5">Surveyor · Fyber v2.4.0</div>
        </div>
      </div>
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between items-center border-b border-border" style={{
          padding: "14px 0",
        }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-secondary)" }}>{k}</span>
          <span className="font-mono text-[13px] text-text-muted">{v}</span>
        </div>
      ))}
    </div>
  );
};
