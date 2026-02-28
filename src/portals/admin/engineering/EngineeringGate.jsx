import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { BUILD_TYPES, BUILD_TYPE_KEYS } from "../../../data/buildTypes";
import { FileUploadZone, StatusBadge, AssignmentModal, EmptyState } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";
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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>Engineering Gate</h1>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Upload splicing plans, define build types — {eligibleSurveys.length} addresses ready
      </p>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20 }}>
        {/* Address list */}
        {(!isMobile || !selectedId) && (
        <div style={{ width: isMobile ? "100%" : 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {eligibleSurveys.map(s => {
            const hasPlan = !!uploadedPlans[s.id]?.length;
            const hasBuildType = !!buildTypeMap[s.id];
            return (
              <div
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                style={{
                  padding: "10px 14px", cursor: "pointer",
                  background: selectedId === s.id ? "var(--primary-glow)" : "var(--bg-raised)",
                  border: `1px solid ${selectedId === s.id ? "var(--primary-dim)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: hasPlan && hasBuildType ? "var(--green)" : "var(--primary)",
                  }} />
                  <span style={mono(12, "var(--text-primary)")}>{s.tsg_id}</span>
                </div>
                <div style={mono(12, "var(--text-secondary)", { marginTop: 2 })}>
                  {s.address.street} {s.address.number}
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Detail */}
        {(!isMobile || selectedId) && (
        <div style={{ flex: 1 }}>
          {selected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {isMobile && (
                <button
                  onClick={() => setSelectedId(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, ...mono(14, "var(--text-primary-accent)") }}
                >
                  <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                  Back to list
                </button>
              )}
              <div>
                <div style={disp(18, 700)}>{selected.address.street} {selected.address.number}</div>
                <div style={mono(12, "var(--text-secondary)", { marginTop: 4 })}>
                  {selected.tsg_id} · {selected.address.postal_code} {selected.address.city}
                </div>
              </div>

              {/* Build Type Selection */}
              <div>
                <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
                  Build Type
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
                  <div style={mono(12, "var(--text-secondary)", { marginTop: 6 })}>
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
              {/* Gate status */}
              <div style={{
                padding: "12px 16px", borderRadius: "var(--radius-md)",
                background: (buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length)
                  ? "var(--green-glow)" : "var(--primary-glow)",
                border: `1px solid ${(buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length) ? "var(--green-dim)" : "var(--primary-dim)"}`,
              }}>
                <div style={mono(12, (buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length) ? "var(--text-green)" : "var(--text-primary-accent)")}>
                  {(buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length)
                    ? "✓ Engineering gate cleared — ready for subcontractor assignment"
                    : "⏳ Engineering gate not cleared — assign build type and upload plans"}
                </div>
              </div>

              {/* Subcontractor assignment */}
              {buildTypeMap[selected.id] && uploadedPlans[selected.id]?.length > 0 && (
                <div>
                  {selected.assigned_subcontractor ? (
                    <div style={{
                      padding: "12px 16px", borderRadius: "var(--radius-md)",
                      background: "var(--bg-raised)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div>
                        <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 })}>
                          Assigned Subcontractor
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Icon n="settings" size={14} color="var(--text-secondary)" />
                          <span style={mono(13, "var(--text-primary)")}>{selected.assigned_subcontractor}</span>
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
                      className="toggle-btn primary active"
                      onClick={() => setAssignModal(selected)}
                      style={{ padding: "8px 20px", display: "flex", alignItems: "center", gap: 6 }}
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
