import { useLang } from "../../i18n/LangContext";
import { StatusBadge } from "../shared/StatusBadge";
import { disp, mono } from "../../styles/helpers";

export const HistoryScreen = () => {
  const { t } = useLang();
  const history = [
    { date: "Feb 26", address: "Stationsplein 2", status: "completed" },
    { date: "Feb 25", address: "Leiestraat 8", status: "completed" },
    { date: "Feb 24", address: "Nieuwstraat 11", status: "rework" },
    { date: "Feb 23", address: "Molenstraat 23", status: "visited" },
    { date: "Feb 22", address: "Kasteelstraat 16", status: "completed" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      <h2 style={{ ...disp(28, 800), marginBottom: 16 }}>{t("historyTitle")}</h2>
      {history.map((h, i) => (
        <div key={i} style={{
          padding: "14px 16px", marginBottom: 8, borderRadius: "var(--radius-lg)",
          background: "var(--bg-raised)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={mono(11, "var(--text-muted)", { flexShrink: 0, width: 52 })}>{h.date}</div>
          <div style={{ flex: 1, ...disp(17, 600) }}>{h.address}</div>
          <StatusBadge status={h.status} />
        </div>
      ))}
    </div>
  );
};
