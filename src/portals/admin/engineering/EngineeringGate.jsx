"use client"

import { useState, useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { BUILD_TYPES, BUILD_TYPE_KEYS } from "../../../data/buildTypes";
import { FileUploadZone, StatusBadge, AssignmentModal, EmptyState } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { DB7_OPTIONS, SUBDUCT_COLOR_OPTIONS } from "../../../data/engineeringConstants";

// ---------------------------------------------------------------------------
// Section completion check
// ---------------------------------------------------------------------------
function isGateComplete(gateData) {
  if (!gateData) return false;
  const sec1 = gateData.db7 && gateData.subduct_color;
  const sec2 = (gateData.splicing_files || []).some(slot => slot.length > 0);
  // Section 3 (blowing) is optional
  const sec4 = !!gateData.label?.trim();
  const sec5 = !!gateData.address?.trim();
  return sec1 && sec2 && sec4 && sec5;
}

const SPLICING_SLOTS = [
  { key: "pdp", label: "PDP" },
  { key: "dp", label: "DP" },
  { key: "poc", label: "POC" },
  { key: "budi", label: "BUDI" },
  { key: "floorboxes", label: "Floorboxes" },
];

const emptyGateData = () => ({
  db7: "",
  subduct_color: "",
  splicing_files: [[], [], [], [], []], // PDP, DP, POC, BUDI, Floorboxes
  blowing_file: [],
  label: "",
  address: "",
});

export const EngineeringGate = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [selectedId, setSelectedId] = useState(null);
  const [buildTypeMap, setBuildTypeMap] = useState({});
  const [gateDataMap, setGateDataMap] = useState({});
  const [assignModal, setAssignModal] = useState(null);

  const eligibleSurveys = surveys.filter(s =>
    ["completed", "sent", "validation_client"].includes(s.status)
  );

  const selected = eligibleSurveys.find(s => s.id === selectedId);
  const gateData = selectedId ? (gateDataMap[selectedId] || emptyGateData()) : null;

  const updateGateField = (field, value) => {
    setGateDataMap(prev => ({
      ...prev,
      [selectedId]: { ...(prev[selectedId] || emptyGateData()), [field]: value },
    }));
  };

  const updateSplicingSlot = (slotIndex, files) => {
    const current = gateData.splicing_files || [[], [], [], [], []];
    const next = [...current];
    next[slotIndex] = files;
    updateGateField("splicing_files", next);
  };

  const gateComplete = gateData ? isGateComplete(gateData) : false;
  const hasSplicingFile = gateData?.splicing_files?.some(slot => slot.length > 0);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Engineering Gate</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Structured engineering inputs — {eligibleSurveys.length} addresses ready
      </p>

      <div className="gap-5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Address list */}
        {(!isMobile || !selectedId) && (
        <div className="shrink-0 flex flex-col gap-1.5" style={{ width: isMobile ? "100%" : 280 }}>
          {eligibleSurveys.map(s => {
            const gd = gateDataMap[s.id];
            const complete = gd ? isGateComplete(gd) : false;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="cursor-pointer rounded-md"
                style={{
                  padding: "10px 14px",
                  background: selectedId === s.id ? "var(--primary-glow)" : "var(--bg-raised)",
                  border: `1px solid ${selectedId === s.id ? "var(--primary-dim)" : "var(--border)"}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: complete ? "var(--dark-green)" : "var(--amber)",
                  }} />
                  <span className="font-mono text-xs text-text-primary">{s.tsg_id}</span>
                </div>
                <div className="font-mono text-xs text-text-secondary mt-0.5">
                  {s.address.street} {s.address.number}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Detail - 5 Sections */}
        {(!isMobile || selectedId) && (
        <div className="flex-1">
          {selected ? (
            <div className="flex flex-col gap-6">
              {isMobile && (
                <button
                  onClick={() => setSelectedId(null)}
                  className="font-mono text-sm text-text-primary-accent flex items-center gap-1.5 cursor-pointer"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                  Back to list
                </button>
              )}
              <div>
                <div className="font-display text-lg font-bold tracking-wide">{selected.address.street} {selected.address.number}</div>
                <div className="font-mono text-xs text-text-secondary mt-1">
                  {selected.tsg_id} · {selected.address.postal_code} {selected.address.city}
                </div>
              </div>

              {/* Build Type Selection (existing) */}
              <div>
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
                  Build Type
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {BUILD_TYPE_KEYS.map(bt => (
                    <button
                      key={bt}
                      className={`toggle-btn primary${buildTypeMap[selected.id] === bt ? " active" : ""}`}
                      onClick={() => setBuildTypeMap(m => ({ ...m, [selected.id]: bt }))}
                      style={{ padding: "6px 12px" }}
                    >
                      {BUILD_TYPES[bt].label}
                    </button>
                  ))}
                </div>
                {buildTypeMap[selected.id] && (
                  <div className="font-mono text-xs text-text-secondary mt-1.5">
                    {BUILD_TYPES[buildTypeMap[selected.id]].description}
                  </div>
                )}
              </div>

              {/* ─── SECTION 1: Intro (DB7 + SubDuct) ─── */}
              <SectionBox title="Section 1 — Intro" number={1} complete={!!gateData.db7 && !!gateData.subduct_color}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-1.5">
                      DB7 Field
                    </label>
                    <select
                      value={gateData.db7}
                      onChange={(e) => updateGateField("db7", e.target.value)}
                      className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-2 px-3 cursor-pointer"
                    >
                      <option value="">Select DB7...</option>
                      {DB7_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="font-mono text-[9px] text-amber mt-1">
                      [TODO: Awaiting colour options from Mustafa]
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-1.5">
                      SubDuct Colour
                    </label>
                    <select
                      value={gateData.subduct_color}
                      onChange={(e) => updateGateField("subduct_color", e.target.value)}
                      className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-2 px-3 cursor-pointer"
                    >
                      <option value="">Select colour...</option>
                      {SUBDUCT_COLOR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="font-mono text-[9px] text-amber mt-1">
                      [TODO: Awaiting colour options from Mustafa]
                    </div>
                  </div>
                </div>
              </SectionBox>

              {/* ─── SECTION 2: Splicing ─── */}
              <SectionBox title="Section 2 — Splicing" number={2} complete={hasSplicingFile}>
                <p className="font-mono text-[10px] text-text-muted mb-3">
                  Upload PDF files for each splicing type. At least one is required.
                </p>
                <div className="flex flex-col gap-3">
                  {SPLICING_SLOTS.map((slot, idx) => (
                    <div key={slot.key}>
                      <div className="font-mono text-[10px] text-text-secondary font-semibold uppercase tracking-wider mb-1">
                        {slot.label}
                      </div>
                      <FileUploadZone
                        files={gateData.splicing_files[idx] || []}
                        onUpload={(fileList) => {
                          const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size }));
                          updateSplicingSlot(idx, [...(gateData.splicing_files[idx] || []), ...newFiles]);
                        }}
                        onDelete={(fIdx) => {
                          updateSplicingSlot(idx, (gateData.splicing_files[idx] || []).filter((_, i) => i !== fIdx));
                        }}
                        accept=".pdf"
                        maxFiles={5}
                      />
                    </div>
                  ))}
                </div>
              </SectionBox>

              {/* ─── SECTION 3: Blowing (Optional) ─── */}
              <SectionBox title="Section 3 — Blowing" number={3} complete={gateData.blowing_file?.length > 0} optional>
                <p className="font-mono text-[10px] text-text-muted mb-3">
                  Optional jetting/blowing plan PDF.
                </p>
                <FileUploadZone
                  files={gateData.blowing_file || []}
                  onUpload={(fileList) => {
                    const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size }));
                    updateGateField("blowing_file", [...(gateData.blowing_file || []), ...newFiles]);
                  }}
                  onDelete={(fIdx) => {
                    updateGateField("blowing_file", (gateData.blowing_file || []).filter((_, i) => i !== fIdx));
                  }}
                  accept=".pdf"
                  maxFiles={1}
                />
              </SectionBox>

              {/* ─── SECTION 4: Label ─── */}
              <SectionBox title="Section 4 — Label" number={4} complete={!!gateData.label?.trim()}>
                <label className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-1.5">
                  Label <span className="text-text-red">*</span>
                </label>
                <input
                  type="text"
                  value={gateData.label}
                  onChange={(e) => updateGateField("label", e.target.value)}
                  placeholder="Enter label..."
                  className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-2 px-3 outline-none focus:border-primary"
                />
              </SectionBox>

              {/* ─── SECTION 5: Address ─── */}
              <SectionBox title="Section 5 — Address" number={5} complete={!!gateData.address?.trim()}>
                <label className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-1.5">
                  Address <span className="text-text-red">*</span>
                </label>
                <input
                  type="text"
                  value={gateData.address}
                  onChange={(e) => updateGateField("address", e.target.value)}
                  placeholder="Enter address..."
                  className="w-full font-mono text-xs bg-bg-elevated border border-border rounded-md text-text-primary py-2 px-3 outline-none focus:border-primary"
                />
              </SectionBox>

              {/* Gate status */}
              <div className="rounded-md" style={{
                padding: "12px 16px",
                background: gateComplete ? "var(--dark-green-glow)" : "var(--amber-glow)",
                border: `1px solid ${gateComplete ? "var(--dark-green-dim)" : "var(--amber-dim)"}`,
              }}>
                <div className="flex items-center gap-2">
                  <Icon n={gateComplete ? "check" : "alert"} size={14} color={gateComplete ? "var(--dark-green)" : "var(--amber)"} />
                  <span className="font-mono text-xs" style={{ color: gateComplete ? "var(--dark-green)" : "var(--amber)" }}>
                    {gateComplete
                      ? "Engineering gate cleared — ready for subcontractor assignment"
                      : "Engineering gate not cleared — complete all required sections"}
                  </span>
                </div>
              </div>

              {/* Subcontractor assignment */}
              {gateComplete && (
                <div>
                  {selected.assigned_subcontractor ? (
                    <div className="rounded-md bg-bg-raised border border-border flex items-center justify-between" style={{
                      padding: "12px 16px",
                    }}>
                      <div>
                        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-1">
                          Assigned Subcontractor
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icon n="settings" size={14} color="var(--text-secondary)" />
                          <span className="font-mono text-[13px] text-text-primary">{selected.assigned_subcontractor}</span>
                        </div>
                      </div>
                      <button
                        className="cta-btn secondary"
                        onClick={() => setAssignModal(selected)}
                        style={{ padding: "6px 14px" }}
                      >
                        Reassign
                      </button>
                    </div>
                  ) : (
                    <button
                      className="toggle-btn primary active flex items-center gap-1.5"
                      onClick={() => setAssignModal(selected)}
                      style={{ padding: "8px 20px" }}
                    >
                      <Icon n="settings" size={14} color="#fff" />
                      Assign Subcontractor
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <EmptyState icon="settings" message="Select an address to configure engineering inputs" sub="Choose from the list on the left" />
          )}
        </div>
        )}
      </div>

      {assignModal && (
        <AssignmentModal
          title="Assign Subcontractor"
          subtitle={`${assignModal.tsg_id} — ${assignModal.address.street} ${assignModal.address.number}`}
          role="subcontractor"
          currentValue={assignModal.assigned_subcontractor}
          onCancel={() => setAssignModal(null)}
          onSubmit={(userName, notes) => {
            setSurveys(prev => prev.map(s =>
              s.id === assignModal.id
                ? { ...s, assigned_subcontractor: userName, assigned_subcontractor_date: new Date().toISOString() }
                : s
            ));
            setAssignModal(null);
          }}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// SectionBox — visual wrapper for each engineering section
// ---------------------------------------------------------------------------
const SectionBox = ({ title, number, complete, optional, children }) => (
  <div
    className="rounded-lg border overflow-hidden"
    style={{
      borderColor: complete ? "var(--dark-green-dim)" : "var(--border)",
      borderLeft: complete ? "3px solid var(--dark-green)" : undefined,
    }}
  >
    <div className="flex items-center gap-2 px-4 py-2.5" style={{
      background: complete ? "var(--dark-green-glow)" : "var(--bg-elevated)",
    }}>
      <span className="font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
        background: complete ? "var(--dark-green)" : "var(--bg-overlay)",
        color: complete ? "#fff" : "var(--text-muted)",
      }}>
        {complete ? <Icon n="check" size={10} color="#fff" /> : number}
      </span>
      <span className="font-mono text-xs font-semibold uppercase tracking-wider" style={{
        color: complete ? "var(--dark-green)" : "var(--text-secondary)",
      }}>
        {title}
      </span>
      {optional && (
        <span className="font-mono text-[9px] text-text-muted px-1.5 py-[1px] bg-bg-overlay rounded-sm border border-border">
          Optional
        </span>
      )}
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);
