import { Icon } from "../../icons/Icon";
import { StatusBadge, MiniProgress } from "../shared";
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
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap mb-1.5" style={{ gap: 7 }}>
            {survey.priority && <Icon n="star" size={12} color="var(--text-primary-accent)" />}
            <StatusBadge status={survey.status} />
            <span className="font-mono text-xs text-text-muted">{survey.tsg_id}</span>
          </div>
          <div className="font-display text-[19px] font-bold tracking-wide">{addr.street} {addr.number}</div>
          <div className="font-mono text-sm text-text-secondary mt-0.5">{addr.postal_code} {addr.city}</div>
        </div>
        <Icon n="chevR" size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
      </div>
      <div className="flex items-center border-t border-border" style={{
        gap: 14, marginTop: 13,
        paddingTop: 11,
      }}>
        <div className="flex items-center" style={{ gap: 5 }}>
          <Icon n="clock" size={12} color="var(--text-muted)" />
          <span className="font-mono text-xs text-text-secondary">{survey.scheduled_time}</span>
        </div>
        <div className="flex items-center" style={{ gap: 5 }}>
          <Icon n="nav" size={12} color="var(--text-muted)" />
          <span className="font-mono text-xs text-text-secondary">{survey.distance_km} km</span>
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
