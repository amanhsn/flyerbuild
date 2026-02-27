import { Field, Checkbox } from "../../shared";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

export const FacadeStreet = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const facade = survey.facade || {};
  const street = survey.street || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* === Facade Section === */}
      <div>
        <div style={{
          ...disp(14, 600, "var(--text-primary)"),
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            width: 4, height: 18, borderRadius: 2,
            background: "var(--primary)",
          }} />
          {t("facade")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Checkbox
            label={t("heritageProtection")}
            checked={!!facade.heritageProtection}
            onChange={() => setField("facade.heritageProtection", !facade.heritageProtection)}
            disabled={disabled}
          />
          <Checkbox
            label={t("electricCables")}
            checked={!!facade.electricCables}
            onChange={() => setField("facade.electricCables", !facade.electricCables)}
            disabled={disabled}
          />
          <Checkbox
            label={t("coaxCables")}
            checked={!!facade.coaxCables}
            onChange={() => setField("facade.coaxCables", !facade.coaxCables)}
            disabled={disabled}
          />
          <Checkbox
            label={t("coaxMultitaps")}
            checked={!!facade.coaxMultitaps}
            onChange={() => setField("facade.coaxMultitaps", !facade.coaxMultitaps)}
            disabled={disabled}
          />
          <Checkbox
            label={t("publicLighting")}
            checked={!!facade.publicLighting}
            onChange={() => setField("facade.publicLighting", !facade.publicLighting)}
            disabled={disabled}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <Field
            label={t("remarksFacade")}
            value={facade.remarksFacade}
            onChange={(v) => setField("facade.remarksFacade", v)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: "var(--border-bright)",
        margin: "0 -4px",
      }} />

      {/* === Street Section === */}
      <div>
        <div style={{
          ...disp(14, 600, "var(--text-primary)"),
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            width: 4, height: 18, borderRadius: 2,
            background: "var(--blue)",
          }} />
          {t("street")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Checkbox
            label={t("streetCabinet")}
            checked={!!street.streetCabinet}
            onChange={() => setField("street.streetCabinet", !street.streetCabinet)}
            disabled={disabled}
          />

          {street.streetCabinet && (
            <div style={{ paddingLeft: 30, marginBottom: 6 }}>
              <Field
                label={t("streetCabinetType")}
                value={street.streetCabinetType}
                onChange={(v) => setField("street.streetCabinetType", v)}
                disabled={disabled}
              />
            </div>
          )}

          <Checkbox
            label={t("facadeObstacles")}
            checked={!!street.facadeObstacles}
            onChange={() => setField("street.facadeObstacles", !street.facadeObstacles)}
            disabled={disabled}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
          <Field
            label={t("decorativePaving")}
            value={street.decorativePaving}
            onChange={(v) => setField("street.decorativePaving", v)}
            disabled={disabled}
          />
          <Field
            label={t("remarksStreet")}
            value={street.remarksStreet}
            onChange={(v) => setField("street.remarksStreet", v)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
