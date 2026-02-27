import { Field, ToggleButton, Checkbox } from "../../shared";
import { useLang } from "../../../i18n/LangContext";
import { mono } from "../../../styles/helpers";

const VERTICAL_SOLUTIONS = [
  "T1", "T1x", "T2", "T2x", "T2xi", "T3", "T3x", "T3i", "T3xi",
  "T2/3", "T2x/3x", "T2x/3xi", "SDU", "Platte MDU",
];

export const DistributionZone = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const zone = survey.distribution_zone || {};
  const selectedVertical = zone.verticalSolution || [];

  const toggleVertical = (value) => {
    const current = [...selectedVertical];
    const idx = current.indexOf(value);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    setField("distribution_zone.verticalSolution", current);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* MRO Zone (read-only) */}
      <Field
        label={t("mroZone")}
        value={zone.mroZone}
        disabled
      />

      {/* POP Area */}
      <Field
        label={t("popArea")}
        value={zone.popArea}
        onChange={(v) => setField("distribution_zone.popArea", v)}
        disabled={disabled}
      />

      {/* Planned Distribution */}
      <div>
        <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
          {t("plannedDistribution")}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ToggleButton
            label="Underground"
            variant="primary"
            active={zone.plannedDistribution === "underground"}
            onClick={() => setField("distribution_zone.plannedDistribution", "underground")}
            disabled={disabled}
          />
          <ToggleButton
            label="Facade"
            variant="primary"
            active={zone.plannedDistribution === "facade"}
            onClick={() => setField("distribution_zone.plannedDistribution", "facade")}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Planned Introduction */}
      <div>
        <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
          {t("plannedIntroduction")}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ToggleButton
            label="Underground"
            variant="primary"
            active={zone.plannedIntroduction === "underground"}
            onClick={() => setField("distribution_zone.plannedIntroduction", "underground")}
            disabled={disabled}
          />
          <ToggleButton
            label="Facade Cabling"
            variant="primary"
            active={zone.plannedIntroduction === "facade_cabling"}
            onClick={() => setField("distribution_zone.plannedIntroduction", "facade_cabling")}
            disabled={disabled}
          />
          <ToggleButton
            label="Both"
            variant="primary"
            active={zone.plannedIntroduction === "both"}
            onClick={() => setField("distribution_zone.plannedIntroduction", "both")}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Vertical Solution (multi-select) */}
      <div>
        <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
          {t("verticalSolution")}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {VERTICAL_SOLUTIONS.map((sol) => (
            <ToggleButton
              key={sol}
              label={sol}
              variant="primary"
              active={selectedVertical.includes(sol)}
              onClick={() => toggleVertical(sol)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Front Garden */}
      <div>
        <Checkbox
          label={t("frontGarden")}
          checked={!!zone.frontGarden}
          onChange={() => setField("distribution_zone.frontGarden", !zone.frontGarden)}
          disabled={disabled}
        />
        {zone.frontGarden && (
          <div style={{ marginTop: 10, paddingLeft: 30 }}>
            <Field
              label={t("frontGardenLength")}
              value={zone.frontGardenLength}
              onChange={(v) => setField("distribution_zone.frontGardenLength", v)}
              disabled={disabled}
              type="number"
            />
          </div>
        )}
      </div>

      {/* Decorative Paving */}
      <Field
        label={t("decorativePaving")}
        value={zone.decorativePaving}
        onChange={(v) => setField("distribution_zone.decorativePaving", v)}
        disabled={disabled}
      />
    </div>
  );
};
