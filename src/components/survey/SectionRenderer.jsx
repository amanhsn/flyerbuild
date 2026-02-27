import { SectionCard } from "../shared/SectionCard";
import { useLang } from "../../i18n/LangContext";

// Form sections
import { VisitInfo } from "./sections/VisitInfo";
import { AppointmentInfo } from "./sections/AppointmentInfo";
import { ClientInfo } from "./sections/ClientInfo";
import { BuildingOwner } from "./sections/BuildingOwner";
import { BuildingInfo } from "./sections/BuildingInfo";
import { DistributionZone } from "./sections/DistributionZone";
import { FacadeStreet } from "./sections/FacadeStreet";
import { ExistingTelecom } from "./sections/ExistingTelecom";
import { ExecutionQuantities } from "./sections/ExecutionQuantities";
import { Legend } from "./sections/Legend";
import { PhotoSection } from "./sections/PhotoSection";
import { FloorplanCanvas } from "./sections/FloorplanCanvas";
import { EngineeringPlans } from "./sections/EngineeringPlans";
import { StatementOfAgreement } from "./sections/StatementOfAgreement";

const SECTION_COMPONENTS = {
  visit_info: VisitInfo,
  appointment_info: AppointmentInfo,
  client_info: ClientInfo,
  building_owner: BuildingOwner,
  building_info: BuildingInfo,
  distribution_zone: DistributionZone,
  facade_street: FacadeStreet,
  existing_telecom: ExistingTelecom,
  execution_quantities: ExecutionQuantities,
  legend: Legend,
  floorplan_canvas: FloorplanCanvas,
  engineering_plans: EngineeringPlans,
  statement_agreement: StatementOfAgreement,
};

// Photo sections all use the shared PhotoSection component
const PHOTO_SECTION_KEYS = [
  "photo_facade", "photo_letterbox", "bordje_syndic", "fire_department",
  "underground_intro", "facade_distribution", "technical_room",
  "cable_trajectory", "photo_misc",
];

export const SectionRenderer = ({
  section,
  survey,
  setField,
  completeSection,
  setEditing,
  addVisit,
  deleteVisit,
  addAppointment,
  deleteAppointment,
  isSaveDisabled,
  isSectionCompleted,
  isSectionEditing,
}) => {
  const { t } = useLang();
  const { key, readOnly } = section;
  const completed = {};
  const editing = {};
  survey.completed_sections.forEach(k => { completed[k] = true; });
  if (survey.editing) {
    Object.keys(survey.editing).forEach(k => { editing[k] = survey.editing[k]; });
  }

  const title = t(`sec_${key}`);

  // Shared props for all sections
  const sectionProps = {
    survey,
    setField,
    disabled: isSaveDisabled || (isSectionCompleted(key) && !isSectionEditing(key)),
  };

  // Photo sections
  if (PHOTO_SECTION_KEYS.includes(key)) {
    return (
      <SectionCard
        title={title}
        sectionKey={key}
        completed={completed}
        editing={editing}
        setEditing={(fn) => {
          const result = fn(editing);
          Object.keys(result).forEach(k => setEditing(k, result[k]));
        }}
        readOnly={readOnly}
      >
        <PhotoSection sectionKey={key} {...sectionProps} />
      </SectionCard>
    );
  }

  // Named sections
  const Component = SECTION_COMPONENTS[key];
  if (!Component) {
    return (
      <SectionCard
        title={title}
        sectionKey={key}
        completed={completed}
        editing={editing}
        setEditing={(fn) => {
          const result = fn(editing);
          Object.keys(result).forEach(k => setEditing(k, result[k]));
        }}
        readOnly={readOnly}
      >
        <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
          Section coming soon...
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title={title}
      sectionKey={key}
      completed={completed}
      editing={editing}
      setEditing={(fn) => {
        const result = fn(editing);
        Object.keys(result).forEach(k => setEditing(k, result[k]));
      }}
      readOnly={readOnly}
    >
      <Component
        {...sectionProps}
        addVisit={addVisit}
        deleteVisit={deleteVisit}
        addAppointment={addAppointment}
        deleteAppointment={deleteAppointment}
      />
    </SectionCard>
  );
};
