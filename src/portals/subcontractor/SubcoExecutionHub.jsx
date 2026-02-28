import { useState } from "react";
import { useLang } from "../../i18n/LangContext";
import { DisputeBanner, FileUploadZone } from "../../components/shared";
import { BUILD_TYPES, BUILD_PHASES, BUILD_PHASE_LABELS } from "../../data/buildTypes";
import { Icon } from "../../icons/Icon";
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
        <div>
          <div className={`font-display ${isMobile ? "text-xl" : "text-2xl"} font-extrabold tracking-wide`}>{assignment.address.street} {assignment.address.number}</div>
          <div className="font-mono text-xs text-text-secondary mt-0.5">
            {assignment.tsg_id} · {buildType.label} · {assignment.address.postal_code} {assignment.address.city}
          </div>
        </div>
      </div>

      {/* Dispute banner */}
      {isDisputed && <DisputeBanner dispute={assignment.dispute} />}

      {/* Pending acceptance */}
      {!acceptState && (
        <div className="text-center mb-5 bg-bg-raised border border-border rounded-lg" style={{
          padding: 24,
        }}>
          <div className="font-display text-lg font-bold tracking-wide mb-2">New Assignment</div>
          <div className="font-mono text-sm text-text-secondary mb-4">
            Accept this package to begin build execution
          </div>
          <div className="flex gap-2.5 justify-center flex-wrap">
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
          <div className="mb-5 gap-1.5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
            {BUILD_PHASES.map((phase, i) => {
              const phaseUploads = uploadedImages[phase]?.length || 0;
              const required = buildType.phases[phase]?.requiredImages || 0;
              const isDone = phaseUploads >= required && required > 0;
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className="text-center"
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: "var(--radius-md)",
                    border: activePhase === phase ? `2px solid ${phaseColors[phase]}` : "1px solid var(--border)",
                    background: activePhase === phase ? `${phaseColors[phase]}15` : "var(--bg-raised)",
                    cursor: isDisputed ? "default" : "pointer",
                    opacity: isDisputed && phase !== assignment.phase ? 0.4 : 1,
                  }}
                  disabled={isDisputed && phase !== assignment.phase}
                >
                  <div className="font-mono text-xs uppercase tracking-wider" style={{ color: phaseColors[phase] }}>
                    Phase {i + 1}
                  </div>
                  <div className="font-display text-[13px] font-bold tracking-wide mt-1">
                    {BUILD_PHASE_LABELS[phase]}
                  </div>
                  <div className={`font-mono text-xs ${isDone ? "text-text-green" : "text-text-muted"} mt-1`}>
                    {phaseUploads} / {required} images
                  </div>
                </button>
              );
            })}
          </div>

          {/* Upload area */}
          <div className="mb-5">
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
            <div className="bg-bg-raised border border-border rounded-lg mb-5" style={{
              padding: 16,
            }}>
              <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
                Required Forms
              </div>
              {phaseConfig.forms.map(form => (
                <div key={form} className="flex items-center gap-2 border-b border-border" style={{
                  padding: "8px 0",
                }}>
                  <Icon n="file" size={14} color="var(--text-muted)" />
                  <span className="font-mono text-xs text-text-secondary capitalize">
                    {form.replace(/_/g, " ")}
                  </span>
                  <button className="toggle-btn primary ml-auto" style={{ padding: "3px 10px" }}>
                    Fill Form
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Progress summary */}
          <div className="bg-bg-raised border border-border rounded-md flex items-center gap-3" style={{
            padding: "12px 16px",
          }}>
            <div className="flex-1">
              <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3 }}>
                <div style={{
                  width: `${assignment.progress}%`, height: "100%", borderRadius: 3,
                  background: phaseColors[activePhase], transition: "width .3s ease",
                }} />
              </div>
            </div>
            <span className="font-mono text-xs text-text-secondary">{assignment.progress}% overall</span>
          </div>
        </>
      )}

      {/* Completed state -- meetstaat upload */}
      {isCompleted && (
        <div>
          <div className="text-center mb-5 rounded-lg" style={{
            padding: 16,
            background: "var(--green-glow)", border: "1px solid var(--green-dim)",
          }}>
            <Icon n="check" size={24} color="var(--green)" />
            <div className="font-display text-base font-bold tracking-wide text-text-green mt-2">Build Completed</div>
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
