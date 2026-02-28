import { Field, TextArea } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";

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
    <div className="flex flex-col gap-4">
      {/* Main Address */}
      <Field
        label={t("mainAddress")}
        value={info.mainAddress}
        onChange={(v) => setField("building_info.mainAddress", v)}
        disabled={disabled}
      />

      <div className="flex gap-3">
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
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
        {t("unitCounts")}
      </div>
      <div className="flex gap-3">
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
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-[5px]">
            {t("totalUnits")}
          </div>
          <div className="font-display text-lg font-bold tracking-wide text-primary py-2 px-3 bg-bg-overlay rounded-sm border border-border">
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
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-[5px]">
          {t("buildingType")}
        </div>
        <div className="font-mono text-sm text-text-secondary py-2.5 px-3.5 bg-bg-overlay rounded-sm border border-border flex items-center gap-2">
          <Icon n="building" size={16} color="var(--primary)" />
          <span>{buildingType}</span>
          {totalUnits > 0 && (
            <span className="font-mono text-xs text-text-muted ml-auto">
              ({totalUnits} units)
            </span>
          )}
        </div>
      </div>

      {/* Secondary Addresses */}
      {secondaryAddresses.length > 0 && (
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
            {t("secondaryAddresses")}
          </div>
          <div className="flex flex-col gap-1 bg-bg-raised border border-border rounded-lg overflow-hidden">
            {secondaryAddresses.map((addr, idx) => (
              <div
                key={idx}
                className="font-mono text-xs text-text-secondary py-2.5 px-3.5 flex items-center gap-2"
                style={{
                  borderBottom: idx < secondaryAddresses.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
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
