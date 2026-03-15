"use client"

import { useState, useMemo, useCallback } from "react";
import { useLang } from "../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../data/mockSurveys";
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

  const currentIndex = selectedSurvey ? queueSurveys.findIndex(s => s.id === selectedSurvey.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setSelectedSurvey(queueSurveys[currentIndex - 1]);
  }, [currentIndex, queueSurveys]);

  const handleNext = useCallback(() => {
    if (currentIndex < queueSurveys.length - 1) setSelectedSurvey(queueSurveys[currentIndex + 1]);
  }, [currentIndex, queueSurveys]);

  if (selectedSurvey) {
    return (
      <ValidationWorkspace
        survey={selectedSurvey}
        onBack={() => setSelectedSurvey(null)}
        onPrev={currentIndex > 0 ? handlePrev : null}
        onNext={currentIndex < queueSurveys.length - 1 ? handleNext : null}
        prevAddress={currentIndex > 0 ? queueSurveys[currentIndex - 1]?.address : null}
        nextAddress={currentIndex < queueSurveys.length - 1 ? queueSurveys[currentIndex + 1]?.address : null}
        queuePosition={`${currentIndex + 1} of ${queueSurveys.length}`}
      />
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <ValidatorQueue
        surveys={queueSurveys}
        filter={filter}
        setFilter={setFilter}
        onSelectSurvey={setSelectedSurvey}
      />
    </div>
  );
};
