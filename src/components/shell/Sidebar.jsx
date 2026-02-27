import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";
import { mono, disp } from "../../styles/helpers";

const DEFAULT_ITEMS = [
  ["dashboard", "dashboard", "Dashboard"],
  ["map",       "map",       "Map"],
  ["history",   "clock",     "History"],
  ["profile",   "user",      "Profile"],
];

export const Sidebar = ({ active, setActive, items, roleLabel = "Surveyor", user, open, onClose }) => {
  const { t, currentUser } = useLang();

  const navItems = items || [
    ["dashboard", "dashboard", t("navDashboard")],
    ["map",       "map",       t("navMap")],
    ["history",   "clock",     t("navHistory")],
    ["profile",   "user",      t("navProfile")],
  ];

  const u = user || {
    name: currentUser?.name || "User",
    initials: (currentUser?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
  };

  const handleNav = (id) => {
    setActive(id);
    onClose?.();
  };

  return (
    <>
      <div className={`sidebar${open ? " open" : ""}`}>
        <div style={{ padding: "0 0 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon n="layers" size={16} color="#fff" />
            </div>
            <div className="sidebar-logo-text">
              <div style={disp(14, 800, undefined, { letterSpacing: ".06em", textTransform: "uppercase", lineHeight: 1 })}>
                {t("appName")}
              </div>
              <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em" })}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(([id, icon, lbl]) => (
            <button key={id} className={`sidebar-nav-item${active === id ? " active" : ""}`} onClick={() => handleNav(id)}>
              <Icon n={icon} size={18} color="currentColor" />
              <span className="sidebar-label">{lbl}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0,
            }}>{u.initials}</div>
            <div className="sidebar-user-info">
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}>{u.name}</div>
              <div style={mono(11, "var(--text-muted)", { marginTop: 1 })}>v2.4.0</div>
            </div>
          </div>
        </div>
      </div>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
};
