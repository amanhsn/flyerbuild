import { Icon } from "../../icons/Icon";
import { StatusBadge, MiniProgress } from "../shared";
import { mono, disp } from "../../styles/helpers";
import { SECTIONS } from "../../data/sectionRegistry";

export const SurveyCard = ({ survey, selected, onClick }) => {
  const addr = survey.address;
  const completedCount = survey.completed_sections.length;
  const totalSections = SECTIONS.length;
  const isConflict = ["rework", "rejected"].includes(survey.status);
  const isDone = ["completed", "sent"].includes(survey.status);

  return (
    <div
      className={`survey-card${isConflict ? " conflict" : survey.priority ? " priority" : ""}${selected ? " selected" : ""} fade-up`}
      onClick={onClick}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
            {survey.priority && <Icon n="star" size={12} color="var(--text-primary-accent)" />}
            <StatusBadge status={survey.status} />
            <span style={mono(12, "var(--text-muted)")}>{survey.tsg_id}</span>
          </div>
          <div style={disp(19, 700)}>{addr.street} {addr.number}</div>
          <div style={mono(14, "var(--text-secondary)", { marginTop: 3 })}>{addr.postal_code} {addr.city}</div>
        </div>
        <Icon n="chevR" size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, marginTop: 13,
        paddingTop: 11, borderTop: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Icon n="clock" size={12} color="var(--text-muted)" />
          <span style={mono(12, "var(--text-secondary)")}>{survey.scheduled_time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Icon n="nav" size={12} color="var(--text-muted)" />
          <span style={mono(12, "var(--text-secondary)")}>{survey.distance_km} km</span>
        </div>
        <MiniProgress
          val={completedCount}
          total={totalSections}
          color={isDone ? "var(--green)" : isConflict ? "var(--red)" : "var(--primary)"}
        />
      </div>
    </div>
  );
};
