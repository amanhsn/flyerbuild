"use client"

import { useState, useMemo, useRef, useEffect, useCallback, createRef } from "react";
import { useLang } from "../../i18n/LangContext";
import { getVisibleSections } from "../../data/sectionRegistry";
import { SurveyHeader } from "../survey/SurveyHeader";
import { SectionNav } from "../survey/SectionNav";
import { SurveySidebar } from "../survey/SurveySidebar";
import { SectionRenderer } from "../survey/SectionRenderer";
import { Icon } from "../../icons/Icon";

/**
 * ReadOnlySurveyView — renders the full survey in read-only mode.
 * Used by Validator, Subcontractor, and Admin portals.
 *
 * When `scrollable={true}`, all sections render vertically with IntersectionObserver.
 * When `collapsible={true}`, sections can be collapsed/expanded with validated styling.
 */
export const ReadOnlySurveyView = ({
  survey, onBack, actionBar, scrollable = false,
  collapsible = false, validatedSections = [],
}) => {
  const { t } = useLang();

  const visibleSections = useMemo(
    () => getVisibleSections(survey.status),
    [survey.status]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const completedCount = survey.completed_sections?.length || 0;

  // Collapsible state — validated sections start collapsed
  const [collapsedMap, setCollapsedMap] = useState(() => {
    if (!collapsible) return {};
    const map = {};
    visibleSections.forEach(sec => {
      map[sec.key] = validatedSections.includes(sec.key);
    });
    return map;
  });

  const toggleCollapse = useCallback((key) => {
    setCollapsedMap(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

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
      // Expand the section if collapsed
      const secKey = visibleSections[index]?.key;
      if (secKey && collapsedMap[secKey]) {
        setCollapsedMap(prev => ({ ...prev, [secKey]: false }));
      }
      sectionRefs.current[index]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setTimeout(() => { isScrollingRef.current = false; }, 800);
    }
  }, [scrollable, visibleSections, collapsedMap]);

  // Section progress indicator
  const validatedCount = visibleSections.filter(s => validatedSections.includes(s.key)).length;

  // --- Scrollable mode: all sections stacked ---
  if (scrollable) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <SurveyHeader survey={survey} completedCount={completedCount} onBack={onBack} />

        {/* Section progress bar for validator */}
        {collapsible && (
          <div className="flex items-center gap-3 px-6 py-2 bg-bg-elevated border-b border-border shrink-0">
            <div className="flex items-center gap-1.5">
              <Icon n="check" size={12} color="var(--dark-green)" />
              <span className="font-mono text-xs" style={{ color: "var(--dark-green)" }}>
                {validatedCount}/{visibleSections.length}
              </span>
              <span className="font-mono text-[10px] text-text-muted">sections validated</span>
            </div>
            <div className="flex-1 h-1.5 bg-bg-overlay rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(validatedCount / visibleSections.length) * 100}%`,
                  background: "var(--dark-green)",
                }}
              />
            </div>
            <div className="flex gap-1">
              {visibleSections.map(sec => (
                <div
                  key={sec.key}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: validatedSections.includes(sec.key) ? "var(--dark-green)" : "var(--amber)",
                  }}
                  title={t(`sec_${sec.key}`)}
                />
              ))}
            </div>
          </div>
        )}

        <SectionNav
          sections={visibleSections}
          activeIndex={activeIndex}
          completedSections={survey.completed_sections || []}
          onSelect={handleNavSelect}
          sticky
        />

        <div className="flex flex-1 overflow-hidden">
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 pt-4 pb-[160px]">
            {visibleSections.map((sec, i) => {
              const isValidated = validatedSections.includes(sec.key);
              const isCollapsed = collapsible && collapsedMap[sec.key];

              return (
                <div
                  key={sec.key}
                  ref={sectionRefs.current[i]}
                  data-section-key={sec.key}
                  className="mb-6"
                >
                  {/* Section header — collapsible */}
                  {collapsible ? (
                    <button
                      onClick={() => toggleCollapse(sec.key)}
                      className="w-full flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 mb-2 group"
                    >
                      <Icon
                        n="chevR"
                        size={12}
                        color="var(--text-muted)"
                        className={`transition-transform ${isCollapsed ? "" : "rotate-90"}`}
                      />
                      {isValidated && (
                        <Icon n="check" size={12} color="var(--dark-green)" />
                      )}
                      <span
                        className="font-mono text-[10px] uppercase tracking-widest"
                        style={{ color: isValidated ? "var(--dark-green)" : "var(--text-muted)" }}
                      >
                        {t(`sec_${sec.key}`)}
                      </span>
                      {isValidated && (
                        <span className="font-mono text-[9px] px-1.5 py-[1px] rounded-sm" style={{
                          background: "var(--dark-green-glow)",
                          color: "var(--dark-green)",
                          border: "1px solid var(--dark-green-dim)",
                        }}>
                          Validated
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">
                      {t(`sec_${sec.key}`)}
                    </div>
                  )}

                  {/* Section content — collapsible */}
                  {!isCollapsed && (
                    <div
                      className="rounded-lg overflow-hidden"
                      style={{
                        borderLeft: isValidated && collapsible ? "3px solid var(--dark-green)" : undefined,
                        paddingLeft: isValidated && collapsible ? 12 : undefined,
                      }}
                    >
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
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar — desktop only */}
          <div className="survey-sidebar-desktop flex relative">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="absolute -left-3 top-4 z-10 w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center cursor-pointer hover:bg-bg-overlay transition-colors"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Icon n={sidebarOpen ? "chevron-right" : "chevron-left"} size={12} color="var(--text-muted)" />
            </button>
            {sidebarOpen && (
              <SurveySidebar survey={survey} visibleSections={visibleSections} />
            )}
          </div>
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

      <div className="flex flex-1 overflow-hidden">
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
                Next Section
              </button>
            )}
          </div>
        </div>

        {/* Sidebar — desktop only */}
        <div className="survey-sidebar-desktop flex relative">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="absolute -left-3 top-4 z-10 w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center cursor-pointer hover:bg-bg-overlay transition-colors"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Icon n={sidebarOpen ? "chevron-right" : "chevron-left"} size={12} color="var(--text-muted)" />
          </button>
          {sidebarOpen && (
            <SurveySidebar survey={survey} visibleSections={visibleSections} />
          )}
        </div>
      </div>

      {actionBar}
    </div>
  );
};
