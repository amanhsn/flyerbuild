import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { STATUSES } from "../../../data/statusConfig";
import { StatusBadge, DataTable, AssignmentModal } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

function getHex(status) {
  return STATUSES[status]?.hex || "#64748b";
}

// Inner component to sync map view with selection and filtered bounds
function MapSync({ filtered, selectedId }) {
  const map = useMap();

  // Fit bounds when filter changes
  useEffect(() => {
    if (filtered.length === 0) return;
    const lats = filtered.map(s => s.address.lat);
    const lngs = filtered.map(s => s.address.lng);
    const bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [filtered, map]);

  // Fly to selected survey
  useEffect(() => {
    if (!selectedId) return;
    const s = filtered.find(s => s.id === selectedId);
    if (s) map.flyTo([s.address.lat, s.address.lng], 15, { duration: 0.6 });
  }, [selectedId, filtered, map]);

  return null;
}

export const GisMapView = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [selectedId, setSelectedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignModal, setAssignModal] = useState(null);
  const [mobileView, setMobileView] = useState("map");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return surveys;
    return surveys.filter(s => s.status === statusFilter);
  }, [surveys, statusFilter]);

  const columns = [
    { key: "tsg_id", label: "TSG ID", width: "90px" },
    { key: "status", label: "Status", width: "120px", render: (r) => <StatusBadge status={r.status} /> },
    { key: "address", label: "Address", render: (r) => `${r.address.street} ${r.address.number}` },
    { key: "city", label: "City", width: "90px", render: (r) => r.address.city },
    { key: "surveyor", label: "Surveyor", width: "130px", render: (r) => r.assigned_surveyor },
    { key: "assign", label: "", width: "40px", render: (r) => (
      <button
        onClick={(e) => { e.stopPropagation(); setAssignModal(r); }}
        className="flex items-center justify-center cursor-pointer rounded-sm"
        style={{ background: "none", border: "none", padding: 4 }}
        title="Assign surveyor"
      >
        <Icon n="user" size={14} color="var(--text-muted)" />
      </button>
    )},
  ];

  const statusOptions = ["all", ...Object.keys(STATUSES)];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header + filter */}
      <div className="flex items-center flex-wrap" style={{ padding: isMobile ? "12px 16px 8px" : "16px 20px 12px", gap: isMobile ? 8 : 12 }}>
        <h2 className={`font-display ${isMobile ? "text-lg" : "text-[22px]"} font-bold tracking-wide`}>GIS Map & Table</h2>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="font-mono text-xs text-text-secondary rounded-sm"
          style={{
            padding: "4px 8px", background: "var(--bg-overlay)",
            border: "1px solid var(--border)",
          }}
        >
          {statusOptions.map(s => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : STATUSES[s]?.label || s}</option>
          ))}
        </select>
        <span className="font-mono text-xs text-text-muted">{filtered.length} addresses</span>
      </div>

      {/* Mobile toggle */}
      {isMobile && (
        <div className="flex gap-1 px-4 pb-2">
          <button className={`filter-btn${mobileView === "map" ? " active" : ""}`} onClick={() => setMobileView("map")}>Map</button>
          <button className={`filter-btn${mobileView === "table" ? " active" : ""}`} onClick={() => setMobileView("table")}>Table</button>
        </div>
      )}

      {/* Split: map left, table right */}
      <div className="flex-1 overflow-hidden" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Map */}
        {(!isMobile || mobileView === "map") && (
          <div style={{
            flex: 1, borderRight: isMobile ? "none" : "1px solid var(--border)",
            margin: isMobile ? "0 16px" : "0 0 0 16px",
            borderRadius: isMobile ? "var(--radius-lg)" : "var(--radius-lg) 0 0 var(--radius-lg)",
            overflow: "hidden",
            minHeight: isMobile ? "50vh" : undefined,
          }}>
            <MapContainer
              center={[50.79, 3.08]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapSync filtered={filtered} selectedId={selectedId} />
              {filtered.map(s => {
                const color = getHex(s.status);
                const isSelected = selectedId === s.id;
                return (
                  <CircleMarker
                    key={s.id}
                    center={[s.address.lat, s.address.lng]}
                    radius={isSelected ? 12 : 8}
                    pathOptions={{
                      fillColor: color,
                      fillOpacity: 0.85,
                      color: isSelected ? "#c0392b" : "#fff",
                      weight: isSelected ? 3 : 2,
                    }}
                    eventHandlers={{
                      click: () => setSelectedId(s.id),
                    }}
                  >
                    <Tooltip>
                      <div className="flex items-center gap-1.5 mb-1">
                        <StatusBadge status={s.status} />
                        <span className="font-mono text-xs text-text-muted">{s.tsg_id}</span>
                      </div>
                      <div className="font-mono text-xs text-text-primary">
                        {s.address.street} {s.address.number}
                      </div>
                      <div className="font-mono text-xs text-text-secondary mt-0.5">
                        {s.address.postal_code} {s.address.city}
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {/* Table */}
        {(!isMobile || mobileView === "table") && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <DataTable
              columns={columns}
              rows={filtered}
              selectedId={selectedId}
              onRowClick={(row) => setSelectedId(row.id)}
            />
          </div>
        )}
      </div>

      {assignModal && (
        <AssignmentModal
          title="Assign Surveyor"
          subtitle={`${assignModal.tsg_id} — ${assignModal.address.street} ${assignModal.address.number}`}
          role="surveyor"
          currentValue={assignModal.assigned_surveyor}
          onCancel={() => setAssignModal(null)}
          onSubmit={(userName, notes) => {
            setSurveys(prev => prev.map(s =>
              s.id === assignModal.id ? { ...s, assigned_surveyor: userName } : s
            ));
            setAssignModal(null);
          }}
        />
      )}
    </div>
  );
};
