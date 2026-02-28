import { useState } from "react";
import { DisputeBanner } from "../../../components/shared/DisputeBanner";
import { EmptyState } from "../../../components/shared/EmptyState";
import { TextArea } from "../../../components/shared/Field";
import { BUILD_TYPES, BUILD_PHASES, BUILD_PHASE_LABELS } from "../../../data/buildTypes";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";

const phaseColors = { pre_build: "var(--primary)", during_build: "var(--blue)", post_build: "var(--green)" };

const FORM_LABELS = {
  site_assessment: "Site Assessment",
  cable_routing: "Cable Routing",
  obstacle_report: "Obstacle Report",
  completion_checklist: "Completion Checklist",
  riser_plan: "Riser Plan",
  riser_progress: "Riser Progress",
  floor_progress: "Floor Progress",
  access_plan: "Access Plan",
  safety_checklist: "Safety Checklist",
  test_results: "Test Results",
  handover_report: "Handover Report",
};

export const SubcoBuildDetail = ({ build, onBack, isMobile }) => {
  const [activePhase, setActivePhase] = useState(build.phase || "pre_build");
  const [phaseApprovals, setPhaseApprovals] = useState({});
  const [disputeComment, setDisputeComment] = useState("");
  const [disputeInstructions, setDisputeInstructions] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [localDispute, setLocalDispute] = useState(build.dispute || null);

  const buildType = BUILD_TYPES[build.buildType] || BUILD_TYPES.sdu_standard;
  const phaseConfig = buildType.phases[activePhase] || { requiredImages: 3, forms: [] };
  const phaseImages = build.images?.[activePhase] || [];
  const phaseForms = build.formStatuses?.[activePhase] || {};

  const handleApprovePhase = () => {
    setPhaseApprovals(prev => ({ ...prev, [activePhase]: true }));
  };

  const handleRaiseDispute = () => {
    if (!disputeComment.trim()) return;
    setLocalDispute({ comment: disputeComment, instructions: disputeInstructions });
    setDisputeComment("");
    setDisputeInstructions("");
    setShowDisputeForm(false);
  };

  const handleResolveDispute = () => {
    setLocalDispute(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Back button (mobile) */}
      {isMobile && (
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, padding: 0,
            ...mono(14, "var(--text-primary-accent)"),
          }}
        >
          <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
          Back to list
        </button>
      )}

      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={disp(isMobile ? 18 : 22, 800)}>{build.tsg_id}</span>
          <span style={{
            ...mono(12, build.status === "disputed" ? "var(--text-red)" : "var(--text-primary-accent)"),
            padding: "2px 8px", borderRadius: "var(--radius-sm)",
            background: build.status === "disputed" ? "var(--red-glow)" : "var(--primary-glow)",
            border: `1px solid ${build.status === "disputed" ? "var(--red-dim)" : "var(--primary-dim)"}`,
          }}>
            {build.status === "disputed" ? "DISPUTED" : BUILD_PHASE_LABELS[build.phase]}
          </span>
        </div>
        <div style={mono(12, "var(--text-secondary)", { marginTop: 6 })}>
          {build.subco} · {build.address} · {buildType.label}
        </div>
        <div style={mono(12, "var(--text-muted)", { marginTop: 2 })}>
          Assigned: {build.assignedDate}
        </div>
      </div>

      {/* Dispute banner */}
      {localDispute && (
        <div>
          <DisputeBanner dispute={localDispute} />
          <button
            className="toggle-btn green active"
            onClick={handleResolveDispute}
            style={{ padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Icon n="check" size={14} color="#fff" />
            Resolve Dispute
          </button>
        </div>
      )}

      {/* Phase tabs */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 6 }}>
        {BUILD_PHASES.map((phase, i) => {
          const imgs = build.images?.[phase] || [];
          const required = buildType.phases[phase]?.requiredImages || 0;
          const approved = phaseApprovals[phase];
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              style={{
                flex: 1, padding: "12px 14px", borderRadius: "var(--radius-md)",
                border: activePhase === phase ? `2px solid ${phaseColors[phase]}` : "1px solid var(--border)",
                background: activePhase === phase ? `${phaseColors[phase]}15` : "var(--bg-raised)",
                cursor: "pointer", textAlign: "center",
              }}
            >
              <div style={mono(12, phaseColors[phase], { textTransform: "uppercase", letterSpacing: ".06em" })}>
                Phase {i + 1}
              </div>
              <div style={disp(13, 700, undefined, { marginTop: 4 })}>
                {BUILD_PHASE_LABELS[phase]}
              </div>
              <div style={mono(12, approved ? "var(--text-green)" : "var(--text-muted)", { marginTop: 4 })}>
                {imgs.length} / {required} images {approved ? " — Approved" : ""}
              </div>
            </button>
          );
        })}
      </div>

      {/* Per-phase content */}
      <div style={{
        padding: 16, background: "var(--bg-raised)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
      }}>
        {/* Uploaded images grid */}
        <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
          Uploaded Images — {phaseImages.length} / {phaseConfig.requiredImages} required
        </div>

        {phaseImages.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10, marginBottom: 16,
          }}>
            {phaseImages.map((img, idx) => (
              <div key={idx} style={{
                background: "var(--bg-overlay)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", overflow: "hidden",
              }}>
                <div style={{
                  height: 90, background: "var(--bg-overlay)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon n="camera" size={24} color="var(--text-muted)" />
                </div>
                <div style={{ padding: "6px 8px" }}>
                  <div style={mono(12, "var(--text-primary)", { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>
                    {img.name}
                  </div>
                  <div style={mono(12, "var(--text-muted)")}>
                    {img.uploadDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: 16, border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
            <EmptyState icon="camera" message="No images uploaded for this phase" pad={24} />
          </div>
        )}

        {/* Form status list */}
        {phaseConfig.forms.length > 0 && (
          <>
            <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10, marginTop: 8 })}>
              Required Forms
            </div>
            {phaseConfig.forms.map(form => {
              const completed = phaseForms[form] === "completed";
              return (
                <div key={form} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <Icon
                    n={completed ? "check" : "alert"}
                    size={14}
                    color={completed ? "var(--green)" : "var(--text-muted)"}
                  />
                  <span style={mono(12, "var(--text-secondary)")}>
                    {FORM_LABELS[form] || form.replace(/_/g, " ")}
                  </span>
                  <span style={{
                    marginLeft: "auto",
                    ...mono(12, completed ? "var(--text-green)" : "var(--text-muted)"),
                  }}>
                    {completed ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* Phase approval buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {phaseApprovals[activePhase] ? (
            <div style={{
              ...mono(14, "var(--text-green)"),
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px", background: "var(--green-glow)",
              border: "1px solid var(--green-dim)", borderRadius: "var(--radius-md)",
            }}>
              <Icon n="check" size={14} color="var(--green)" />
              Phase Approved
            </div>
          ) : (
            <>
              <button
                className="toggle-btn green active"
                onClick={handleApprovePhase}
                style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Icon n="check" size={14} color="#fff" />
                Approve Phase
              </button>
              <button
                className="toggle-btn"
                onClick={() => setShowDisputeForm(true)}
                style={{
                  padding: "8px 16px", display: "flex", alignItems: "center", gap: 6,
                  color: "var(--red)", borderColor: "var(--red-dim)",
                }}
              >
                <Icon n="alert" size={14} color="var(--red)" />
                Flag Issue
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dispute section */}
      {!localDispute && showDisputeForm && (
        <div style={{
          padding: 16, background: "var(--bg-raised)",
          border: "1px solid var(--red-dim)", borderRadius: "var(--radius-lg)",
        }}>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
            Raise Dispute
          </div>
          <TextArea
            label="Comment"
            value={disputeComment}
            onChange={setDisputeComment}
            placeholder="Describe the issue..."
            rows={3}
          />
          <div style={{ marginTop: 10 }}>
            <TextArea
              label="Instructions for Subcontractor"
              value={disputeInstructions}
              onChange={setDisputeInstructions}
              placeholder="Steps to resolve..."
              rows={2}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              className="toggle-btn"
              onClick={handleRaiseDispute}
              style={{
                padding: "8px 16px", display: "flex", alignItems: "center", gap: 6,
                color: "var(--red)", borderColor: "var(--red-dim)", background: "var(--red-glow)",
              }}
            >
              <Icon n="alert" size={14} color="var(--red)" />
              Submit Dispute
            </button>
            <button
              className="toggle-btn"
              onClick={() => setShowDisputeForm(false)}
              style={{ padding: "8px 16px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div style={{
        padding: "12px 16px", background: "var(--bg-raised)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3 }}>
            <div style={{
              width: `${build.progress}%`, height: "100%", borderRadius: 3,
              background: localDispute ? "var(--red)" : phaseColors[activePhase],
              transition: "width .3s ease",
            }} />
          </div>
        </div>
        <span style={mono(12, "var(--text-secondary)")}>{build.progress}% overall</span>
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="toggle-btn primary" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon n="user" size={14} color="var(--primary)" />
          Reassign Subcontractor
        </button>
        <button className="toggle-btn" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon n="mail" size={14} color="var(--text-muted)" />
          Contact Subcontractor
        </button>
      </div>
    </div>
  );
};
