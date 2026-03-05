"use client"

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

const SurveyMiniMap = ({ lat, lng, label, height = 160 }) => {
  if (!lat || !lng) return null;

  return (
    <div
      className="rounded-md overflow-hidden border border-border"
      style={{ height }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker
          center={[lat, lng]}
          radius={8}
          pathOptions={{
            fillColor: "#c0392b",
            fillOpacity: 0.9,
            color: "#fff",
            weight: 2,
          }}
        >
          {label && (
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-mono text-xs">{label}</span>
            </Tooltip>
          )}
        </CircleMarker>
      </MapContainer>
    </div>
  );
};

export default SurveyMiniMap;
