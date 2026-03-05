"use client"

import { useState, useMemo, useRef, useEffect, useCallback, createRef } from "react";
import { useLang } from "../../i18n/LangContext";
import { getVisibleSections } from "../../data/sectionRegistry";
import { SurveyHeader } from "../survey/SurveyHeader";
import { SectionNav } from "../survey/SectionNav";
import { SectionRenderer } from "../survey/SectionRenderer";

/**
 * ReadOnlySurveyView — renders the full survey in read-only mode.
 * Used by Validator, Subcontractor, and Admin portals.
 * Accepts optional `actionBar` to render approve/reject controls at bottom.
 *
 * When `scrollable={true}`, all sections render vertically with IntersectionObserver
 * tracking and sticky SectionNav. Used by ValidationWorkspace for faster review.
 */
export const ReadOnlySurveyView = ({ survey, onBack, actionBar, scrollable = false }) => {
  const { t } = useLang();

  const visibleSections = useMemo(
    () => getVisibleSections(survey.status),
    [survey.status]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const completedCount = survey.completed_sections?.length || 0;

  const noop = () => {};
  const noopBool = () => false;

  // Refs for scrollable mode
  const sectionRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Ensure refs array matches sections
  if (sectionRefs.current.length !== visibleSections.length) {
    sectionRefs.current = visibleSections.map((_, i) => sectionRefs.current[i] || createRef());
  }

  // IntersectionObserver for scrollable mode
  useEffect(() => {
    if (!scrollable) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.findIndex(r => r.current === entry.target);
            if (idx !== -1) {
              setActiveIndex(idx);
              break;
            }
          }
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      }
    );

    sectionRefs.current.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [scrollable, visibleSections]);

  // Handle nav tab click in scrollable mode
  const handleNavSelect = useCallback((index) => {
    setActiveIndex(index);
    if (scrollable) {
      isScrollingRef.current = true;
      sectionRefs.current[index]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Re-enable observer after scroll animation
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    }
  }, [scrollable]);

  // --- Scrollable mode: all sections stacked ---
  if (scrollable) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <SurveyHeader survey={survey} completedCount={completedCount} onBack={onBack} />

        <SectionNav
          sections={visibleSections}
          activeIndex={activeIndex}
          completedSections={survey.completed_sections || []}
          onSelect={handleNavSelect}
          sticky
        />

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 pt-4 pb-[160px]">
          {visibleSections.map((sec, i) => (
            <div
              key={sec.key}
              ref={sectionRefs.current[i]}
              data-section-key={sec.key}
              className="mb-6"
            >
              <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
                {t(`sec_${sec.key}`)}
              </div>
              <SectionRenderer
                section={sec}
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
            </div>
          ))}
        </div>

        {actionBar}
      </div>
    );
  }

  // --- Default mode: one section at a time ---
  const currentSection = visibleSections[activeIndex] || visibleSections[0];

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
