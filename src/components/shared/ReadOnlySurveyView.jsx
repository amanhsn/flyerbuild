import { useState, useMemo } from "react";
import { useLang } from "../../i18n/LangContext";
import { getVisibleSections } from "../../data/sectionRegistry";
import { SurveyHeader } from "../survey/SurveyHeader";
import { SectionNav } from "../survey/SectionNav";
import { SectionRenderer } from "../survey/SectionRenderer";

/**
 * ReadOnlySurveyView — renders the full survey in read-only mode.
 * Used by Validator, Subcontractor, and Admin portals.
 * Accepts optional `actionBar` to render approve/reject controls at bottom.
 */
export const ReadOnlySurveyView = ({ survey, onBack, actionBar }) => {
  const { t } = useLang();

  const visibleSections = useMemo(
    () => getVisibleSections(survey.status),
    [survey.status]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const currentSection = visibleSections[activeIndex] || visibleSections[0];
  const completedCount = survey.completed_sections?.length || 0;

  const noop = () => {};
  const noopBool = () => false;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <SurveyHeader survey={survey} completedCount={completedCount} onBack={onBack} />

      <SectionNav
        sections={visibleSections}
        activeIndex={activeIndex}
        completedSections={survey.completed_sections || []}
        onSelect={setActiveIndex}
      />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-[100px]">
        {currentSection && (
          <SectionRenderer
            section={currentSection}
            survey={survey}
            setField={noop}
            completeSection={noop}
            setEditing={noop}
            addVisit={noop}
            deleteVisit={noop}
            addAppointment={noop}
            deleteAppointment={noop}
            isSaveDisabled={true}
            isSectionCompleted={() => true}
            isSectionEditing={noopBool}
          />
        )}

        {/* Navigation */}
        <div className="flex gap-2.5 mt-4 justify-center">
          {activeIndex > 0 && (
            <button
              className="px-4 py-3 bg-bg-elevated border border-border rounded-md font-display text-base font-semibold text-text-secondary cursor-pointer transition-all"
              onClick={() => setActiveIndex(i => i - 1)}
            >
              {t("previous")}
            </button>
          )}
          {activeIndex < visibleSections.length - 1 && (
            <button
              className="px-4 py-3 bg-bg-elevated border border-border rounded-md font-display text-base font-semibold text-text-secondary cursor-pointer transition-all"
              onClick={() => setActiveIndex(i => i + 1)}
            >
              Next Section →
            </button>
          )}
        </div>
      </div>

      {actionBar}
    </div>
  );
};
