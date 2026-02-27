import { useLang } from "../../i18n/LangContext";
import { disp, mono } from "../../styles/helpers";

export const ProfileScreen = () => {
  const { t } = useLang();
  const rows = [
    [t("region"), "WERK / MEN"],
    [t("todayDone"), "2/5"],
    [t("syncStatus"), "Online"],
    [t("offlineCache"), "47 MB"],
  ];

  return (
    <div style={{ flex: 1, padding: 24, maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#fff",
        }}>JJ</div>
        <div>
          <div style={disp(22, 800)}>Jonas Jacobs</div>
          <div style={mono(11, "var(--text-secondary)", { marginTop: 3 })}>Surveyor · Fyber v2.4.0</div>
        </div>
      </div>
      {rows.map(([k, v]) => (
        <div key={k} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 0", borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-secondary)" }}>{k}</span>
          <span style={mono(13)}>{v}</span>
        </div>
      ))}
    </div>
  );
};
