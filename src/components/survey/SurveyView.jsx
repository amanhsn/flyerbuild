import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLang } from "../../i18n/LangContext";
import { useSurveyForm } from "../../hooks/useSurveyForm";
import { getVisibleSections, getMissingSectionFields } from "../../data/sectionRegistry";
import { SurveyHeader } from "./SurveyHeader";
import { SectionNav } from "./SectionNav";
import { SurveySidebar } from "./SurveySidebar";
import { SectionRenderer } from "./SectionRenderer";
import { Icon } from "../../icons/Icon";
import { cn } from "../../lib/utils";

export const SurveyView = ({ initialSurvey, onBack }) => {
  const { t } = useLang();
  const {
    survey, setField, completeSection, saveSection,
    setEditing, addVisit, deleteVisit, addAppointment, deleteAppointment,
    isSaveDisabled, isSectionCompleted, isSectionEditing,
  } = useSurveyForm(initialSurvey);

  const visibleSections = useMemo(
    () => getVisibleSections(survey.status),
    [survey.status]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [mduBannerDismissed, setMduBannerDismissed] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(null); // null | "saving" | "saved"
  const autoSaveTimer = useRef(null);

  // Debounced autosave — triggers 3s after last field change
  const wrappedSetField = useCallback((path, value) => {
    setField(path, value);
    setAutoSaveStatus("saving");
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus(null), 2000);
    }, 3000);
  }, [setField]);

  useEffect(() => {
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, []);
  const currentSection = visibleSections[activeIndex] || visibleSections[0];
  const completedCount = survey.completed_sections.length;

  const missingFields = currentSection
    ? getMissingSectionFields(survey, currentSection.key)
    : [];
  const hasRequiredMissing = missingFields.length > 0;

  const handleSaveAndContinue = () => {
    if (currentSection && !hasRequiredMissing) {
      saveSection(currentSection.key);
      if (activeIndex < visibleSections.length - 1) {
        setTimeout(() => setActiveIndex(i => i + 1), 200);
      }
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) setActiveIndex(i => i - 1);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <SurveyHeader survey={survey} completedCount={completedCount} onBack={onBack} />

      {/* MDU Group Warning Banner */}
      {survey.mdu_group && !survey.mdu_group.is_main && !mduBannerDismissed && (
        <div className="flex items-center gap-2.5 py-2.5 px-4 mx-4 mb-1 bg-primary-glow border border-primary-dim rounded-md">
          <Icon n="alert" size={16} color="var(--primary)" />
          <div className="font-mono text-xs text-text-primary-accent flex-1">
            {t("buildingWarning")} — {t("buildingWarnSub")(survey.mdu_group.linked_surveys?.[0]?.tsg_id || "main building")}
          </div>
          <button
            onClick={() => setMduBannerDismissed(true)}
            className="bg-transparent border-none cursor-pointer p-1"
          >
            <Icon n="x" size={14} color="var(--text-primary-accent)" />
          </button>
        </div>
      )}

      {/* Section tabs */}
      <SectionNav
        sections={visibleSections}
        activeIndex={activeIndex}
        completedSections={survey.completed_sections}
        onSelect={setActiveIndex}
      />

      {/* Body: form + sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form area */}
        <div className="flex-1 overflow-y-auto relative pt-4 px-6 pb-[100px]">
          {currentSection && (
            <SectionRenderer
              section={currentSection}
              survey={survey}
              setField={wrappedSetField}
              completeSection={completeSection}
              setEditing={setEditing}
              addVisit={addVisit}
              deleteVisit={deleteVisit}
              addAppointment={addAppointment}
              deleteAppointment={deleteAppointment}
              isSaveDisabled={isSaveDisabled}
              isSectionCompleted={isSectionCompleted}
              isSectionEditing={isSectionEditing}
            />
          )}

          {/* Autosave indicator */}
          {autoSaveStatus && (
            <div
              className={cn(
                "fixed top-[60px] right-4 z-[100] rounded-sm px-2.5 py-1 font-mono text-xs",
                autoSaveStatus === "saving"
                  ? "text-text-primary-accent"
                  : "text-text-green"
              )}
              style={{
                background: autoSaveStatus === "saving" ? "var(--primary-glow)" : "var(--green-glow)",
                border: `1px solid ${autoSaveStatus === "saving" ? "var(--primary-dim)" : "var(--green-dim)"}`,
              }}
            >
              {autoSaveStatus === "saving" ? "Saving..." : "Saved"}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="fixed bottom-0 left-0 right-0 flex gap-2.5 pointer-events-none" style={{
            padding: "10px 24px 16px",
            background: "linear-gradient(180deg,transparent 0%,var(--bg-base) 45%)",
          }}>
            <div className="flex gap-2.5 ml-auto pointer-events-auto max-w-[500px]">
              {activeIndex > 0 && (
                <button className="cta-btn secondary" onClick={handlePrevious}>
                  {t("previous")}
                </button>
              )}
              <button
                className={`cta-btn ${isSectionCompleted(currentSection?.key) ? "done-state" : "primary"}`}
                onClick={handleSaveAndContinue}
                disabled={isSaveDisabled || hasRequiredMissing}
                title={hasRequiredMissing ? `Missing required fields: ${missingFields.length}` : ""}
              >
                {isSectionCompleted(currentSection?.key)
                  ? t("alreadyDone")
                  : activeIndex === visibleSections.length - 1
                    ? t("submit")
                    : t("saveAndContinue")}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="survey-sidebar-desktop flex">
          <SurveySidebar survey={survey} visibleSections={visibleSections} />
        </div>
      </div>
    </div>
  );
};
