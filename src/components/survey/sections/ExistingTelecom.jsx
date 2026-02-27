import { Field, Checkbox } from "../../shared";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

export const ExistingTelecom = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const telecom = survey.existing_telecom || {};

  const subHeading = (label, color = "var(--primary)") => (
    <div style={{
      ...disp(13, 600, "var(--text-primary)"),
      marginTop: 8,
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <div style={{
        width: 4, height: 16, borderRadius: 2,
        background: color,
      }} />
      {label}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Existing Fiber */}
      <div>
        <Checkbox
          label={t("existingFiber")}
          checked={!!telecom.existingFiber}
          onChange={() => setField("existing_telecom.existingFiber", !telecom.existingFiber)}
          disabled={disabled}
        />
        {telecom.existingFiber && (
          <div style={{ paddingLeft: 30, marginTop: 6 }}>
            <Field
              label={t("existingFiberRemarks")}
              value={telecom.existingFiberRemarks}
              onChange={(v) => setField("existing_telecom.existingFiberRemarks", v)}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Technical Shafts */}
      {subHeading(t("technicalShafts"), "var(--blue)")}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Checkbox
          label={t("shaftVertical")}
          checked={!!telecom.shaftVertical}
          onChange={() => setField("existing_telecom.shaftVertical", !telecom.shaftVertical)}
          disabled={disabled}
        />
        <Checkbox
          label={t("shaftHorizontal")}
          checked={!!telecom.shaftHorizontal}
          onChange={() => setField("existing_telecom.shaftHorizontal", !telecom.shaftHorizontal)}
          disabled={disabled}
        />
        <Checkbox
          label={t("electricityTelcoRoom")}
          checked={!!telecom.electricityTelcoRoom}
          onChange={() => setField("existing_telecom.electricityTelcoRoom", !telecom.electricityTelcoRoom)}
          disabled={disabled}
        />
        <Checkbox
          label={t("spaceMainDistBox")}
          checked={!!telecom.spaceMainDistBox}
          onChange={() => setField("existing_telecom.spaceMainDistBox", !telecom.spaceMainDistBox)}
          disabled={disabled}
        />
      </div>
      <Field
        label={t("extraRemarksTelecom")}
        value={telecom.extraRemarksTelecom}
        onChange={(v) => setField("existing_telecom.extraRemarksTelecom", v)}
        disabled={disabled}
      />

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Vertical Cabling */}
      {subHeading(t("verticalCabling"), "var(--green)")}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Checkbox
          label={t("existingVerticalFyber")}
          checked={!!telecom.existingVerticalFyber}
          onChange={() => setField("existing_telecom.existingVerticalFyber", !telecom.existingVerticalFyber)}
          disabled={disabled}
        />
        <Checkbox
          label={t("cat5Cat6")}
          checked={!!telecom.cat5Cat6}
          onChange={() => setField("existing_telecom.cat5Cat6", !telecom.cat5Cat6)}
          disabled={disabled}
        />
        <Checkbox
          label={t("cat3Vvt")}
          checked={!!telecom.cat3Vvt}
          onChange={() => setField("existing_telecom.cat3Vvt", !telecom.cat3Vvt)}
          disabled={disabled}
        />
      </div>
      <Field
        label={t("remarksCabling")}
        value={telecom.remarksCabling}
        onChange={(v) => setField("existing_telecom.remarksCabling", v)}
        disabled={disabled}
      />

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Coax */}
      {subHeading(t("coax"), "var(--red)")}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Checkbox
          label={t("coaxMultitaps")}
          checked={!!telecom.coaxMultitaps}
          onChange={() => setField("existing_telecom.coaxMultitaps", !telecom.coaxMultitaps)}
          disabled={disabled}
        />
        {telecom.coaxMultitaps && (
          <div style={{ paddingLeft: 30, marginBottom: 6 }}>
            <Field
              label={t("coaxCount")}
              value={telecom.coaxCount}
              onChange={(v) => setField("existing_telecom.coaxCount", v)}
              disabled={disabled}
              type="number"
            />
          </div>
        )}
        <Checkbox
          label={t("coaxDirect")}
          checked={!!telecom.coaxDirect}
          onChange={() => setField("existing_telecom.coaxDirect", !telecom.coaxDirect)}
          disabled={disabled}
        />
      </div>
      <Field
        label={t("coaxRemarks")}
        value={telecom.coaxRemarks}
        onChange={(v) => setField("existing_telecom.coaxRemarks", v)}
        disabled={disabled}
      />
    </div>
  );
};
