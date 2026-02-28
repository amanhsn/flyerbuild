import { useState } from "react";
import { DisputeBanner } from "../../../components/shared/DisputeBanner";
import { EmptyState } from "../../../components/shared/EmptyState";
import { TextArea } from "../../../components/shared/Field";
import { BUILD_TYPES, BUILD_PHASES, BUILD_PHASE_LABELS } from "../../../data/buildTypes";
import { Icon } from "../../../icons/Icon";

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
    <div className="flex flex-col gap-4">
      {/* Back button (mobile) */}
      {isMobile && (
        <button
          onClick={onBack}
          className="font-mono text-sm text-text-primary-accent flex items-center gap-1.5 cursor-pointer"
          style={{
            background: "none", border: "none", padding: 0,
          }}
        >
          <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
          Back to list
        </button>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`font-display ${isMobile ? "text-lg" : "text-[22px]"} font-extrabold tracking-wide`}>{build.tsg_id}</span>
          <span className={`font-mono text-xs ${build.status === "disputed" ? "text-text-red" : "text-text-primary-accent"}`} style={{
            padding: "2px 8px", borderRadius: "var(--radius-sm)",
            background: build.status === "disputed" ? "var(--red-glow)" : "var(--primary-glow)",
            border: `1px solid ${build.status === "disputed" ? "var(--red-dim)" : "var(--primary-dim)"}`,
          }}>
            {build.status === "disputed" ? "DISPUTED" : BUILD_PHASE_LABELS[build.phase]}
          </span>
        </div>
        <div className="font-mono text-xs text-text-secondary mt-1.5">
          {build.subco} · {build.address} · {buildType.label}
        </div>
        <div className="font-mono text-xs text-text-muted mt-0.5">
          Assigned: {build.assignedDate}
        </div>
      </div>

      {/* Dispute banner */}
      {localDispute && (
        <div>
          <DisputeBanner dispute={localDispute} />
          <button
            className="toggle-btn green active flex items-center gap-1.5"
            onClick={handleResolveDispute}
            style={{ padding: "6px 14px" }}
          >
            <Icon n="check" size={14} color="#fff" />
            Resolve Dispute
          </button>
        </div>
      )}

      {/* Phase tabs */}
      <div className="gap-1.5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {BUILD_PHASES.map((phase, i) => {
          const imgs = build.images?.[phase] || [];
          const required = buildType.phases[phase]?.requiredImages || 0;
          const approved = phaseApprovals[phase];
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className="text-center cursor-pointer"
              style={{
                flex: 1, padding: "12px 14px", borderRadius: "var(--radius-md)",
                border: activePhase === phase ? `2px solid ${phaseColors[phase]}` : "1px solid var(--border)",
                background: activePhase === phase ? `${phaseColors[phase]}15` : "var(--bg-raised)",
              }}
            >
              <div className="font-mono text-xs uppercase tracking-wider" style={{ color: phaseColors[phase] }}>
                Phase {i + 1}
              </div>
              <div className="font-display text-[13px] font-bold tracking-wide mt-1">
                {BUILD_PHASE_LABELS[phase]}
              </div>
              <div className={`font-mono text-xs ${approved ? "text-text-green" : "text-text-muted"} mt-1`}>
                {imgs.length} / {required} images {approved ? " -- Approved" : ""}
              </div>
            </button>
          );
        })}
      </div>

      {/* Per-phase content */}
      <div className="bg-bg-raised border border-border rounded-lg" style={{
        padding: 16,
      }}>
        {/* Uploaded images grid */}
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
          Uploaded Images -- {phaseImages.length} / {phaseConfig.requiredImages} required
        </div>

        {phaseImages.length > 0 ? (
          <div className="mb-4" style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 10,
          }}>
            {phaseImages.map((img, idx) => (
              <div key={idx} className="border border-border rounded-md overflow-hidden" style={{
                background: "var(--bg-overlay)",
              }}>
                <div className="flex items-center justify-center" style={{
                  height: 90, background: "var(--bg-overlay)",
                }}>
                  <Icon n="camera" size={24} color="var(--text-muted)" />
                </div>
                <div style={{ padding: "6px 8px" }}>
                  <div className="font-mono text-xs text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                    {img.name}
                  </div>
                  <div className="font-mono text-xs text-text-muted">
                    {img.uploadDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4 rounded-md" style={{ border: "1px dashed var(--border)" }}>
            <EmptyState icon="camera" message="No images uploaded for this phase" pad={24} />
          </div>
        )}

        {/* Form status list */}
        {phaseConfig.forms.length > 0 && (
          <>
            <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5 mt-2">
              Required Forms
            </div>
            {phaseConfig.forms.map(form => {
              const completed = phaseForms[form] === "completed";
              return (
                <div key={form} className="flex items-center gap-2 border-b border-border" style={{
                  padding: "8px 0",
                }}>
                  <Icon
                    n={completed ? "check" : "alert"}
                    size={14}
                    color={completed ? "var(--green)" : "var(--text-muted)"}
                  />
                  <span className="font-mono text-xs text-text-secondary">
                    {FORM_LABELS[form] || form.replace(/_/g, " ")}
                  </span>
                  <span className={`font-mono text-xs ${completed ? "text-text-green" : "text-text-muted"} ml-auto`}>
                    {completed ? "Completed" : "Pending"}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* Phase approval buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {phaseApprovals[activePhase] ? (
            <div className="font-mono text-sm text-text-green flex items-center gap-1.5 rounded-md" style={{
              padding: "8px 16px", background: "var(--green-glow)",
              border: "1px solid var(--green-dim)",
            }}>
              <Icon n="check" size={14} color="var(--green)" />
              Phase Approved
            </div>
          ) : (
            <>
              <button
                className="toggle-btn green active flex items-center gap-1.5"
                onClick={handleApprovePhase}
                style={{ padding: "8px 16px" }}
              >
                <Icon n="check" size={14} color="#fff" />
                Approve Phase
              </button>
              <button
                className="toggle-btn flex items-center gap-1.5"
                onClick={() => setShowDisputeForm(true)}
                style={{
                  padding: "8px 16px",
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
        <div className="bg-bg-raised rounded-lg" style={{
          padding: 16,
          border: "1px solid var(--red-dim)",
        }}>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
            Raise Dispute
          </div>
          <TextArea
            label="Comment"
            value={disputeComment}
            onChange={setDisputeComment}
            placeholder="Describe the issue..."
            rows={3}
          />
          <div className="mt-2.5">
            <TextArea
              label="Instructions for Subcontractor"
              value={disputeInstructions}
              onChange={setDisputeInstructions}
              placeholder="Steps to resolve..."
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="toggle-btn flex items-center gap-1.5"
              onClick={handleRaiseDispute}
              style={{
                padding: "8px 16px",
                color: "var(--red)", borderColor: "var(--red-dim)", background: "var(--red-glow)",
              }}
            >
              <Icon n="alert" size={14} color="var(--red)" />
              Submit Dispute
            </button>
            <button
              className="px-4 py-2 rounded-md border border-border bg-bg-elevated text-text-secondary font-display text-[17px] font-bold tracking-[.03em] cursor-pointer transition-all"
              onClick={() => setShowDisputeForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className="bg-bg-raised border border-border rounded-md flex items-center gap-3" style={{
        padding: "12px 16px",
      }}>
        <div className="flex-1">
          <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3 }}>
            <div style={{
              width: `${build.progress}%`, height: "100%", borderRadius: 3,
              background: localDispute ? "var(--red)" : phaseColors[activePhase],
              transition: "width .3s ease",
            }} />
          </div>
        </div>
        <span className="font-mono text-xs text-text-secondary">{build.progress}% overall</span>
      </div>

      {/* Action bar */}
      <div className="flex gap-2 flex-wrap">
        <button className="toggle-btn primary flex items-center gap-1.5" style={{ padding: "8px 16px" }}>
          <Icon n="user" size={14} color="var(--primary)" />
          Reassign Subcontractor
        </button>
        <button className="toggle-btn flex items-center gap-1.5" style={{ padding: "8px 16px" }}>
          <Icon n="mail" size={14} color="var(--text-muted)" />
          Contact Subcontractor
        </button>
      </div>
    </div>
  );
};
