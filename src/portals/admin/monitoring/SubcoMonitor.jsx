import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { KpiCard } from "../../../components/shared";
import { EmptyState } from "../../../components/shared/EmptyState";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { SubcoBuildDetail } from "./SubcoBuildDetail";

// Expanded mock subcontractor build data
const MOCK_BUILDS = [
  {
    id: 1, tsg_id: "WERK-03", subco: "FiberCo BVBA",
    address: "Kerkstraat 12, 2000 Antwerpen",
    buildType: "sdu_standard", phase: "pre_build", progress: 30, status: "in_progress",
    assignedDate: "2026-01-15",
    dispute: null,
    images: {
      pre_build: [
        { name: "facade_front.jpg", uploadDate: "2026-01-18" },
        { name: "entry_point.jpg", uploadDate: "2026-01-18" },
      ],
      during_build: [],
      post_build: [],
    },
    formStatuses: {
      pre_build: {},
      during_build: { cable_routing: "pending" },
      post_build: {},
    },
  },
  {
    id: 2, tsg_id: "MEN-09", subco: "TelNet BV",
    address: "Stationsstraat 45, 3000 Leuven",
    buildType: "sdu_complex", phase: "during_build", progress: 65, status: "in_progress",
    assignedDate: "2026-01-08",
    dispute: null,
    images: {
      pre_build: [
        { name: "site_overview.jpg", uploadDate: "2026-01-10" },
        { name: "access_route.jpg", uploadDate: "2026-01-10" },
        { name: "basement_entry.jpg", uploadDate: "2026-01-11" },
        { name: "cable_path.jpg", uploadDate: "2026-01-11" },
        { name: "heritage_detail.jpg", uploadDate: "2026-01-12" },
      ],
      during_build: [
        { name: "routing_start.jpg", uploadDate: "2026-01-20" },
        { name: "conduit_install.jpg", uploadDate: "2026-01-21" },
        { name: "splice_point_1.jpg", uploadDate: "2026-01-22" },
      ],
      post_build: [],
    },
    formStatuses: {
      pre_build: { site_assessment: "completed" },
      during_build: { cable_routing: "completed", obstacle_report: "pending" },
      post_build: { completion_checklist: "pending" },
    },
  },
  {
    id: 3, tsg_id: "WERK-08", subco: "FiberCo BVBA",
    address: "Hoogstraat 78, 2018 Antwerpen",
    buildType: "mdu_small", phase: "post_build", progress: 90, status: "in_progress",
    assignedDate: "2025-12-20",
    dispute: null,
    images: {
      pre_build: [
        { name: "building_front.jpg", uploadDate: "2025-12-22" },
        { name: "riser_shaft.jpg", uploadDate: "2025-12-22" },
        { name: "meter_room.jpg", uploadDate: "2025-12-23" },
        { name: "roof_access.jpg", uploadDate: "2025-12-23" },
        { name: "basement_room.jpg", uploadDate: "2025-12-24" },
        { name: "parking_entry.jpg", uploadDate: "2025-12-24" },
      ],
      during_build: [
        { name: "floor1_install.jpg", uploadDate: "2026-01-05" },
        { name: "floor2_install.jpg", uploadDate: "2026-01-06" },
        { name: "floor3_install.jpg", uploadDate: "2026-01-07" },
        { name: "riser_cable.jpg", uploadDate: "2026-01-08" },
        { name: "splice_closures.jpg", uploadDate: "2026-01-09" },
        { name: "conduit_runs.jpg", uploadDate: "2026-01-10" },
        { name: "labeling.jpg", uploadDate: "2026-01-11" },
        { name: "test_setup.jpg", uploadDate: "2026-01-12" },
      ],
      post_build: [
        { name: "final_riser.jpg", uploadDate: "2026-02-01" },
        { name: "ont_install.jpg", uploadDate: "2026-02-01" },
        { name: "clean_site.jpg", uploadDate: "2026-02-02" },
        { name: "label_check.jpg", uploadDate: "2026-02-02" },
      ],
    },
    formStatuses: {
      pre_build: { site_assessment: "completed" },
      during_build: { cable_routing: "completed", riser_progress: "completed" },
      post_build: { completion_checklist: "completed" },
    },
  },
  {
    id: 4, tsg_id: "WERK-15", subco: "TelNet BV",
    address: "Marktplein 3, 9000 Gent",
    buildType: "sdu_standard", phase: "pre_build", progress: 10, status: "disputed",
    assignedDate: "2026-02-01",
    dispute: { comment: "Incorrect cable routing path documented", instructions: "Re-survey the entry point and submit corrected photos of the actual cable path." },
    images: {
      pre_build: [
        { name: "wrong_entry.jpg", uploadDate: "2026-02-05" },
      ],
      during_build: [],
      post_build: [],
    },
    formStatuses: {
      pre_build: {},
      during_build: { cable_routing: "pending" },
      post_build: {},
    },
  },
];

