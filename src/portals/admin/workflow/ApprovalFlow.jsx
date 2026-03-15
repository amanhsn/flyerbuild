"use client"

import { useState, useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { StatusBadge, EmptyState } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

// ---------------------------------------------------------------------------
// 9-step approval journey
// ---------------------------------------------------------------------------
function getApprovalSteps(survey) {
  const s = survey.status;
  const phases = ["validation_client", "completed", "sent"];
  const isValidated = ["validation_client", "completed", "sent"].includes(s);
  const isClientApproved = ["completed", "sent"].includes(s);
  const hasSyndicSign = !!survey.agreement?.owner_signature;
  const hasEngineering = false; // mock — no engineering data yet
  const hasSubco = !!survey.assigned_subcontractor;

  return [
    {
      key: "survey_completed",
      label: "Survey Completed",
      icon: "check",
      status: survey.completed_sections?.length > 0 ? "completed" : "pending",
      actor: survey.assigned_surveyor || null,
      timestamp: survey.completed_at || null,
    },
    {
      key: "ssv_created",
      label: "SSV Created",
      icon: "file",
      status: isValidated ? "completed" : s === "validation_f49" ? "current" : "pending",
      actor: survey.validated_by || null,
      timestamp: survey.validated_at || null,
    },
    {
      key: "tsa_created",
      label: "TSA Created",
      icon: "mail",
      status: isClientApproved ? "completed" : isValidated ? "current" : "pending",
      actor: null,
      timestamp: null,
      detail: hasSyndicSign ? "Signed by syndic" : null,
    },
    {
      key: "engineering",
      label: "Engineering Inputs",
      icon: "settings",
      status: hasEngineering ? "completed" : isClientApproved ? "current" : "pending",
      actor: null,
      timestamp: null,
    },
    {
      key: "ready_construction",
      label: "Ready for Construction",
      icon: "zap",
      status: hasSubco ? "completed" : hasEngineering ? "current" : "pending",
      actor: survey.assigned_subcontractor || null,
      timestamp: survey.assigned_subcontractor_date || null,
    },
    {
      key: "build_status",
      label: "Build Status",
      icon: "building",
      status: "pending",
      actor: null,
      timestamp: null,
    },
    {
      key: "build_approved",
      label: "Build Approved",
      icon: "shield",
      status: "pending",
      actor: null,
      timestamp: null,
      branches: ["Approved", "Dispute"],
    },
    {
      key: "finances",
      label: "Finances Generated",
      icon: "clipboard",
      status: "pending",
      actor: null,
      timestamp: null,
    },
    {
      key: "build_complete",
      label: "Build Complete",
      icon: "flag",
      status: "pending",
      actor: null,
      timestamp: null,
    },
  ];
}

export const ApprovalFlow = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const approvalSurveys = useMemo(() =>
    MOCK_SURVEYS.filter(s =>
      ["validation_f49", "validation_client", "completed", "sent"].includes(s.status)
    ), []
  );

  const selectedData = approvalSurveys.find(s => s.id === selectedSurvey);
  const steps = selectedData ? getApprovalSteps(selectedData) : [];

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Approval Flow</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Full journey visibility — {approvalSurveys.length} addresses in pipeline
      </p>

      <div className="gap-5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* List */}
        {(!isMobile || !selectedSurvey) && (
          <div className="shrink-0 flex flex-col gap-2" style={{ width: isMobile ? "100%" : 300 }}>
            {approvalSurveys.map(s => {
              const stepsDone = getApprovalSteps(s).filter(st => st.status === "completed").length;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSurvey(s.id)}
                  className="cursor-pointer rounded-md flex items-center gap-2.5"
                  style={{
                    padding: "12px 16px",
                    background: selectedSurvey === s.id ? "var(--primary-glow)" : "var(--bg-raised)",
                    border: `1px solid ${selectedSurvey === s.id ? "var(--primary-dim)" : "var(--border)"}`,
                  }}
                >
                  <StatusBadge status={s.status} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-text-primary truncate">{s.address.street} {s.address.number}</div>
                    <div className="font-mono text-xs text-text-muted">{s.tsg_id}</div>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted shrink-0">{stepsDone}/9</span>
                  <Icon n="chevR" size={12} color="var(--text-muted)" />
                </div>
              );
            })}
          </div>
        )}

        {/* Stepper detail */}
        {(!isMobile || selectedSurvey) && (
          <div className="flex-1">
            {selectedData ? (
              <div className="flex flex-col gap-4">
                {isMobile && (
                  <button
                    onClick={() => setSelectedSurvey(null)}
                    className="font-mono text-sm text-text-primary-accent flex items-center gap-1.5 cursor-pointer"
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                    Back to list
                  </button>
                )}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={selectedData.status} size="md" />
                    <span className="font-mono text-xs text-text-muted">{selectedData.tsg_id}</span>
                  </div>
                  <div className="font-display text-lg font-bold tracking-wide">
                    {selectedData.address.street} {selectedData.address.number}
                  </div>
                  <div className="font-mono text-xs text-text-secondary mt-0.5">
                    {selectedData.address.postal_code} {selectedData.address.city}
                  </div>
                </div>

                {/* Stepper — horizontal on desktop, vertical on mobile */}
                {isMobile ? (
                  <VerticalStepper steps={steps} />
                ) : (
                  <HorizontalStepper steps={steps} />
                )}

                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className="toggle-btn green active flex items-center gap-1.5" style={{ padding: "8px 16px" }}>
                    <Icon n="file" size={14} color="#fff" /> Generate PDF
                  </button>
                  <button className="toggle-btn primary flex items-center gap-1.5" style={{ padding: "8px 16px" }}>
                    <Icon n="mail" size={14} color="var(--primary)" /> Send Email
                  </button>
                </div>
              </div>
            ) : (
              <EmptyState icon="shield" message="Select an address to view approval journey" sub="Choose from the list on the left" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// HorizontalStepper — desktop layout
// ---------------------------------------------------------------------------
const HorizontalStepper = ({ steps }) => (
  <div className="bg-bg-raised border border-border rounded-lg p-5 overflow-x-auto">
    <div className="flex items-start min-w-[800px]">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-start flex-1">
          <div className="flex flex-col items-center flex-1">
            {/* Icon circle */}
            <StepIcon step={step} />
            {/* Label + details */}
            <div className="text-center mt-2">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider" style={{
                color: step.status === "completed" ? "var(--dark-green)"
                  : step.status === "current" ? "var(--amber)"
                  : "var(--text-muted)",
              }}>
                {step.label}
              </div>
              {step.actor && (
                <div className="font-mono text-[9px] text-text-secondary mt-0.5">{step.actor}</div>
              )}
              {step.timestamp && (
                <div className="font-mono text-[9px] text-text-muted mt-0.5">
                  {new Date(step.timestamp).toLocaleDateString()}
                </div>
              )}
              {step.branches && step.status !== "completed" && (
                <div className="flex gap-1 mt-1 justify-center">
                  {step.branches.map(b => (
                    <span key={b} className="font-mono text-[8px] px-1 py-[1px] rounded-sm bg-bg-elevated border border-border text-text-muted">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div className="flex-shrink-0 mt-4 px-0" style={{ width: 20 }}>
              <div className="h-[2px] w-full" style={{
                background: step.status === "completed" ? "var(--dark-green)" : "var(--border)",
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// VerticalStepper — mobile layout
// ---------------------------------------------------------------------------
const VerticalStepper = ({ steps }) => (
  <div className="bg-bg-raised border border-border rounded-lg p-4">
    {steps.map((step, i) => (
      <div key={step.key} className="flex gap-3">
        {/* Icon + connector */}
        <div className="flex flex-col items-center">
          <StepIcon step={step} />
          {i < steps.length - 1 && (
            <div className="w-[2px] flex-1 min-h-[24px]" style={{
              background: step.status === "completed" ? "var(--dark-green)" : "var(--border)",
            }} />
          )}
        </div>
        {/* Content */}
        <div className="pb-4 flex-1 min-w-0">
          <div className="font-mono text-xs font-semibold" style={{
            color: step.status === "completed" ? "var(--dark-green)"
              : step.status === "current" ? "var(--amber)"
              : "var(--text-muted)",
          }}>
            {step.label}
          </div>
          {step.actor && (
            <div className="font-mono text-[10px] text-text-secondary mt-0.5">{step.actor}</div>
          )}
          {step.timestamp && (
            <div className="font-mono text-[10px] text-text-muted mt-0.5">
              {new Date(step.timestamp).toLocaleDateString()}
            </div>
          )}
          {step.detail && (
            <div className="font-mono text-[10px] text-text-secondary mt-0.5">{step.detail}</div>
          )}
          {step.branches && step.status !== "completed" && (
            <div className="flex gap-1 mt-1">
              {step.branches.map(b => (
                <span key={b} className="font-mono text-[8px] px-1 py-[1px] rounded-sm bg-bg-elevated border border-border text-text-muted">
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// StepIcon — icon circle with status colors
// ---------------------------------------------------------------------------
const StepIcon = ({ step }) => {
  const size = 32;
  let bg, iconColor;

  if (step.status === "completed") {
    bg = "var(--dark-green)";
    iconColor = "#fff";
  } else if (step.status === "current") {
    bg = "var(--amber)";
    iconColor = "#fff";
  } else {
    bg = "var(--bg-overlay)";
    iconColor = "var(--text-muted)";
  }

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size, height: size, background: bg,
        boxShadow: step.status === "current" ? "0 0 0 3px var(--amber-glow)" : undefined,
        animation: step.status === "current" ? "pulseDot 1.4s ease infinite" : undefined,
      }}
    >
      {step.status === "completed" ? (
        <Icon n="check" size={14} color={iconColor} />
      ) : (
        <Icon n={step.icon} size={14} color={iconColor} />
      )}
    </div>
  );
};
