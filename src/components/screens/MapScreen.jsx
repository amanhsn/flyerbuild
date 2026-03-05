"use client"

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { STATUSES } from "../../data/statusConfig";
import { StatusBadge, BottomSheet } from "../shared";
import { useIsMobile } from "../../hooks/useIsMobile";
import { MapDetailPanel } from "./MapDetailPanel";

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
  const surveys = MOCK_SURVEYS;
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const handleMarkerClick = (s) => {
    setSelectedSurvey(prev => prev?.id === s.id ? null : s);
  };

  const handleClose = () => setSelectedSurvey(null);

  const handleViewFull = (s) => {
    onSelectSurvey?.(s);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div style={{ padding: isMobile ? "12px 16px 8px" : "20px 24px 12px" }}>
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[26px]"} font-extrabold tracking-wide`}>{t("mapTitle")}</h1>
        <p className="font-mono text-sm text-text-secondary mt-1">
          {surveys.length} addresses — {t("mapSub")}
        </p>
      </div>

      {/* Map + Panel */}
      <div className="flex-1 flex overflow-hidden" style={{ margin: "0 16px 16px" }}>
        {/* Map container */}
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
            {surveys.map(s => {
              const color = getHex(s.status);
              const isSelected = selectedSurvey?.id === s.id;
              const isHovered = hoveredId === s.id;
              return (
                <CircleMarker
                  key={s.id}
                  center={[s.address.lat, s.address.lng]}
                  radius={isSelected ? 12 : isHovered ? 10 : 8}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: isSelected ? "#c0392b" : "#fff",
                    weight: isSelected ? 3 : 2,
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
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Desktop/Tablet side panel */}
        {selectedSurvey && !isMobile && (
          <div
            className="w-[340px] shrink-0 border border-l-0 border-border bg-bg-raised overflow-hidden"
            style={{ borderRadius: "0 var(--radius-lg) var(--radius-lg) 0" }}
          >
            <MapDetailPanel
              survey={selectedSurvey}
              onClose={handleClose}
              onViewFull={handleViewFull}
            />
          </div>
        )}
      </div>

      {/* Mobile BottomSheet */}
      {isMobile && (
        <BottomSheet
          open={!!selectedSurvey}
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
