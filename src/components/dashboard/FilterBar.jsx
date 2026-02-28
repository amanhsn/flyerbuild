import { useLang } from "../../i18n/LangContext";

export const FilterBar = ({ filter, setFilter }) => {
  const { t } = useLang();

  const filters = [
    ["all",      t("filterAll")],
    ["active",   t("filterActive")],
    ["pending",  t("filterPending")],
    ["review",   t("filterReview")],
    ["done",     t("filterDone")],
    ["issues",   t("filterIssues")],
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto shrink-0 pb-1">
      {filters.map(([v, l]) => (
        <button
          key={v}
          className={`filter-btn${filter === v ? " active" : ""}`}
          onClick={() => setFilter(v)}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
