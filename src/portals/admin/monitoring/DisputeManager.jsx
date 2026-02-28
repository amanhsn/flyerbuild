import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { TextArea } from "../../../components/shared/Field";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";

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
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h1 style={disp(28, 800)}>Dispute Manager</h1>
        <button
          className="toggle-btn primary active"
          onClick={() => setShowRaiseForm(!showRaiseForm)}
          style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Icon n="plus" size={14} color="#fff" /> Raise Dispute
        </button>
      </div>

      {showRaiseForm && (
        <div style={{
          padding: 16, marginBottom: 20, background: "var(--bg-raised)",
          border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
        }}>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
            New Dispute
          </div>
          <TextArea
            label="Comment & Instructions"
            value={newComment}
            onChange={setNewComment}
            placeholder="Describe the issue and corrective instructions..."
            rows={3}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
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
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
        Open Disputes ({open.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {open.map(d => (
          <div key={d.id} style={{
            padding: "14px 18px", background: "var(--bg-raised)",
            border: "1px solid var(--red-dim)", borderRadius: "var(--radius-lg)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon n="alert" size={14} color="var(--red)" />
              <span style={mono(14, "var(--text-primary)", { fontWeight: 600 })}>{d.tsg_id}</span>
              <span style={mono(12, "var(--text-muted)")}>{d.subco}</span>
              <span style={mono(12, "var(--text-muted)", { marginLeft: "auto" })}>Raised {d.raisedAt}</span>
            </div>
            <div style={mono(12, "var(--text-secondary)", { marginBottom: 6 })}>{d.comment}</div>
            <div style={{
              ...mono(12, "var(--text-primary)"), padding: "8px 10px",
              background: "var(--bg-overlay)", borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)", marginBottom: 10,
            }}>
              Instructions: {d.instructions}
            </div>
            <button
              className="toggle-btn green active"
              onClick={() => handleResolve(d.id)}
              style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}
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
      <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
        Resolved ({resolved.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {resolved.map(d => (
          <div key={d.id} style={{
            padding: "12px 16px", background: "var(--bg-raised)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-md)", opacity: 0.7,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon n="check" size={14} color="var(--green)" />
              <span style={mono(14, "var(--text-primary)")}>{d.tsg_id}</span>
              <span style={mono(12, "var(--text-muted)")}>{d.subco}</span>
              <span style={mono(12, "var(--text-green)", { marginLeft: "auto" })}>Resolved {d.resolvedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
