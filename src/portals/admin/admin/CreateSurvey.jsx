import { useState } from "react";
import { Field } from "../../../components/shared";
import { ToggleButton } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { getUsersByRole } from "../../../data/mockUsers";
import {
  emptyPhotos, emptyAgreement, emptyBuildingInfo,
  emptyBuildingOwner, emptyDistributionZone, emptyFacadeStreet,
  emptyExistingTelecom, emptyExecutionQuantities,
} from "../../../data/mockSurveys";

const BUILDING_TYPES = [
  { value: "single_family", label: "Single Family" },
  { value: "terraced",      label: "Terraced" },
  { value: "semi_detached",  label: "Semi-Detached" },
  { value: "apartment",     label: "Apartment" },
];

export const CreateSurvey = ({ onSubmit, onCancel }) => {
  const isMobile = useIsMobile();
  const surveyors = getUsersByRole("surveyor");

  const [form, setForm] = useState({
    tsg_id: "",
    street: "",
    number: "",
    postal_code: "",
    city: "",
    building_type: "single_family",
    priority: false,
    assigned_surveyor: "",
  });

  const set = (key) => (v) => setForm(f => ({ ...f, [key]: typeof v === "string" || typeof v === "boolean" ? v : v }));

  const canSubmit = form.tsg_id.trim() && form.street.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      tsg_id: form.tsg_id.trim(),
      building_id: `BLD-${form.tsg_id.trim()}`,
      address: {
        street: form.street.trim(),
        number: form.number.trim(),
        bus: "",
        postal_code: form.postal_code.trim(),
        city: form.city.trim(),
        lat: 50.78 + Math.random() * 0.04,
        lng: 3.03 + Math.random() * 0.04,
      },
      status: "to_do",
      assigned_surveyor: form.assigned_surveyor,
      assigned_date: new Date().toISOString().split("T")[0],
      scheduled_time: "",
      distance_km: 0,
      priority: form.priority,
      visits: [],
      appointment: null,
      client: { company: "Wyre NV", contact_name: "", contact_phone: "", contact_email: "", contractor: "" },
      building_owner: emptyBuildingOwner(),
      building_info: { ...emptyBuildingInfo(), building_type: form.building_type },
      distribution_zone: emptyDistributionZone(),
      facade_street: emptyFacadeStreet(),
      existing_telecom: emptyExistingTelecom(),
      execution_quantities: emptyExecutionQuantities(),
      photos: emptyPhotos(),
      engineering_plans: [],
      agreement: emptyAgreement(),
      completed_sections: [],
      editing: {},
      rework_remarks: "",
      validated_by: null,
      validated_at: null,
      completed_by: null,
      completed_at: null,
      assigned_subcontractor: null,
      assigned_subcontractor_date: null,
    });
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "24px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={onCancel}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
        >
          <Icon n="chevR" size={18} color="var(--text-secondary)" style={{ transform: "rotate(180deg)" }} />
        </button>
        <h1 style={disp(isMobile ? 22 : 28, 800)}>Create Survey</h1>
      </div>

      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* TSG ID */}
        <Field label="TSG ID" value={form.tsg_id} onChange={set("tsg_id")} placeholder="e.g. WERK-25" />

        {/* Address row 1 */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 2 }}>
            <Field label="Street" value={form.street} onChange={set("street")} placeholder="Geluwesesteenweg" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Number" value={form.number} onChange={set("number")} placeholder="12" />
          </div>
        </div>

        {/* Address row 2 */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Postal Code" value={form.postal_code} onChange={set("postal_code")} placeholder="8940" />
          </div>
          <div style={{ flex: 1 }}>
            <Field label="City" value={form.city} onChange={set("city")} placeholder="Wervik" />
          </div>
        </div>

        {/* Building Type */}
        <div>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
            Building Type
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {BUILDING_TYPES.map(bt => (
              <ToggleButton
                key={bt.value}
                label={bt.label}
                active={form.building_type === bt.value}
                onClick={() => setForm(f => ({ ...f, building_type: bt.value }))}
              />
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
            Priority
          </div>
          <ToggleButton
            label={form.priority ? "Priority" : "Normal"}
            variant="red"
            active={form.priority}
            onClick={() => setForm(f => ({ ...f, priority: !f.priority }))}
          />
        </div>

        {/* Surveyor */}
        <div>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
            Assign Surveyor
          </div>
          <select
            className="field-input"
            value={form.assigned_surveyor}
            onChange={(e) => setForm(f => ({ ...f, assigned_surveyor: e.target.value }))}
          >
            <option value="">Select surveyor...</option>
            {surveyors.map(u => (
              <option key={u.id} value={u.name}>{u.name} — {u.region}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 8, paddingBottom: 40 }}>
          <button className="cta-btn secondary" onClick={onCancel}>Cancel</button>
          <button
            className="toggle-btn primary active"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{
              padding: "10px 24px", display: "flex", alignItems: "center", gap: 8,
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            <Icon n="plus" size={16} color="#fff" />
            Create Survey
          </button>
        </div>
      </div>
    </div>
  );
};
