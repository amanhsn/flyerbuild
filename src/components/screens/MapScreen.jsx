import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { STATUSES } from "../../data/statusConfig";
import { StatusBadge } from "../shared";
import { useIsMobile } from "../../hooks/useIsMobile";

function getHex(status) {
  return STATUSES[status]?.hex || "#64748b";
}

export const MapScreen = ({ onSelectSurvey }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const surveys = MOCK_SURVEYS;
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div style={{ padding: isMobile ? "12px 16px 8px" : "20px 24px 12px" }}>
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[26px]"} font-extrabold tracking-wide`}>{t("mapTitle")}</h1>
        <p className="font-mono text-sm text-text-secondary mt-1">
          {surveys.length} addresses — {t("mapSub")}
        </p>
      </div>

      {/* Leaflet map */}
      <div style={{ flex: 1, margin: "0 16px 16px", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}>
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
          {surveys.map(s => {
            const color = getHex(s.status);
            const isHovered = hoveredId === s.id;
            return (
              <CircleMarker
                key={s.id}
                center={[s.address.lat, s.address.lng]}
                radius={isHovered ? 12 : 8}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.85,
                  color: "#fff",
                  weight: 2,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredId(s.id),
                  mouseout: () => setHoveredId(null),
                  click: () => onSelectSurvey?.(s),
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
    </div>
  );
};
