import { useState } from "react";
import { Field } from "../../../components/shared";
import { ToggleButton } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
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
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "20px 16px" : "24px 28px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="flex items-center cursor-pointer"
          style={{ background: "none", border: "none", padding: 4 }}
        >
          <Icon n="chevR" size={18} color="var(--text-secondary)" style={{ transform: "rotate(180deg)" }} />
        </button>
        <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Create Survey</h1>
      </div>

      <div className="flex flex-col gap-4" style={{ maxWidth: 600 }}>
        {/* TSG ID */}
        <Field label="TSG ID" value={form.tsg_id} onChange={set("tsg_id")} placeholder="e.g. WERK-25" />

        {/* Address row 1 */}
        <div className="flex gap-3">
          <div style={{ flex: 2 }}>
            <Field label="Street" value={form.street} onChange={set("street")} placeholder="Geluwesesteenweg" />
          </div>
          <div className="flex-1">
            <Field label="Number" value={form.number} onChange={set("number")} placeholder="12" />
          </div>
        </div>

        {/* Address row 2 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="Postal Code" value={form.postal_code} onChange={set("postal_code")} placeholder="8940" />
          </div>
          <div className="flex-1">
            <Field label="City" value={form.city} onChange={set("city")} placeholder="Wervik" />
          </div>
        </div>

        {/* Building Type */}
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
            Building Type
          </div>
          <div className="flex flex-wrap gap-2">
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
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
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
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest" style={{ marginBottom: 5 }}>
            Assign Surveyor
          </div>
          <select
            className="w-full px-3 py-2.5 bg-bg-elevated border border-border-bright rounded-md text-text-primary font-mono text-sm outline-none transition-colors focus:border-primary"
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
        <div className="flex gap-2.5 mt-2 pb-10">
          <button className="cta-btn secondary" onClick={onCancel}>Cancel</button>
          <button
            className="toggle-btn primary active flex items-center gap-2"
            disabled={!canSubmit}
            onClick={handleSubmit}
            style={{
              padding: "10px 24px",
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
