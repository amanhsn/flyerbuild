import { useLang } from "../../../i18n/LangContext";
import { KpiCard } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";

// Mock subcontractor build data
const MOCK_BUILDS = [
  { id: 1, tsg_id: "WERK-03", subco: "FiberCo BVBA", phase: "pre_build", progress: 30, status: "in_progress" },
  { id: 2, tsg_id: "MEN-09", subco: "TelNet BV", phase: "during_build", progress: 65, status: "in_progress" },
  { id: 3, tsg_id: "WERK-08", subco: "FiberCo BVBA", phase: "post_build", progress: 90, status: "in_progress" },
  { id: 4, tsg_id: "WERK-15", subco: "TelNet BV", phase: "pre_build", progress: 10, status: "disputed" },
];

const phaseLabels = { pre_build: "Pre-Build", during_build: "During Build", post_build: "Post-Build" };
const phaseColors = { pre_build: "var(--primary)", during_build: "var(--blue)", post_build: "var(--green)" };

export const SubcoMonitor = () => {
  const { t } = useLang();

  const active = MOCK_BUILDS.filter(b => b.status === "in_progress").length;
  const disputed = MOCK_BUILDS.filter(b => b.status === "disputed").length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
      <h1 style={disp(28, 800)}>Subcontractor Monitor</h1>
      <p style={mono(12, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Track build progress across all subcontractors
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        <KpiCard label="Active Builds" value={active} color="var(--blue)" />
        <KpiCard label="Disputed" value={disputed} color="var(--red)" />
        <KpiCard label="Total Builds" value={MOCK_BUILDS.length} color="var(--primary)" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MOCK_BUILDS.map(build => (
          <div key={build.id} style={{
            padding: "14px 18px", background: "var(--bg-raised)",
            border: `1px solid ${build.status === "disputed" ? "var(--red-dim)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={mono(12, "var(--text-primary)", { fontWeight: 600 })}>{build.tsg_id}</span>
              <span style={mono(11, "var(--text-muted)")}>{build.subco}</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  ...mono(11, build.status === "disputed" ? "var(--text-red)" : phaseColors[build.phase]),
                  padding: "2px 8px", borderRadius: "var(--radius-sm)",
                  background: build.status === "disputed" ? "var(--red-glow)" : "var(--bg-overlay)",
                  border: `1px solid ${build.status === "disputed" ? "var(--red-dim)" : "var(--border)"}`,
                }}>
                  {build.status === "disputed" ? "DISPUTED" : phaseLabels[build.phase]}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3 }}>
              <div style={{
                width: `${build.progress}%`, height: "100%", borderRadius: 3,
                background: build.status === "disputed" ? "var(--red)" : phaseColors[build.phase],
                transition: "width .3s ease",
              }} />
            </div>
            <div style={mono(11, "var(--text-muted)", { marginTop: 4, textAlign: "right" })}>
              {build.progress}% complete
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
