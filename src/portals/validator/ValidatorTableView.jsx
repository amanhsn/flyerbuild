"use client"

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { StatusBadge } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { STATUSES } from "../../data/statusConfig";
import { MOCK_PROJECTS, getProjectForSurvey } from "../../data/mockProjects";
import { useIsMobile } from "../../hooks/useIsMobile";

const ValidatorMap = dynamic(() => import("./ValidatorMap"), { ssr: false });

// ---------------------------------------------------------------------------
// Filter chip helpers
// ---------------------------------------------------------------------------

const COLUMN_FILTERS = {
  project: { label: "Project", type: "dropdown" },
  mro_zone: { label: "MRO Zone", type: "dropdown" },
  pop_area: { label: "POP Zone", type: "dropdown" },
  subcontractor: { label: "Subcontractor", type: "dropdown" },
  status: { label: "Status", type: "multi-select" },
  assigned_surveyor: { label: "Assigned To", type: "dropdown" },
};

function getUniqueValues(surveys, accessor) {
  const vals = new Set();
  surveys.forEach(s => {
    const v = accessor(s);
    if (v) vals.add(v);
  });
  return [...vals].sort();
}

// ---------------------------------------------------------------------------
// ValidatorTableView
// ---------------------------------------------------------------------------

export const ValidatorTableView = ({ surveys, onSelectSurvey, onOpenDrawer }) => {
  const isMobile = useIsMobile();
  const isTablet = typeof window !== "undefined" && window.innerWidth < 1024;

  const [selectedId, setSelectedId] = useState(null);
  const [sortKey, setSortKey] = useState("address");
  const [sortDir, setSortDir] = useState("asc");
  const [showMap, setShowMap] = useState(!isTablet && !isMobile);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});

  // Build unique options for dropdown filters
  const filterOptions = useMemo(() => ({
    project: MOCK_PROJECTS.map(p => ({ value: p.id, label: p.name })),
    mro_zone: getUniqueValues(surveys, s => s.distribution_zone?.mro_zone).map(v => ({ value: v, label: v })),
    pop_area: getUniqueValues(surveys, s => s.distribution_zone?.pop_area).map(v => ({ value: v, label: v })),
    subcontractor: getUniqueValues(surveys, s => s.assigned_subcontractor).map(v => ({ value: v, label: v })),
    status: Object.entries(STATUSES).map(([k, v]) => ({ value: k, label: v.label })),
    assigned_surveyor: getUniqueValues(surveys, s => s.assigned_surveyor).map(v => ({ value: v, label: v })),
  }), [surveys]);

  // Apply filters + search
  const filtered = useMemo(() => {
    let result = surveys;

    // Text search on address
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(s => {
        const addr = `${s.address.street} ${s.address.number} ${s.address.postal_code} ${s.address.city}`.toLowerCase();
        return addr.includes(q) || s.tsg_id.toLowerCase().includes(q);
      });
    }

    // Column filters
    Object.entries(filters).forEach(([key, val]) => {
      if (!val || (Array.isArray(val) && val.length === 0)) return;
      result = result.filter(s => {
        switch (key) {
          case "project": return s.project_id === val;
          case "mro_zone": return s.distribution_zone?.mro_zone === val;
          case "pop_area": return s.distribution_zone?.pop_area === val;
          case "subcontractor": return s.assigned_subcontractor === val;
          case "status": return Array.isArray(val) ? val.includes(s.status) : s.status === val;
          case "assigned_surveyor": return s.assigned_surveyor === val;
          default: return true;
        }
      });
    });

    return result;
  }, [surveys, searchText, filters]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va, vb;
      switch (sortKey) {
        case "address":
          va = `${a.address.street} ${a.address.number}`;
          vb = `${b.address.street} ${b.address.number}`;
          break;
        case "project":
          va = getProjectForSurvey(a)?.name || "";
          vb = getProjectForSurvey(b)?.name || "";
          break;
        case "mro_zone":
          va = a.distribution_zone?.mro_zone || "";
          vb = b.distribution_zone?.mro_zone || "";
          break;
        case "subcontractor":
          va = a.assigned_subcontractor || "";
          vb = b.assigned_subcontractor || "";
          break;
        case "status":
          va = STATUSES[a.status]?.label || "";
          vb = STATUSES[b.status]?.label || "";
          break;
        case "assigned_surveyor":
          va = a.assigned_surveyor || "";
          vb = b.assigned_surveyor || "";
          break;
        case "last_updated":
          va = a.validated_at || a.completed_at || a.assigned_date || "";
          vb = b.validated_at || b.completed_at || b.assigned_date || "";
          break;
        case "priority":
          va = a.priority ? 1 : 0;
          vb = b.priority ? 1 : 0;
          break;
        default:
          va = ""; vb = "";
      }
      const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleRowClick = useCallback((survey) => {
    setSelectedId(survey.id);
    onOpenDrawer(survey);
  }, [onOpenDrawer]);

  const handleMapSelect = useCallback((id) => {
    setSelectedId(id);
    const s = surveys.find(sv => sv.id === id);
    if (s) onOpenDrawer(s);
  }, [surveys, onOpenDrawer]);

  const removeFilter = (key) => {
    setFilters(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchText("");
  };

  const activeFilterCount = Object.keys(filters).filter(k => {
    const v = filters[k];
    return v && (!Array.isArray(v) || v.length > 0);
  }).length + (searchText.trim() ? 1 : 0);

  // Columns config
  const columns = [
    { key: "address", label: "Address", sortable: true, width: "22%" },
    { key: "project", label: "Project", sortable: true, width: "12%" },
    { key: "mro_zone", label: "MRO Zone", sortable: true, width: "11%" },
    { key: "pop_area", label: "POP Zone", width: "10%" },
    { key: "subcontractor", label: "Subcontractor", sortable: true, width: "12%" },
    { key: "status", label: "Status", sortable: true, width: "11%" },
    { key: "assigned_surveyor", label: "Assigned To", sortable: true, width: "11%" },
    { key: "last_updated", label: "Last Updated", sortable: true, width: "9%" },
    { key: "priority", label: "Prio", sortable: true, width: "5%" },
  ];

  // Mobile: card list
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 h-full overflow-y-auto">
        <FilterBar
          searchText={searchText}
          setSearchText={setSearchText}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onClearAll={clearAllFilters}
          activeCount={activeFilterCount}
        />
        {sorted.map(s => (
          <MobileCard key={s.id} survey={s} onClick={() => handleRowClick(s)} isValidated={["completed", "sent"].includes(s.status)} />
        ))}
        {sorted.length === 0 && (
          <div className="text-center font-mono text-xs text-text-muted py-8">No surveys match filters</div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* Map panel - left 45% */}
      {showMap && (
        <div className="h-full rounded-lg overflow-hidden border border-border shrink-0" style={{ width: "45%" }}>
          <ValidatorMap
            surveys={sorted}
            selectedId={selectedId}
            onSelect={handleMapSelect}
          />
        </div>
      )}

      {/* Table panel - right 55% (or 100% when map hidden) */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: showMap ? 12 : 0 }}>
        {/* Filter bar */}
        <FilterBar
          searchText={searchText}
          setSearchText={setSearchText}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          onClearAll={clearAllFilters}
          activeCount={activeFilterCount}
          showMapToggle
          showMap={showMap}
          onToggleMap={() => setShowMap(v => !v)}
        />

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap px-1 pb-2">
            {searchText.trim() && (
              <FilterChip label={`Search: "${searchText}"`} onRemove={() => setSearchText("")} />
            )}
            {Object.entries(filters).map(([key, val]) => {
              if (!val || (Array.isArray(val) && val.length === 0)) return null;
              const label = COLUMN_FILTERS[key]?.label || key;
              const displayVal = Array.isArray(val) ? `${val.length} selected` : filterOptions[key]?.find(o => o.value === val)?.label || val;
              return <FilterChip key={key} label={`${label}: ${displayVal}`} onRemove={() => removeFilter(key)} />;
            })}
            <button onClick={clearAllFilters} className="font-mono text-[10px] text-text-red hover:underline bg-transparent border-none cursor-pointer px-1">
              Clear all
            </button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto border border-border rounded-lg bg-bg-raised">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-[5]">
              <tr className="bg-bg-elevated border-b border-border">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    className="font-mono text-[10px] text-text-muted uppercase tracking-[.08em] py-2 px-2.5 text-left select-none whitespace-nowrap"
                    style={{ width: col.width, cursor: col.sortable ? "pointer" : "default" }}
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="ml-1">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                const project = getProjectForSurvey(s);
                const isValidated = ["completed", "sent"].includes(s.status);
                const isActive = selectedId === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => handleRowClick(s)}
                    className="cursor-pointer transition-colors hover:bg-bg-elevated border-b border-border"
                    style={{
                      background: isActive ? "var(--primary-glow)" : undefined,
                      borderLeft: isValidated ? "3px solid var(--dark-green)" : "3px solid transparent",
                    }}
                  >
                    <td className="font-mono text-xs text-text-primary py-2 px-2.5">
                      <div className="font-semibold">{s.address.street} {s.address.number}</div>
                      <div className="text-text-muted text-[10px]">{s.address.postal_code} {s.address.city}</div>
                    </td>
                    <td className="font-mono text-xs text-text-secondary py-2 px-2.5">{project?.name || "--"}</td>
                    <td className="font-mono text-xs text-text-secondary py-2 px-2.5">{s.distribution_zone?.mro_zone || "--"}</td>
                    <td className="font-mono text-xs text-text-secondary py-2 px-2.5">{s.distribution_zone?.pop_area || "--"}</td>
                    <td className="font-mono text-xs text-text-secondary py-2 px-2.5">{s.assigned_subcontractor || "--"}</td>
                    <td className="py-2 px-2.5"><StatusBadge status={s.status} /></td>
                    <td className="font-mono text-xs text-text-secondary py-2 px-2.5">{s.assigned_surveyor || "--"}</td>
                    <td className="font-mono text-[10px] text-text-muted py-2 px-2.5">
                      {s.validated_at || s.completed_at || s.assigned_date || "--"}
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      {s.priority && <Icon n="star" size={12} color="var(--text-primary-accent)" />}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center font-mono text-xs text-text-muted py-8">
                    No surveys match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="font-mono text-[10px] text-text-muted py-1.5 px-1">
          {sorted.length} of {surveys.length} surveys
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// FilterBar — persistent bar above table
// ---------------------------------------------------------------------------

