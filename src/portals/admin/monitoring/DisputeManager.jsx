import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { TextArea } from "../../../components/shared/Field";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Icon } from "../../../icons/Icon";

const MOCK_DISPUTES = [
  {
    id: 1, tsg_id: "WERK-15", subco: "TelNet BV", status: "open",
    raisedAt: "2026-02-25", raisedBy: "Pieter Claeys",
    comment: "Photos from pre-build phase do not match the site assessment. Cable routing appears incorrect.",
    instructions: "Please re-upload pre-build photos and verify cable routing against the splicing plan.",
  },
  {
    id: 2, tsg_id: "MEN-04", subco: "FiberCo BVBA", status: "resolved",
    raisedAt: "2026-02-20", raisedBy: "An Dewitte",
    comment: "Missing fire retardant conduit installation evidence.",
    instructions: "Upload close-up photos of fire retardant conduit at each floor penetration.",
    resolvedAt: "2026-02-22",
  },
];

export const DisputeManager = () => {
  const { t } = useLang();
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [newComment, setNewComment] = useState("");
  const [showRaiseForm, setShowRaiseForm] = useState(false);

  const open = disputes.filter(d => d.status === "open");
  const resolved = disputes.filter(d => d.status === "resolved");

  const handleResolve = (id) => {
    setDisputes(ds => ds.map(d =>
      d.id === id ? { ...d, status: "resolved", resolvedAt: new Date().toISOString().split("T")[0] } : d
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: "24px 28px" }}>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-display text-[28px] font-extrabold tracking-wide">Dispute Manager</h1>
        <button
          className="toggle-btn primary active flex items-center gap-1.5"
          onClick={() => setShowRaiseForm(!showRaiseForm)}
          style={{ padding: "6px 14px" }}
        >
          <Icon n="plus" size={14} color="#fff" /> Raise Dispute
        </button>
      </div>

      {showRaiseForm && (
        <div className="mb-5 bg-bg-raised border border-border rounded-lg" style={{
          padding: 16,
        }}>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
            New Dispute
          </div>
          <TextArea
            label="Comment & Instructions"
            value={newComment}
            onChange={setNewComment}
            placeholder="Describe the issue and corrective instructions..."
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button className="toggle-btn red active" style={{ padding: "6px 14px" }} onClick={() => setShowRaiseForm(false)}>
              Submit Dispute
            </button>
            <button className="cta-btn secondary" onClick={() => setShowRaiseForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Open disputes */}
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
        Open Disputes ({open.length})
      </div>
      <div className="flex flex-col gap-2.5 mb-6">
        {open.map(d => (
          <div key={d.id} className="bg-bg-raised rounded-lg" style={{
            padding: "14px 18px",
            border: "1px solid var(--red-dim)",
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon n="alert" size={14} color="var(--red)" />
              <span className="font-mono text-sm text-text-primary font-semibold">{d.tsg_id}</span>
              <span className="font-mono text-xs text-text-muted">{d.subco}</span>
              <span className="font-mono text-xs text-text-muted ml-auto">Raised {d.raisedAt}</span>
            </div>
            <div className="font-mono text-xs text-text-secondary mb-1.5">{d.comment}</div>
            <div className="font-mono text-xs text-text-primary rounded-sm border border-border mb-2.5" style={{
              padding: "8px 10px",
              background: "var(--bg-overlay)",
            }}>
              Instructions: {d.instructions}
            </div>
            <button
              className="toggle-btn green active flex items-center gap-1.5"
              onClick={() => handleResolve(d.id)}
              style={{ padding: "6px 14px" }}
            >
              <Icon n="check" size={14} color="#fff" /> Resume Workflow
            </button>
          </div>
        ))}
        {open.length === 0 && (
          <EmptyState icon="shield" message="No open disputes" sub="All clear" pad={24} />
        )}
      </div>

      {/* Resolved disputes */}
      <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
        Resolved ({resolved.length})
      </div>
      <div className="flex flex-col gap-2">
        {resolved.map(d => (
          <div key={d.id} className="bg-bg-raised border border-border rounded-md opacity-70" style={{
            padding: "12px 16px",
          }}>
            <div className="flex items-center gap-2">
              <Icon n="check" size={14} color="var(--green)" />
              <span className="font-mono text-sm text-text-primary">{d.tsg_id}</span>
              <span className="font-mono text-xs text-text-muted">{d.subco}</span>
              <span className="font-mono text-xs text-text-green ml-auto">Resolved {d.resolvedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
