import { useState, useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { KpiCard, StatusBadge, DisputeBanner } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
import { SubcoAssignmentList } from "./SubcoAssignmentList";
import { SubcoExecutionHub } from "./SubcoExecutionHub";

// Mock assignment data (subcontractor sees assigned builds)
const MOCK_ASSIGNMENTS = [
  { id: 1, tsg_id: "WERK-03", status: "accepted", phase: "pre_build", progress: 30, buildType: "sdu_standard",
    address: { street: "Geluwesesteenweg", number: "158", postal_code: "8940", city: "Wervik" },
    dispute: null },
  { id: 2, tsg_id: "MEN-09", status: "in_progress", phase: "during_build", progress: 65, buildType: "mdu_small",
    address: { street: "Rijselstraat", number: "89", postal_code: "8930", city: "Menen" },
    dispute: null },
  { id: 3, tsg_id: "WERK-08", status: "in_progress", phase: "post_build", progress: 90, buildType: "sdu_standard",
    address: { street: "Tuinwijk", number: "3", postal_code: "8940", city: "Wervik" },
    dispute: null },
  { id: 4, tsg_id: "WERK-15", status: "disputed", phase: "pre_build", progress: 10, buildType: "sdu_complex",
    address: { street: "Molenstraat", number: "23", postal_code: "8940", city: "Wervik" },
    dispute: {
      comment: "Pre-build photos do not match site assessment.",
      instructions: "Re-upload pre-build photos showing cable entry point and route.",
    }},
  { id: 5, tsg_id: "MEN-02", status: "pending_acceptance", phase: null, progress: 0, buildType: "mdu_small",
    address: { street: "Leiestraat", number: "12B", postal_code: "8930", city: "Menen" },
    dispute: null },
  { id: 6, tsg_id: "MEN-04", status: "completed", phase: "post_build", progress: 100, buildType: "mdu_small",
    address: { street: "Brugstraat", number: "7A", postal_code: "8930", city: "Menen" },
    dispute: null },
];

export const SubcoPortalRoot = () => {
  const { t } = useLang();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filter, setFilter] = useState("all");

  if (selectedAssignment) {
    return (
      <SubcoExecutionHub
        assignment={selectedAssignment}
        onBack={() => setSelectedAssignment(null)}
      />
    );
  }

  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <SubcoAssignmentList
        assignments={MOCK_ASSIGNMENTS}
        filter={filter}
        setFilter={setFilter}
        onSelect={setSelectedAssignment}
      />
    </div>
  );
};