const phaseLabels = { pre_build: "Pre-Build", during_build: "During Build", post_build: "Post-Build" };
const phaseColors = { pre_build: "var(--primary)", during_build: "var(--blue)", post_build: "var(--green)" };

export const SubcoMonitor = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [selectedBuild, setSelectedBuild] = useState(null);

  const active = MOCK_BUILDS.filter(b => b.status === "in_progress").length;
  const disputed = MOCK_BUILDS.filter(b => b.status === "disputed").length;
  const selectedData = MOCK_BUILDS.find(b => b.id === selectedBuild);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Subcontractor Monitor</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Track build progress across all subcontractors
      </p>

      {/* KPIs -- visible on list view */}
      {(!isMobile || !selectedBuild) && (
        <div className="gap-3 mb-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          <KpiCard label="Active Builds" value={active} color="var(--blue)" />
          <KpiCard label="Disputed" value={disputed} color="var(--red)" />
          <KpiCard label="Total Builds" value={MOCK_BUILDS.length} color="var(--primary)" />
        </div>
      )}

      <div className="gap-5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* Left panel: Build cards list */}
        {(!isMobile || !selectedBuild) && (
          <div className="flex-1 flex flex-col gap-2.5">
            {MOCK_BUILDS.map(build => (
              <div
                key={build.id}
                onClick={() => setSelectedBuild(build.id)}
                className="cursor-pointer rounded-lg"
                style={{
                  padding: "14px 18px",
                  background: selectedBuild === build.id ? "var(--primary-glow)" : "var(--bg-raised)",
                  border: `1px solid ${
                    selectedBuild === build.id ? "var(--primary-dim)"
                    : build.status === "disputed" ? "var(--red-dim)"
                    : "var(--border)"
                  }`,
                }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="font-mono text-sm text-text-primary font-semibold">{build.tsg_id}</span>
                  <span className="font-mono text-xs text-text-muted">{build.subco}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className={`font-mono text-xs ${build.status === "disputed" ? "text-text-red" : ""}`} style={{
                      padding: "2px 8px", borderRadius: "var(--radius-sm)",
                      background: build.status === "disputed" ? "var(--red-glow)" : "var(--bg-overlay)",
                      border: `1px solid ${build.status === "disputed" ? "var(--red-dim)" : "var(--border)"}`,
                      color: build.status !== "disputed" ? phaseColors[build.phase] : undefined,
                    }}>
                      {build.status === "disputed" ? "DISPUTED" : phaseLabels[build.phase]}
                    </span>
                    <Icon n="chevR" size={12} color="var(--text-muted)" />
                  </div>
                </div>

                <div className="font-mono text-xs text-text-muted mb-2">
                  {build.address}
                </div>

                {/* Progress bar */}
                <div style={{ height: 6, background: "var(--bg-overlay)", borderRadius: 3 }}>
                  <div style={{
                    width: `${build.progress}%`, height: "100%", borderRadius: 3,
                    background: build.status === "disputed" ? "var(--red)" : phaseColors[build.phase],
                    transition: "width .3s ease",
                  }} />
                </div>
                <div className="font-mono text-xs text-text-muted text-right mt-1">
                  {build.progress}% complete
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right panel: Build detail */}
        {(!isMobile || selectedBuild) && (
          <div className="flex-1">
            {selectedData ? (
              <SubcoBuildDetail
                build={selectedData}
                onBack={() => setSelectedBuild(null)}
                isMobile={isMobile}
              />
            ) : (
              <EmptyState icon="building" message="Select a build to view details" sub="Choose from the list on the left" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
