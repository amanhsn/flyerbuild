import { useState } from "react";
import { Field, TextArea, ToggleButton } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";

export const VisitInfo = ({ survey, setField, disabled, addVisit, deleteVisit }) => {
  const { t } = useLang();
  const [entryStatus, setEntryStatus] = useState("ok");
  const [remark, setRemark] = useState("");

  const visits = survey.visits || [];

  const handleAddVisit = () => {
    if (addVisit) {
      addVisit(entryStatus, remark);
      setRemark("");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Entry Status */}
      <div>
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
          {t("entryStatus")}
        </div>
        <div className="flex gap-2">
          <ToggleButton
            label="Entry OK"
            variant="green"
            active={entryStatus === "ok"}
            onClick={() => setEntryStatus("ok")}
            disabled={disabled}
          />
          <ToggleButton
            label="No Entry"
            variant="red"
            active={entryStatus === "no_entry"}
            onClick={() => setEntryStatus("no_entry")}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Visit Remark */}
      <TextArea
        label={t("visitRemark")}
        value={remark}
        onChange={setRemark}
        disabled={disabled}
        placeholder="Add a remark for this visit..."
        rows={3}
      />

      {/* Add Visit Button */}
      <button
        className="toggle-btn primary active self-start flex items-center gap-1.5"
        onClick={handleAddVisit}
        disabled={disabled}
      >
        <Icon n="plus" size={14} color="#fff" />
        <span>{t("addVisit")}</span>
      </button>

      {/* Visit History Table */}
      {visits.length > 0 && (
        <div>
          <div className="font-display text-sm font-semibold tracking-wide text-text-primary mb-2.5">
            {t("visitHistory")}
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div
              className="bg-bg-overlay py-2.5 px-3.5 border-b border-border"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 100px 1.5fr 50px",
              }}
            >
              {["Date", "Surveyor", "Status", "Remark", ""].map((col) => (
                <div key={col} className="font-mono text-xs text-text-muted uppercase tracking-widest">
                  {col}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {visits.map((visit, idx) => (
              <div
                key={idx}
                className="py-2.5 px-3.5 bg-bg-raised items-center"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 100px 1.5fr 50px",
                  borderBottom: idx < visits.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div className="font-mono text-xs text-text-secondary">
                  {visit.timestamp ? new Date(visit.timestamp).toLocaleDateString() : "--"}
                </div>
                <div className="font-mono text-xs text-text-secondary">
                  {visit.surveyor || "--"}
                </div>
                <div>
                  <span
                    className={`font-mono text-xs ${visit.entry_status === "ok" ? "text-green" : "text-red"}`}
                    style={{
                      padding: "2px 8px",
                      borderRadius: "var(--radius-sm)",
                      background: visit.entry_status === "ok"
                        ? "rgba(var(--green-rgb, 76,175,80), 0.15)"
                        : "rgba(var(--red-rgb, 244,67,54), 0.15)",
                    }}
                  >
                    {visit.entry_status === "ok" ? "OK" : "No Entry"}
                  </span>
                </div>
                <div className="font-mono text-xs text-text-muted">
                  {visit.visit_remark || "--"}
                </div>
                <div className="flex justify-center">
                  <button
                    className="toggle-btn py-1 px-1.5 bg-transparent border border-border rounded-sm"
                    onClick={() => deleteVisit && deleteVisit(idx)}
                    disabled={disabled}
                    style={{
                      cursor: disabled ? "default" : "pointer",
                    }}
                  >
                    <Icon n="trash" size={14} color="var(--red)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {visits.length === 0 && (
        <div className="font-mono text-xs text-text-muted text-center p-5 bg-bg-raised rounded-lg border border-border">
          {t("noVisits")}
        </div>
      )}
    </div>
  );
};
