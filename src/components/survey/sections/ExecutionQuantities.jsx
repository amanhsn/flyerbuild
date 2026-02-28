import { Field } from "../../shared";
import { useLang } from "../../../i18n/LangContext";


const QUANTITY_FIELDS = [
  { key: "leadInTrench", label: "Lead-in Trench (m)" },
  { key: "diamondDrilling", label: "Diamond Drilling" },
  { key: "wallPenetration", label: "Wall Penetration" },
  { key: "cableDucts60x100", label: "Cable Ducts 60x100" },
  { key: "cableDucts12x20", label: "Cable Ducts 12x20" },
  { key: "cableDucts40x40", label: "Cable Ducts 40x40" },
  { key: "cableDucts60x40", label: "Cable Ducts 60x40" },
  { key: "fireRetardantConduit", label: "Fire Retardant Conduit" },
  { key: "coFlex", label: "Co-Flex" },
  { key: "floorbox", label: "Floorbox" },
];

export const ExecutionQuantities = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const quantities = survey.execution_quantities || {};

  return (
    <div className="flex flex-col gap-4">
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
        {t("executionQuantities")}
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {QUANTITY_FIELDS.map(({ key, label }) => (
          <Field
            key={key}
            label={t(key)}
            value={quantities[key]}
            onChange={(v) => setField(`execution_quantities.${key}`, v)}
            disabled={disabled}
            type="number"
          />
        ))}
      </div>
    </div>
  );
};
