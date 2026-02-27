import { useState, useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
import { KpiCard, StatusBadge, ReadOnlySurveyView } from "../../components/shared";
import { Icon } from "../../icons/Icon";
import { disp, mono } from "../../styles/helpers";
import { ValidatorQueue } from "./ValidatorQueue";
import { ValidationWorkspace } from "./ValidationWorkspace";

export const ValidatorPortalRoot = () => {
  const { t } = useLang();
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [filter, setFilter] = useState("all");

  const surveys = MOCK_SURVEYS;
  const queueSurveys = useMemo(() =>
    surveys.filter(s => ["validation_f49", "validation_client", "completed", "sent", "rework", "rejected"].includes(s.status)),
    [surveys]
  );

  if (selectedSurvey) {
    return (
      <ValidationWorkspace
        survey={selectedSurvey}
        onBack={() => setSelectedSurvey(null)}
      />
    );
  }

  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <ValidatorQueue
        surveys={queueSurveys}
        filter={filter}
        setFilter={setFilter}
        onSelectSurvey={setSelectedSurvey}
      />
    </div>
  );
};
