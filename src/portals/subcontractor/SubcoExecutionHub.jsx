"use client"

import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { DisputeBanner, FileUploadZone, StatusBadge } from "../../components/shared";
import { BUILD_TYPES } from "../../data/buildTypes";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { CONSTRUCTION_STATUSES } from "../../data/constructionStatuses";

export const SubcoExecutionHub = ({ assignment, onBack }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [acceptState, setAcceptState] = useState(assignment.status !== "pending_acceptance");
  const [meetstaatFile, setMeetstaatFile] = useState([]);
  const [infoExpanded, setInfoExpanded] = useState(!isMobile);
  const [quadrant, setQuadrant] = useState("");
  const [constructionStatus, setConstructionStatus] = useState(null);
  const [disputeNote, setDisputeNote] = useState("");

  // Image categories (replacing 3-phase)
  const [introImages, setIntroImages] = useState([]);
  const [vcImages, setVcImages] = useState([]);

  const buildType = BUILD_TYPES[assignment.buildType] || BUILD_TYPES.sdu_standard;
  const isDisputed = assignment.status === "disputed";
  const isCompleted = assignment.status === "completed";

  // Mock documents (SSV + engineering)
  const documents = [
    { type: "SSV", label: "Site Survey Report (SSV)", filename: `SSV_${assignment.tsg_id}.pdf`, available: true },
    { type: "PDP", label: "PDP — Splicing", filename: `PDP_${assignment.tsg_id}.pdf`, available: Math.random() > 0.3 },
    { type: "DP", label: "DP — Splicing", filename: `DP_${assignment.tsg_id}.pdf`, available: Math.random() > 0.5 },
    { type: "POC", label: "POC — Splicing", filename: null, available: false },
    { type: "BUDI", label: "BUDI — Splicing", filename: null, available: false },
    { type: "Floorboxes", label: "Floorboxes — Splicing", filename: null, available: false },
    { type: "Blowing", label: "Blowing / Jetting Plan", filename: null, available: false },
  ];

  const canSubmit = introImages.length >= 1 && vcImages.length >= 1;

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="font-mono text-sm text-text-muted flex items-center gap-1 cursor-pointer"
          style={{ background: "none", border: "none", padding: 4 }}
        >
          <Icon n="chevR" size={16} color="var(--text-muted)" style={{ transform: "rotate(180deg)" }} />
          {isMobile && "Back"}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`font-display ${isMobile ? "text-xl" : "text-2xl"} font-extrabold tracking-wide`}>
            {assignment.address.street} {assignment.address.number}
          </div>
          <div className="font-mono text-xs text-text-secondary mt-0.5">
            {assignment.tsg_id} · {buildType.label} · {assignment.address.postal_code} {assignment.address.city}
          </div>
        </div>
        {constructionStatus && (
          <span className="font-mono text-[10px] px-2 py-1 rounded-sm border" style={{
            color: CONSTRUCTION_STATUSES[constructionStatus]?.color,
            background: CONSTRUCTION_STATUSES[constructionStatus]?.bg,
            borderColor: CONSTRUCTION_STATUSES[constructionStatus]?.border,
          }}>
            {CONSTRUCTION_STATUSES[constructionStatus]?.label}
          </span>
        )}
      </div>

      {/* Dispute banner */}
      {isDisputed && <DisputeBanner dispute={assignment.dispute} />}

      {/* Pending acceptance */}
      {!acceptState && (
        <div className="text-center mb-5 bg-bg-raised border border-border rounded-lg" style={{ padding: 24 }}>
          <div className="font-display text-lg font-bold tracking-wide mb-2">New Assignment</div>
          <div className="font-mono text-sm text-text-secondary mb-4">
            Accept this package to begin build execution
          </div>
          <div className="flex gap-2.5 justify-center flex-wrap">
            <button className="toggle-btn green active" onClick={() => setAcceptState(true)} style={{ padding: "8px 20px" }}>
              Accept Package
            </button>
            <button className="toggle-btn primary" style={{ padding: "8px 20px" }}>
              Request Reassignment
            </button>
          </div>
        </div>
      )}

      {acceptState && !isCompleted && (
        <div className="flex flex-col gap-5">
          {/* ─── Documents Section ─── */}
          <div className="bg-bg-raised border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-bg-elevated border-b border-border">
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest">Documents</div>
            </div>
            <div className="divide-y divide-border">
              {documents.map(doc => (
                <div key={doc.type} className="flex items-center gap-3 px-4 py-2.5">
                  <Icon n="file" size={14} color={doc.available ? "var(--dark-green)" : "var(--text-muted)"} />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs text-text-primary">{doc.label}</div>
                    {doc.filename && (
                      <div className="font-mono text-[10px] text-text-muted mt-0.5">{doc.filename}</div>
                    )}
                  </div>
                  {doc.available ? (
                    <button className="font-mono text-[10px] text-text-primary-accent bg-transparent border-none cursor-pointer underline underline-offset-2">
                      Download
                    </button>
                  ) : (
                    <span className="font-mono text-[10px] text-text-muted">Not available</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Collapsible Key Info Bar ─── */}
          <div className="bg-bg-raised border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setInfoExpanded(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-bg-elevated border-b border-border cursor-pointer bg-transparent border-none"
              style={{ borderBottom: infoExpanded ? "1px solid var(--border)" : "none" }}
            >
              <span className="font-mono text-xs text-text-muted uppercase tracking-widest">Key Information</span>
              <Icon n="chevR" size={12} color="var(--text-muted)" className={`transition-transform ${infoExpanded ? "rotate-90" : ""}`} />
            </button>
            {infoExpanded && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                <InfoField label="Address" value={`${assignment.address.street} ${assignment.address.number}`} />
                <InfoField label="MRO Zone" value={assignment.mro_zone || "MRO-WERK-A"} />
                <InfoField label="POP Zone" value={assignment.pop_area || "POP-WERK-01"} />
                <InfoField label="Building ID" value={assignment.building_id || assignment.tsg_id} />
                <InfoField label="Building Group" value={assignment.group_id || "--"} />
                <InfoField label="Building Type" value={buildType.label} />
                <InfoField label="Number of Units" value={assignment.units || "--"} />
                <InfoField label="Layers" value={assignment.layers || "--"} />
                <InfoField label="Distribution" value={assignment.distribution || "--"} />
                {assignment.remarks && (
                  <div className="col-span-full">
                    <InfoField label="Remarks" value={assignment.remarks || "--"} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Subcontractor Editable Fields ─── */}
          <div className="bg-bg-raised border border-border rounded-lg p-4">
            <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">Editable Fields</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-1">Quadrant</label>
                <input
                  type="text"
                  value={quadrant}
                  onChange={(e) => setQuadrant(e.target.value)}
                  placeholder="Enter quadrant..."
                  className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-2 px-3 outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* ─── Construction Status ─── */}
          <div className="bg-bg-raised border border-border rounded-lg p-4">
            <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">Construction Status</div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(CONSTRUCTION_STATUSES).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === "dispute") {
                      setConstructionStatus(key);
                    } else {
                      setConstructionStatus(key);
                      setDisputeNote("");
                    }
                  }}
                  className="toggle-btn"
                  style={{
                    padding: "6px 14px",
                    background: constructionStatus === key ? cfg.bg : undefined,
                    color: constructionStatus === key ? cfg.color : undefined,
                    borderColor: constructionStatus === key ? cfg.border : undefined,
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
            {constructionStatus === "dispute" && (
              <div className="mt-3">
                <label className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-1">
                  Dispute Reason <span className="text-text-red">*</span>
                </label>
                <textarea
                  value={disputeNote}
                  onChange={(e) => setDisputeNote(e.target.value)}
                  placeholder="Describe the reason for dispute..."
                  rows={3}
                  className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-2 px-3 outline-none focus:border-primary resize-none"
                />
              </div>
            )}
          </div>

          {/* ─── Category 1: INTRO Images ─── */}
          <div className="bg-bg-raised border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-bg-elevated border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  INTRO — Fibre Introduction
                </span>
                {introImages.length >= 1 && (
                  <Icon n="check" size={12} color="var(--dark-green)" />
                )}
              </div>
              <span className="font-mono text-[10px] text-text-muted">
                {introImages.length} photo{introImages.length !== 1 ? "s" : ""} · min. 1 required
              </span>
            </div>
            <div className="p-4">
              <FileUploadZone
                files={introImages}
                onUpload={(fileList) => {
                  const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size }));
                  setIntroImages(prev => [...prev, ...newFiles]);
                }}
                onDelete={(idx) => setIntroImages(prev => prev.filter((_, i) => i !== idx))}
                accept="image/*"
                maxFiles={20}
                disabled={isDisputed}
              />
            </div>
          </div>

          {/* ─── Category 2: Vertical Cabling Images ─── */}
          <div className="bg-bg-raised border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-bg-elevated border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  VC — Vertical Cabling
                </span>
                {vcImages.length >= 1 && (
                  <Icon n="check" size={12} color="var(--dark-green)" />
                )}
              </div>
              <span className="font-mono text-[10px] text-text-muted">
                {vcImages.length} photo{vcImages.length !== 1 ? "s" : ""} · min. 1 required
              </span>
            </div>
            <div className="p-4">
              <FileUploadZone
                files={vcImages}
                onUpload={(fileList) => {
                  const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size }));
                  setVcImages(prev => [...prev, ...newFiles]);
                }}
                onDelete={(idx) => setVcImages(prev => prev.filter((_, i) => i !== idx))}
                accept="image/*"
                maxFiles={20}
                disabled={isDisputed}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 flex-wrap">
            <button
              className="toggle-btn green active flex items-center gap-1.5"
              style={{ padding: "10px 24px" }}
              disabled={!canSubmit}
            >
              <Icon n="check" size={14} color={canSubmit ? "#fff" : "var(--text-muted)"} />
              Submit Job
            </button>
            <div className="font-mono text-[10px] text-text-muted self-center">
              {!canSubmit && "Upload at least 1 INTRO and 1 VC photo to submit"}
            </div>
          </div>
        </div>
      )}

      {/* Completed state — meetstaat */}
      {isCompleted && (
        <div>
          <div className="text-center mb-5 rounded-lg" style={{
            padding: 16,
            background: "var(--dark-green-glow)", border: "1px solid var(--dark-green-dim)",
          }}>
            <Icon n="check" size={24} color="var(--dark-green)" />
            <div className="font-display text-base font-bold tracking-wide mt-2" style={{ color: "var(--dark-green)" }}>Build Completed</div>
          </div>

          <FileUploadZone
            label="Meetstaat — Upload Final Return PDF"
            files={meetstaatFile}
            onUpload={(fileList) => {
              setMeetstaatFile(Array.from(fileList).map(f => ({ name: f.name, size: f.size })));
            }}
            onDelete={(idx) => setMeetstaatFile(f => f.filter((_, i) => i !== idx))}
            accept=".pdf"
            maxFiles={1}
          />
          {meetstaatFile.length > 0 && (
            <button className="toggle-btn green active mt-4" style={{ padding: "8px 20px" }}>
              Submit Meetstaat
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// InfoField — read-only field in key info bar
// ---------------------------------------------------------------------------
const InfoField = ({ label, value }) => (
  <div>
    <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">{label}</div>
    <div className="font-mono text-xs text-text-primary mt-0.5">{value}</div>
  </div>
);
