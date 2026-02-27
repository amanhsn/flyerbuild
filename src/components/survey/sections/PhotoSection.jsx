import { TextArea } from "../../shared";
import { PhotoSlot } from "../../shared/PhotoSlot";
import { useLang } from "../../../i18n/LangContext";
import { mono } from "../../../styles/helpers";

const SECTION_CONFIG = {
  photo_facade: {
    title: "Facade Photos",
    slots: [
      { key: "facade_front", label: "Facade Front", required: true },
      { key: "facade_side", label: "Facade Side", required: false },
      { key: "facade_detail", label: "Facade Detail", required: false },
      { key: "facade_extra", label: "Extra", required: false },
    ],
  },
  photo_letterbox: {
    title: "Letterbox Photos",
    slots: [
      { key: "letterbox_main", label: "Letterbox", required: true },
      { key: "letterbox_detail", label: "Detail", required: false },
    ],
  },
  bordje_syndic: {
    title: "Syndic Sign",
    slots: [
      { key: "syndic_sign", label: "Syndic Sign", required: false },
      { key: "syndic_detail", label: "Detail", required: false },
    ],
  },
  fire_department: {
    title: "Fire Department",
    slots: [
      { key: "fire_plan", label: "Plan Overview", required: false },
      { key: "fire_detail", label: "Detail", required: false },
    ],
  },
  underground_intro: {
    title: "Underground Introduction",
    slots: [
      { key: "intro_entry", label: "Entry Point", required: false },
      { key: "intro_duct", label: "Duct", required: false },
      { key: "intro_extra", label: "Extra", required: false },
    ],
  },
  facade_distribution: {
    title: "Facade Distribution",
    slots: [
      { key: "dist_main", label: "Distribution", required: false },
      { key: "dist_route", label: "Cable Route", required: false },
      { key: "dist_extra", label: "Extra", required: false },
    ],
  },
  technical_room: {
    title: "Technical Room",
    slots: [
      { key: "tech_access", label: "Room Access", required: false },
      { key: "tech_equipment", label: "Equipment", required: false },
      { key: "tech_extra", label: "Extra", required: false },
    ],
  },
  cable_trajectory: {
    title: "Cable Trajectory",
    slots: [
      { key: "cable_start", label: "Start", required: false },
      { key: "cable_mid", label: "Mid", required: false },
      { key: "cable_end", label: "End", required: false },
      { key: "cable_extra", label: "Extra", required: false },
    ],
  },
  photo_misc: {
    title: "Miscellaneous Photos",
    slots: [
      { key: "misc_1", label: "Photo 1", required: false },
      { key: "misc_2", label: "Photo 2", required: false },
      { key: "misc_3", label: "Photo 3", required: false },
      { key: "misc_4", label: "Photo 4", required: false },
    ],
  },
};

export const PhotoSection = ({ survey, setField, disabled, sectionKey }) => {
  const { t } = useLang();
  const config = SECTION_CONFIG[sectionKey];

  if (!config) {
    return (
      <div style={mono(12, "var(--red)")}>
        Unknown photo section: {sectionKey}
      </div>
    );
  }

  const photos = survey.photos?.[sectionKey] || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em" })}>
        {t(`sec_${sectionKey}`)}
      </div>

      {/* Photo Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 10,
      }}>
        {config.slots.map(({ key, label, required }) => (
          <PhotoSlot
            key={key}
            label={label}
            required={required}
            filled={!!photos[key]}
            onClick={() => {
              if (!disabled) {
                /* trigger photo capture / selection for this slot */
              }
            }}
          />
        ))}
      </div>

      {/* Remarks */}
      <TextArea
        label={t("photoRemarks")}
        value={photos.remarks}
        onChange={(v) => setField(`photos.${sectionKey}.remarks`, v)}
        disabled={disabled}
        placeholder="Add remarks for this photo section..."
        rows={2}
      />
    </div>
  );
};
