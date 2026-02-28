import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";

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
        <div className="pb-3 border-b border-border">
          <div className="px-5 py-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center shrink-0">
              <Icon n="layers" size={16} color="#fff" />
            </div>
            <div className="sidebar-logo-text">
              <div className="font-display text-sm font-extrabold tracking-wide uppercase leading-none">
                {t("appName")}
              </div>
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
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
        <div className="px-5 py-3 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display font-extrabold text-[13px] text-white shrink-0">
              {u.initials}
            </div>
            <div className="sidebar-user-info">
              <div className="font-body font-semibold text-[13px]">{u.name}</div>
              <div className="font-mono text-xs text-text-muted mt-px">v2.4.0</div>
            </div>
          </div>
        </div>
      </div>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
};