const FilterBar = ({
  searchText, setSearchText, filters, setFilters, filterOptions,
  onClearAll, activeCount, showMapToggle, showMap, onToggleMap,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="flex items-center gap-2 pb-2 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-[260px]">
        <Icon n="search" size={12} color="var(--text-muted)" className="absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search address..."
          className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-1.5 pl-7 pr-2.5 outline-none focus:border-primary"
        />
      </div>

      {/* Dropdown filters */}
      {Object.entries(COLUMN_FILTERS).map(([key, cfg]) => {
        if (cfg.type === "multi-select" && key === "status") {
          return (
            <div key={key} className="relative">
              <button
                onClick={() => setOpenDropdown(o => o === key ? null : key)}
                className="font-mono text-[10px] bg-bg-elevated border border-border rounded-md text-text-secondary py-1.5 px-2.5 cursor-pointer hover:border-primary-dim whitespace-nowrap"
              >
                {cfg.label} {filters[key]?.length ? `(${filters[key].length})` : ""}
                <Icon n="chevR" size={8} color="var(--text-muted)" className="inline ml-1 rotate-90" />
              </button>
              {openDropdown === key && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-bg-raised border border-border rounded-md shadow-card p-2 min-w-[160px] max-h-[200px] overflow-y-auto">
                  {filterOptions[key]?.map(opt => {
                    const checked = (filters[key] || []).includes(opt.value);
                    return (
                      <label key={opt.value} className="flex items-center gap-2 py-1 px-1 cursor-pointer hover:bg-bg-elevated rounded font-mono text-xs text-text-secondary">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = filters[key] || [];
                            const next = checked ? current.filter(v => v !== opt.value) : [...current, opt.value];
                            setFilters(prev => ({ ...prev, [key]: next }));
                          }}
                          className="accent-[var(--primary)]"
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        return (
          <select
            key={key}
            value={filters[key] || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value || undefined }))}
            className="font-mono text-[10px] bg-bg-elevated border border-border rounded-md text-text-secondary py-1.5 px-2 cursor-pointer"
          >
            <option value="">{cfg.label}</option>
            {filterOptions[key]?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      })}

      {showMapToggle && (
        <button
          onClick={onToggleMap}
          className={`font-mono text-[10px] py-1.5 px-2.5 rounded-md border cursor-pointer transition-colors ${showMap ? "bg-primary text-white border-primary" : "bg-bg-elevated text-text-secondary border-border hover:border-primary-dim"}`}
        >
          <Icon n="map" size={10} color={showMap ? "#fff" : "var(--text-muted)"} className="inline mr-1" />
          Map
        </button>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// FilterChip
// ---------------------------------------------------------------------------

const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-bg-elevated border border-border rounded-full px-2.5 py-0.5 text-text-secondary">
    {label}
    <button onClick={onRemove} className="bg-transparent border-none cursor-pointer p-0 text-text-muted hover:text-text-red">
      <Icon n="x" size={8} color="currentColor" />
    </button>
  </span>
);

// ---------------------------------------------------------------------------
// MobileCard — card layout for <768px
// ---------------------------------------------------------------------------

const MobileCard = ({ survey, onClick, isValidated }) => (
  <div
    onClick={onClick}
    className="survey-card cursor-pointer"
    style={{ borderLeft: isValidated ? "3px solid var(--dark-green)" : undefined }}
  >
    <div className="flex items-center justify-between gap-2 mb-1">
      <StatusBadge status={survey.status} />
      <span className="font-mono text-[10px] text-text-muted">{survey.tsg_id}</span>
    </div>
    <div className="font-display text-sm font-bold tracking-wide">{survey.address.street} {survey.address.number}</div>
    <div className="font-mono text-[10px] text-text-secondary mt-0.5">{survey.address.postal_code} {survey.address.city}</div>
    <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-text-muted">
      <span>{survey.distribution_zone?.mro_zone || "--"}</span>
      <span>{survey.assigned_surveyor || "--"}</span>
      {survey.priority && <Icon n="star" size={10} color="var(--text-primary-accent)" />}
    </div>
  </div>
);
