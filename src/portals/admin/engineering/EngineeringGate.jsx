import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { BUILD_TYPES, BUILD_TYPE_KEYS } from "../../../data/buildTypes";
import { FileUploadZone, StatusBadge, AssignmentModal, EmptyState } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const EngineeringGate = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [surveys, setSurveys] = useState(MOCK_SURVEYS);
  const [selectedId, setSelectedId] = useState(null);
  const [buildTypeMap, setBuildTypeMap] = useState({});
  const [uploadedPlans, setUploadedPlans] = useState({});
  const [assignModal, setAssignModal] = useState(null);

  const eligibleSurveys = surveys.filter(s =>
    ["completed", "sent", "validation_client"].includes(s.status)
  );

  const selected = eligibleSurveys.find(s => s.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Engineering Gate</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Upload splicing plans, define build types -- {eligibleSurveys.length} addresses ready
      </p>

      <div className="gap-5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Address list */}
        {(!isMobile || !selectedId) && (
        <div className="shrink-0 flex flex-col gap-1.5" style={{ width: isMobile ? "100%" : 280 }}>
          {eligibleSurveys.map(s => {
            const hasPlan = !!uploadedPlans[s.id]?.length;
            const hasBuildType = !!buildTypeMap[s.id];
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
                    background: hasPlan && hasBuildType ? "var(--green)" : "var(--primary)",
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

        {/* Detail */}
        {(!isMobile || selectedId) && (
        <div className="flex-1">
          {selected ? (
            <div className="flex flex-col gap-5">
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

              {/* Build Type Selection */}
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

              {/* File uploads */}
              <FileUploadZone
                label="Splicing Plans & Intro Files"
                files={uploadedPlans[selected.id] || []}
                onUpload={(fileList) => {
                  const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size }));
                  setUploadedPlans(p => ({
                    ...p,
                    [selected.id]: [...(p[selected.id] || []), ...newFiles],
                  }));
                }}
                onDelete={(idx) => {
                  setUploadedPlans(p => ({
                    ...p,
                    [selected.id]: (p[selected.id] || []).filter((_, i) => i !== idx),
                  }));
                }}
                accept=".pdf,.dwg,.dxf,image/*"
                maxFiles={10}
              />

              {/* Gate status */}
              <div className="rounded-md" style={{
                padding: "12px 16px",
                background: (buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length)
                  ? "var(--green-glow)" : "var(--primary-glow)",
                border: `1px solid ${(buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length) ? "var(--green-dim)" : "var(--primary-dim)"}`,
              }}>
                <div className={`font-mono text-xs ${(buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length) ? "text-text-green" : "text-text-primary-accent"}`}>
                  {(buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length)
                    ? "Engineering gate cleared -- ready for subcontractor assignment"
                    : "Engineering gate not cleared -- assign build type and upload plans"}
                </div>
              </div>

              {/* Subcontractor assignment */}
              {buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length > 0 && (
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
