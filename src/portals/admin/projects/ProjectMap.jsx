"use client"

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { STATUSES } from "../../../data/statusConfig";
import { StatusBadge } from "../../../components/shared";

function getHex(status) {
  return STATUSES[status]?.hex || "#64748b";
}

function MapSync({ surveys, selectedId }) {
  const map = useMap();

  useEffect(() => {
    if (surveys.length === 0) return;
    const lats = surveys.map((s) => s.address.lat);
    const lngs = surveys.map((s) => s.address.lng);
    const bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [surveys, map]);

  useEffect(() => {
    if (!selectedId) return;
    const s = surveys.find((s) => s.id === selectedId);
    if (s) map.flyTo([s.address.lat, s.address.lng], 15, { duration: 0.6 });
  }, [selectedId, surveys, map]);

  return null;
}

const ProjectMap = ({ surveys, selectedId, onSelect }) => {
  return (
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
      <MapSync surveys={surveys} selectedId={selectedId} />
      {surveys.map((s) => {
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
            eventHandlers={{ click: () => onSelect(s.id) }}
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
  );
};

export default ProjectMap;
