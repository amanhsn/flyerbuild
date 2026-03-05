"use client"

import { useState } from "react";
import { Icon } from "../../icons/Icon";
import { useLang } from "../../i18n/LangContext";

export const Sidebar = ({ active, setActive, items, roleLabel = "Surveyor", user, open, onClose, collapsed = false }) => {
  const { t, currentUser } = useLang();
  const [expandedGroups, setExpandedGroups] = useState({});

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

  const toggleGroup = (id) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ── Collapsed (icon-only) sidebar ──
  if (collapsed) {
    return (
      <div className="sidebar sidebar-collapsed">
        <div className="py-3 border-b border-border flex justify-center">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center shrink-0">
            <Icon n="layers" size={16} color="#fff" />
          </div>
        </div>
        <nav className="sidebar-nav flex flex-col items-center">
          {navItems.map((item) => {
            const [id, icon, lbl, children] = item;
            // For items with children, treat parent icon click as navigating to first child
            const targetId = children?.length ? children[0][0] : id;
            const isActive = children?.length
              ? children.some(([subId]) => active === subId)
              : active === id;
            return (
              <button
                key={id}
                className={`sidebar-nav-item sidebar-nav-collapsed${isActive ? " active" : ""}`}
                onClick={() => handleNav(targetId)}
                title={lbl}
              >
                <Icon n={icon} size={18} color="currentColor" />
              </button>
            );
          })}
        </nav>
        <div className="py-3 border-t border-border flex justify-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display font-extrabold text-[13px] text-white shrink-0">
            {u.initials}
          </div>
        </div>
      </div>
    );
  }

  // ── Full sidebar ──
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
          {navItems.map((item) => {
            // Support sub-items: [id, icon, label, children]
            // children = [[subId, subLabel], ...]
            const [id, icon, lbl, children] = item;

            if (children && children.length > 0) {
              const isExpanded = expandedGroups[id];
              const isChildActive = children.some(([subId]) => active === subId);
              return (
                <div key={id}>
                  <button
                    className={`sidebar-nav-item${isChildActive ? " active" : ""}`}
                    onClick={() => toggleGroup(id)}
                  >
                    <Icon n={icon} size={18} color="currentColor" />
                    <span className="sidebar-label flex-1 text-left">{lbl}</span>
                    <Icon
                      n="chevron-right"
                      size={12}
                      color="currentColor"
                      className={`transition-transform duration-200 ${isExpanded || isChildActive ? "rotate-90" : ""}`}
                    />
                  </button>
                  {(isExpanded || isChildActive) && (
                    <div className="flex flex-col">
                      {children.map(([subId, subLabel]) => (
                        <button
                          key={subId}
                          className={`sidebar-nav-item pl-11 text-[12px]${active === subId ? " active" : ""}`}
                          onClick={() => handleNav(subId)}
                        >
                          <span className="sidebar-label">{subLabel}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button key={id} className={`sidebar-nav-item${active === id ? " active" : ""}`} onClick={() => handleNav(id)}>
                <Icon n={icon} size={18} color="currentColor" />
                <span className="sidebar-label">{lbl}</span>
              </button>
            );
          })}
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
