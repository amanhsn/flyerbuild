import { Field, TextArea } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

const getBuildingType = (totalUnits) => {
  if (totalUnits == null || totalUnits === 0) return "--";
  if (totalUnits < 9) return "";
  if (totalUnits <= 16) return "Small MDU";
  if (totalUnits <= 48) return "Large MDU";
  return "Extra Large MDU";
};

export const BuildingInfo = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const info = survey.building_info || {};

  const amountLu = parseInt(info.amountLu) || 0;
  const amountBu = parseInt(info.amountBu) || 0;
  const totalUnits = amountLu + amountBu;
  const buildingType = getBuildingType(totalUnits);

  const secondaryAddresses = info.secondary_addresses || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Main Address */}
      <Field
        label={t("mainAddress")}
        value={info.mainAddress}
        onChange={(v) => setField("building_info.mainAddress", v)}
        disabled={disabled}
      />

      <div style={{ display: "flex", gap: 12 }}>
        <Field
          label={t("nameResidence")}
          value={info.nameResidence}
          onChange={(v) => setField("building_info.nameResidence", v)}
          disabled={disabled}
        />
        <Field
          label={t("evpArea")}
          value={info.evpArea}
          onChange={(v) => setField("building_info.evpArea", v)}
          disabled={disabled}
        />
      </div>

      {/* Unit Counts */}
      <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
        {t("unitCounts")}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Field
          label={t("amountLu")}
          value={info.amountLu}
          onChange={(v) => setField("building_info.amountLu", v)}
          disabled={disabled}
          type="number"
        />
        <Field
          label={t("amountBu")}
          value={info.amountBu}
          onChange={(v) => setField("building_info.amountBu", v)}
          disabled={disabled}
          type="number"
        />
        <Field
          label={t("amountSu")}
          value={info.amountSu}
          onChange={(v) => setField("building_info.amountSu", v)}
          disabled={disabled}
          type="number"
        />
      </div>

      {/* Total Units (display-only) */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
            {t("totalUnits")}
          </div>
          <div style={{
            ...disp(18, 700, "var(--primary)"),
            padding: "8px 12px",
            background: "var(--bg-overlay)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
          }}>
            {totalUnits}
          </div>
        </div>

        <Field
          label={t("nrOfFloors")}
          value={info.nrOfFloors}
          onChange={(v) => setField("building_info.nrOfFloors", v)}
          disabled={disabled}
          type="number"
        />
      </div>

      {/* Building Type (auto-calculated) */}
      <div>
        <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5 })}>
          {t("buildingType")}
        </div>
        <div style={{
          ...mono(12, "var(--text-secondary)"),
          padding: "10px 14px",
          background: "var(--bg-overlay)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <Icon n="building" size={16} color="var(--primary)" />
          <span>{buildingType}</span>
          {totalUnits > 0 && (
            <span style={mono(11, "var(--text-muted)", { marginLeft: "auto" })}>
              ({totalUnits} units)
            </span>
          )}
        </div>
      </div>

      {/* Secondary Addresses */}
      {secondaryAddresses.length > 0 && (
        <div>
          <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
            {t("secondaryAddresses")}
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}>
            {secondaryAddresses.map((addr, idx) => (
              <div key={idx} style={{
                ...mono(11, "var(--text-secondary)"),
                padding: "10px 14px",
                borderBottom: idx < secondaryAddresses.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <Icon n="nav" size={14} color="var(--text-muted)" />
                <span>{addr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remarks */}
      <TextArea
        label={t("buildingRemarks")}
        value={info.buildingRemarks}
        onChange={(v) => setField("building_info.buildingRemarks", v)}
        disabled={disabled}
        placeholder="Additional remarks about the building..."
        rows={3}
      />
    </div>
  );
};
