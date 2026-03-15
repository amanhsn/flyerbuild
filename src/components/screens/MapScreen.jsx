"use client"

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, useMap } from "react-leaflet";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { STATUSES } from "../../data/statusConfig";
import { StatusBadge, BottomSheet } from "../shared";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MapDetailPanel } from "./MapDetailPanel";
import { Icon } from "../../icons/Icon";

function getHex(status) {
  return STATUSES[status]?.hex || "#64748b";
}

function MapFlyTo({ survey }) {
  const map = useMap();
  useEffect(() => {
    if (!survey) return;
    map.flyTo([survey.address.lat, survey.address.lng], 16, { duration: 0.6 });
  }, [survey, map]);
  return null;
}

export const MapScreen = ({ onSelectSurvey }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [multiSelected, setMultiSelected] = useState(new Set());
  const [groups, setGroups] = useState([]); // Array of { ids: Set, mainId: number }

  const handleMarkerClick = useCallback((s) => {
    if (multiSelectMode) {
      setMultiSelected(prev => {
        const next = new Set(prev);
        if (next.has(s.id)) next.delete(s.id);
        else next.add(s.id);
        return next;
      });
    } else {
      setSelectedSurvey(prev => prev?.id === s.id ? null : s);
    }
  }, [multiSelectMode]);

  const handleClose = () => setSelectedSurvey(null);
  const handleViewFull = (s) => onSelectSurvey?.(s);

  const handleGroup = useCallback(() => {
    if (multiSelected.size < 2) return;
    const ids = new Set(multiSelected);
    const mainId = [...ids][0];
    setGroups(prev => [...prev, { ids, mainId }]);
    setMultiSelected(new Set());
    setMultiSelectMode(false);
  }, [multiSelected]);

  const handleSplit = useCallback((groupIndex) => {
    setGroups(prev => prev.filter((_, i) => i !== groupIndex));
  }, []);

  const getGroupForSurvey = (surveyId) => {
    return groups.findIndex(g => g.ids.has(surveyId));
  };

  // Generate lines between grouped buildings
  const groupLines = groups.flatMap((group, gi) => {
    const ids = [...group.ids];
    const lines = [];
    for (let i = 0; i < ids.length - 1; i++) {
      const s1 = surveys.find(s => s.id === ids[i]);
      const s2 = surveys.find(s => s.id === ids[i + 1]);
      if (s1 && s2) {
        lines.push({
          key: `${gi}-${i}`,
          positions: [[s1.address.lat, s1.address.lng], [s2.address.lat, s2.address.lng]],
          groupIndex: gi,
        });
      }
    }
    return lines;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div style={{ padding: isMobile ? "12px 16px 8px" : "20px 24px 12px" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[26px]"} font-extrabold tracking-wide`}>{t("mapTitle")}</h1>
            <p className="font-mono text-sm text-text-secondary mt-1">
              {surveys.length} addresses — {t("mapSub")}
            </p>
          </div>
          <button
            onClick={() => { setMultiSelectMode(v => !v); setMultiSelected(new Set()); }}
            className={`toggle-btn ${multiSelectMode ? "primary active" : "primary"} flex items-center gap-1.5`}
            style={{ padding: "6px 14px" }}
          >
            <Icon n="layers" size={14} color={multiSelectMode ? "#fff" : "var(--primary)"} />
            {multiSelectMode ? "Cancel Selection" : "Group / Split"}
          </button>
        </div>
      </div>

      {/* Multi-select action bar */}
      {multiSelectMode && multiSelected.size > 0 && (
        <div className="flex items-center gap-3 mx-4 mb-2 px-4 py-2.5 bg-bg-raised border border-primary-dim rounded-lg">
          <span className="font-mono text-xs text-text-primary">
            {multiSelected.size} building{multiSelected.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex-1" />
          {multiSelected.size >= 2 && (
            <button
              onClick={handleGroup}
              className="toggle-btn green active flex items-center gap-1.5"
              style={{ padding: "6px 14px" }}
            >
              <Icon n="layers" size={14} color="#fff" />
              Group Buildings
            </button>
          )}
          <button
            onClick={() => setMultiSelected(new Set())}
            className="toggle-btn flex items-center gap-1"
            style={{ padding: "6px 12px" }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Groups info */}
      {groups.length > 0 && !multiSelectMode && (
        <div className="flex gap-2 mx-4 mb-2 overflow-x-auto">
          {groups.map((group, gi) => {
            const mainSurvey = surveys.find(s => s.id === group.mainId);
            return (
              <div key={gi} className="flex items-center gap-2 px-3 py-1.5 bg-bg-raised border border-border rounded-md shrink-0">
                <Icon n="layers" size={12} color="var(--dark-green)" />
                <span className="font-mono text-[10px] text-text-primary">
                  Group: {[...group.ids].map(id => surveys.find(s => s.id === id)?.tsg_id).join(" + ")}
                </span>
                <button
                  onClick={() => handleSplit(gi)}
                  className="font-mono text-[10px] text-text-red bg-transparent border-none cursor-pointer underline"
                >
                  Split
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Map + Panel */}
      <div className="flex-1 flex overflow-hidden" style={{ margin: "0 16px 16px" }}>
        <div
          className="flex-1 overflow-hidden border border-border"
          style={{
            borderRadius: selectedSurvey && !isMobile
              ? "var(--radius-lg) 0 0 var(--radius-lg)"
              : "var(--radius-lg)",
          }}
        >
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
            <MapFlyTo survey={selectedSurvey} />

            {/* Group connecting lines */}
            {groupLines.map(line => (
              <Polyline
                key={line.key}
                positions={line.positions}
                pathOptions={{ color: "#1a6e3c", weight: 2, dashArray: "6 4", opacity: 0.7 }}
              />
            ))}

            {surveys.map(s => {
              const color = getHex(s.status);
              const isSelected = selectedSurvey?.id === s.id;
              const isHovered = hoveredId === s.id;
              const isMultiSelected = multiSelected.has(s.id);
              const groupIdx = getGroupForSurvey(s.id);
              const isGrouped = groupIdx >= 0;

              return (
                <CircleMarker
                  key={s.id}
                  center={[s.address.lat, s.address.lng]}
                  radius={isSelected || isMultiSelected ? 12 : isHovered ? 10 : 8}
                  pathOptions={{
                    fillColor: isMultiSelected ? "#2563eb" : isGrouped ? "#1a6e3c" : color,
                    fillOpacity: 0.85,
                    color: isSelected ? "#c0392b" : isMultiSelected ? "#2563eb" : isGrouped ? "#1a6e3c" : "#fff",
                    weight: isSelected || isMultiSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    mouseover: () => setHoveredId(s.id),
                    mouseout: () => setHoveredId(null),
                    click: () => handleMarkerClick(s),
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
                    {isGrouped && (
                      <div className="font-mono text-[10px] mt-1" style={{ color: "#1a6e3c" }}>
                        Grouped with {[...groups[groupIdx].ids].filter(id => id !== s.id).map(id => surveys.find(sv => sv.id === id)?.tsg_id).join(", ")}
                      </div>
                    )}
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Desktop side panel */}
        {selectedSurvey && !isMobile && !multiSelectMode && (
          <div
            className="w-[340px] shrink-0 border border-l-0 border-border bg-bg-raised overflow-hidden"
            style={{ borderRadius: "0 var(--radius-lg) var(--radius-lg) 0" }}
          >
            <MapDetailPanel
              survey={selectedSurvey}
              onClose={handleClose}
              onViewFull={handleViewFull}
            />
            {/* Group warning banner */}
            {getGroupForSurvey(selectedSurvey.id) >= 0 && (
              <div className="mx-4 mb-4 px-3 py-2 rounded-md" style={{
                background: "var(--amber-glow)", border: "1px solid var(--amber-dim)",
              }}>
                <div className="font-mono text-[10px] text-amber font-semibold">Grouped Building</div>
                <div className="font-mono text-[10px] text-text-secondary mt-0.5">
                  This building shares entrance/basement with{" "}
                  {[...groups[getGroupForSurvey(selectedSurvey.id)].ids]
                    .filter(id => id !== selectedSurvey.id)
                    .map(id => surveys.find(s => s.id === id)?.address)
                    .filter(Boolean)
                    .map(a => `${a.street} ${a.number}`)
                    .join(", ")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile BottomSheet */}
      {isMobile && (
        <BottomSheet
          open={!!selectedSurvey && !multiSelectMode}
          onClose={handleClose}
          title={selectedSurvey ? `${selectedSurvey.address.street} ${selectedSurvey.address.number}` : ""}
        >
          {selectedSurvey && (
            <MapDetailPanel
              survey={selectedSurvey}
              onClose={handleClose}
              onViewFull={handleViewFull}
            />
          )}
        </BottomSheet>
      )}
    </div>
  );
};
