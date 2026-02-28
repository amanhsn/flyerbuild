import { Field, Checkbox } from "../../shared";
import { useLang } from "../../../i18n/LangContext";


export const FacadeStreet = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const facade = survey.facade || {};
  const street = survey.street || {};

  return (
    <div className="flex flex-col gap-6">
      {/* === Facade Section === */}
      <div>
        <div className="font-display text-sm font-semibold tracking-wide text-text-primary mb-3.5 flex items-center gap-2">
          <div className="w-1 h-[18px] rounded-sm bg-primary" />
          {t("facade")}
        </div>

        <div className="flex flex-col gap-1.5">
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

        <div className="mt-3.5">
          <Field
            label={t("remarksFacade")}
            value={facade.remarksFacade}
            onChange={(v) => setField("facade.remarksFacade", v)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px -mx-1 bg-border-bright" />

      {/* === Street Section === */}
      <div>
        <div className="font-display text-sm font-semibold tracking-wide text-text-primary mb-3.5 flex items-center gap-2">
          <div className="w-1 h-[18px] rounded-sm bg-blue" />
          {t("street")}
        </div>

        <div className="flex flex-col gap-1.5">
          <Checkbox
            label={t("streetCabinet")}
            checked={!!street.streetCabinet}
            onChange={() => setField("street.streetCabinet", !street.streetCabinet)}
            disabled={disabled}
          />

          {street.streetCabinet && (
            <div className="pl-[30px] mb-1.5">
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

        <div className="flex flex-col gap-3.5 mt-3.5">
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
