import { Icon } from "../../icons/Icon";
import { mono } from "../../styles/helpers";
import { useLang } from "../../i18n/LangContext";

export const SyncBar = ({ online }) => {
  const { t } = useLang();
  return (
    <div className="app-syncbar" style={{
      display: "flex", alignItems: "center", gap: 10, padding: "7px 20px",
      background: online ? "rgba(16,185,129,.06)" : "rgba(192,57,43,.06)",
      borderTop: `1px solid ${online ? "var(--green-dim)" : "var(--primary-dim)"}`,
    }}>
      <Icon n={online ? "wifi" : "wifiOff"} size={13} color={online ? "var(--text-green)" : "var(--text-primary-accent)"} />
      <span style={mono(11, online ? "var(--text-green)" : "var(--text-primary-accent)")}>{online ? t("syncOnline") : t("syncOffline")}</span>
      <span style={{ ...mono(10), marginLeft: "auto" }}>{online ? t("syncDone") : t("syncPending")}</span>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: online ? "var(--green)" : "var(--primary)",
        animation: online ? "none" : "pulseDot 2s infinite",
      }} />
    </div>
  );
};
