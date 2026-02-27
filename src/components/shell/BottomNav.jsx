import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";

const DEFAULT_ITEMS = null; // will use surveyor defaults below

export const BottomNav = ({ active, setActive, items }) => {
  const { t } = useLang();
  const defaultItems = [
    { id: "dashboard", icon: "dashboard", label: t("navDashboard") },
    { id: "map",       icon: "map",       label: t("navMap") },
    { id: "history",   icon: "clock",     label: t("navHistory") },
    { id: "profile",   icon: "user",      label: t("navProfile") },
  ];

  const navItems = items || defaultItems;

  return (
    <nav className="bottom-nav">
      {navItems.map(({ id, icon, label }) => (
        <button key={id} className={`bottom-nav-item${active === id ? " active" : ""}`} onClick={() => setActive(id)}>
          <Icon n={icon} size={20} />
          {label}
        </button>
      ))}
    </nav>
  );
};
