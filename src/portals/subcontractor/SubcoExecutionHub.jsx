import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { DisputeBanner, FileUploadZone } from "../../components/shared";
import { BUILD_TYPES, BUILD_PHASES, BUILD_PHASE_LABELS } from "../../data/buildTypes";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

const phaseColors = { pre_build: "var(--primary)", during_build: "var(--blue)", post_build: "var(--green)" };

export const SubcoExecutionHub = ({ assignment, onBack }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [activePhase, setActivePhase] = useState(assignment.phase || "pre_build");
  const [uploadedImages, setUploadedImages] = useState({ pre_build: [], during_build: [], post_build: [] });
  const [acceptState, setAcceptState] = useState(assignment.status !== "pending_acceptance");
  const [meetstaatFile, setMeetstaatFile] = useState([]);

  const buildType = BUILD_TYPES[assignment.buildType] || BUILD_TYPES.sdu_standard;
  const phaseConfig = buildType.phases[activePhase] || { requiredImages: 3, forms: [] };
  const isDisputed = assignment.status === "disputed";
  const isCompleted = assignment.status === "completed";

  const handleAccept = () => setAcceptState(true);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 4, ...mono(12, "var(--text-muted)") }}
        >
          <Icon n="chevR" size={16} color="var(--text-muted)" style={{ transform: "rotate(180deg)" }} />
          {isMobile && "Back"}
        </button>
        <div>
          <div style={disp(isMobile ? 20 : 24, 800)}>{assignment.address.street} {assignment.address.number}</div>
          <div style={mono(11, "var(--text-secondary)", { marginTop: 2 })}>
            {assignment.tsg_id} · {buildType.label} · {assignment.address.postal_code} {assignment.address.city}
          </div>
        </div>
      </div>

      {/* Dispute banner */}
      {isDisputed && <DisputeBanner dispute={assignment.dispute} />}

      {/* Pending acceptance */}
      {!acceptState && (
        <div style={{
          padding: 24, marginBottom: 20, textAlign: "center",
          background: "var(--bg-raised)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
        }}>
          <div style={disp(18, 700, undefined, { marginBottom: 8 })}>New Assignment</div>
          <div style={mono(12, "var(--text-secondary)", { marginBottom: 16 })}>
            Accept this package to begin build execution
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="toggle-btn green active" onClick={handleAccept} style={{ padding: "8px 20px" }}>
              Accept Package
            </button>
            <button className="toggle-btn primary" style={{ padding: "8px 20px" }}>
              Request Reassignment
            </button>
          </div>
        </div>
      )}

      {/* Phase navigation */}
      {acceptState && !isCompleted && (
        <>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 6, marginBottom: 20 }}>
            {BUILD_PHASES.map((phase, i) => {
              const phaseUploads = uploadedImages[phase]?.length || 0;
              const required = buildType.phases[phase]?.requiredImages || 0;
              const isDone = phaseUploads >= required && required > 0;
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: "var(--radius-md)",
                    border: activePhase === phase ? `2px solid ${phaseColors[phase]}` : "1px solid var(--border)",
                    background: activePhase === phase ? `${phaseColors[phase]}15` : "var(--bg-raised)",
                    cursor: isDisputed ? "default" : "pointer",
                    opacity: isDisputed && phase !== assignment.phase ? 0.4 : 1,
                    textAlign: "center",
                  }}
                  disabled={isDisputed && phase !== assignment.phase}
                >
                  <div style={mono(11, phaseColors[phase], { textTransform: "uppercase", letterSpacing: ".06em" })}>
                    Phase {i + 1}
                  </div>
                  <div style={disp(13, 700, undefined, { marginTop: 4 })}>
                    {BUILD_PHASE_LABELS[phase]}
                  </div>
                  <div style={mono(11, isDone ? "var(--text-green)" : "var(--text-muted)", { marginTop: 4 })}>
                    {phaseUploads} / {required} images
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upload area */}
          <div style={{ marginBottom: 20 }}>
            <FileUploadZone
              label={`${BUILD_PHASE_LABELS[activePhase]} — Upload Images (${phaseConfig.requiredImages} required)`}
              files={uploadedImages[activePhase]}
              onUpload={(fileList) => {
                const newFiles = Array.from(fileList).map(f => ({ name: f.name, size: f.size }));
                setUploadedImages(ui => ({
                  ...ui,
                  [activePhase]: [...ui[activePhase], ...newFiles],
                }));
              }}
              onDelete={(idx) => {
                setUploadedImages(ui => ({
                  ...ui,
                  [activePhase]: ui[activePhase].filter((_, i) => i !== idx),
                }));
              }}
              accept="image/*"
              maxFiles={phaseConfig.requiredImages * 2}
              disabled={isDisputed}
            />
          </div>

          {/* Dynamic forms for this phase */}
          {phaseConfig.forms.length > 0 && (
            <div style={{
              padding: 16, background: "var(--bg-raised)",
              border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", marginBottom: 20,
            }}>
              <div style={mono(11, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
                Required Forms
              </div>
              {phaseConfig.forms.map(form => (
                <div key={form} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <Icon n="file" size={14} color="var(--text-muted)" />
                  <span style={mono(11, "var(--text-secondary)", { textTransform: "capitalize" })}>
                    {form.replace(/_/g, " ")}
                  </span>
                  <button className="toggle-btn primary" style={{ marginLeft: "auto", padding: "3px 10px" }}>
                    Fill Form
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Progress summary */}
          <div style={{
            padding: "12px 16px", background: "var(--bg-raised)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3 }}>
                <div style={{
                  width: `${assignment.progress}%`, height: "100%", borderRadius: 3,
                  background: phaseColors[activePhase], transition: "width .3s ease",
                }} />
              </div>
            </div>
            <span style={mono(11, "var(--text-secondary)")}>{assignment.progress}% overall</span>
          </div>
        </>
      )}

      {/* Completed state — meetstaat upload */}
      {isCompleted && (
        <div>
          <div style={{
            padding: 16, marginBottom: 20, textAlign: "center",
            background: "var(--green-glow)", border: "1px solid var(--green-dim)",
            borderRadius: "var(--radius-lg)",
          }}>
            <Icon n="check" size={24} color="var(--green)" />
            <div style={disp(16, 700, "var(--text-green)", { marginTop: 8 })}>Build Completed</div>
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
            <button className="toggle-btn green active" style={{ marginTop: 16, padding: "8px 20px" }}>
              Submit Meetstaat
            </button>
          )}
        </div>
      )}
    </div>
  );
};
