"use client"

import { useState, useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { getProjectForSurvey } from "../../../data/mockProjects";
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

// Enrich dispute with survey/project data
function enrichDispute(d) {
  const survey = MOCK_SURVEYS.find(s => s.tsg_id === d.tsg_id);
  const project = survey ? getProjectForSurvey(survey) : null;
  return {
    ...d,
    address: survey ? `${survey.address.street} ${survey.address.number}, ${survey.address.city}` : null,
    projectName: project?.name || null,
    projectColor: project?.color || null,
  };
}

const DisputeContextBadge = ({ dispute }) => (
  <div className="flex flex-wrap items-center gap-2 mb-2.5">
    {dispute.projectName && (
      <span
        className="font-mono text-[10px] font-semibold uppercase tracking-wider rounded-full"
        style={{
          padding: "2px 10px",
          background: dispute.projectColor ? `${dispute.projectColor}18` : "var(--primary-glow)",
          color: dispute.projectColor || "var(--primary)",
          border: `1px solid ${dispute.projectColor ? `${dispute.projectColor}40` : "var(--primary-dim)"}`,
        }}
      >
        {dispute.projectName}
      </span>
    )}
    <span className="font-mono text-xs text-text-primary font-semibold">{dispute.tsg_id}</span>
    {dispute.address && (
      <>
        <span className="text-text-muted">·</span>
        <span className="font-mono text-xs text-text-secondary">{dispute.address}</span>
      </>
    )}
  </div>
);

export const DisputeManager = () => {
  const { t } = useLang();
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [newComment, setNewComment] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [showRaiseForm, setShowRaiseForm] = useState(false);

  const enriched = useMemo(() => disputes.map(enrichDispute), [disputes]);
  const open = enriched.filter(d => d.status === "open");
  const resolved = enriched.filter(d => d.status === "resolved");

  // Surveys available for disputes (those with subcontractors assigned)
  const disputeSurveys = useMemo(() =>
    MOCK_SURVEYS
      .filter(s => s.assigned_subcontractor)
      .map(s => {
        const project = getProjectForSurvey(s);
        return {
          id: s.id,
          tsg_id: s.tsg_id,
          address: `${s.address.street} ${s.address.number}, ${s.address.city}`,
          subco: s.assigned_subcontractor,
          projectName: project?.name || "—",
        };
      }),
    []
  );

  const selectedSurveyInfo = disputeSurveys.find(s => s.id === Number(selectedSurveyId));

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
        <div className="mb-5 bg-bg-raised border border-border rounded-lg" style={{ padding: 16 }}>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
            New Dispute
          </div>

          {/* Survey / Address selector */}
          <div className="mb-3">
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-1.5">
              Address
            </div>
            <select
              value={selectedSurveyId}
              onChange={(e) => setSelectedSurveyId(e.target.value)}
              className="font-mono text-sm bg-bg-elevated border border-border rounded-md text-text-primary cursor-pointer w-full"
              style={{ padding: "8px 12px" }}
            >
              <option value="">Select an address…</option>
              {disputeSurveys.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.projectName}] {s.tsg_id} — {s.address} ({s.subco})
                </option>
              ))}
            </select>
          </div>

          {/* Show selected context */}
          {selectedSurveyInfo && (
            <div className="flex flex-wrap items-center gap-2 mb-3 rounded-md" style={{
              padding: "10px 14px",
              background: "var(--bg-overlay)",
              border: "1px solid var(--border)",
            }}>
              <Icon n="building" size={14} color="var(--text-muted)" />
              <span className="font-mono text-xs font-semibold text-text-primary">{selectedSurveyInfo.tsg_id}</span>
              <span className="text-text-muted">·</span>
              <span className="font-mono text-xs text-text-secondary">{selectedSurveyInfo.address}</span>
              <span className="text-text-muted">·</span>
              <span className="font-mono text-[10px] text-text-muted">{selectedSurveyInfo.subco}</span>
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-wider rounded-full ml-auto"
                style={{
                  padding: "2px 10px",
                  background: "var(--primary-glow)",
                  color: "var(--primary)",
                  border: "1px solid var(--primary-dim)",
                }}
              >
                {selectedSurveyInfo.projectName}
              </span>
            </div>
          )}

          <TextArea
            label="Comment & Instructions"
            value={newComment}
            onChange={setNewComment}
            placeholder="Describe the issue and corrective instructions..."
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button
              className="toggle-btn red active"
              style={{ padding: "6px 14px" }}
              disabled={!selectedSurveyId}
              onClick={() => { setShowRaiseForm(false); setSelectedSurveyId(""); setNewComment(""); }}
            >
              Submit Dispute
            </button>
            <button className="cta-btn secondary" onClick={() => { setShowRaiseForm(false); setSelectedSurveyId(""); setNewComment(""); }}>
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
            <DisputeContextBadge dispute={d} />
            <div className="flex items-center gap-2 mb-2">
              <Icon n="alert" size={14} color="var(--red)" />
              <span className="font-mono text-xs text-text-muted">{d.subco}</span>
              <span className="font-mono text-xs text-text-muted ml-auto">Raised {d.raisedAt} by {d.raisedBy}</span>
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
            <DisputeContextBadge dispute={d} />
            <div className="flex items-center gap-2">
              <Icon n="check" size={14} color="var(--green)" />
              <span className="font-mono text-xs text-text-muted">{d.subco}</span>
              <span className="font-mono text-xs text-text-green ml-auto">Resolved {d.resolvedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
