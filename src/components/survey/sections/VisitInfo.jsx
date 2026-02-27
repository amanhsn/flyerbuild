import { useState } from "react";
import { Field, TextArea, ToggleButton } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Entry Status */}
      <div>
        <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 })}>
          {t("entryStatus")}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
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
        className="toggle-btn primary active"
        onClick={handleAddVisit}
        disabled={disabled}
        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
      >
        <Icon n="plus" size={14} color="#fff" />
        <span>{t("addVisit")}</span>
      </button>

      {/* Visit History Table */}
      {visits.length > 0 && (
        <div>
          <div style={disp(14, 600, "var(--text-primary)", { marginBottom: 10 })}>
            {t("visitHistory")}
          </div>
          <div style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}>
            {/* Table Header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 100px 1.5fr 50px",
              gap: 0,
              background: "var(--bg-overlay)",
              padding: "10px 14px",
              borderBottom: "1px solid var(--border)",
            }}>
              {["Date", "Surveyor", "Status", "Remark", ""].map((col) => (
                <div key={col} style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em" })}>
                  {col}
                </div>
              ))}
            </div>

            {/* Table Rows */}
            {visits.map((visit, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 100px 1.5fr 50px",
                  gap: 0,
                  padding: "10px 14px",
                  borderBottom: idx < visits.length - 1 ? "1px solid var(--border)" : "none",
                  background: "var(--bg-raised)",
                  alignItems: "center",
                }}
              >
                <div style={mono(12, "var(--text-secondary)")}>
                  {visit.timestamp ? new Date(visit.timestamp).toLocaleDateString() : "--"}
                </div>
                <div style={mono(12, "var(--text-secondary)")}>
                  {visit.surveyor || "--"}
                </div>
                <div>
                  <span style={{
                    ...mono(12, visit.entry_status === "ok" ? "var(--green)" : "var(--red)"),
                    padding: "2px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: visit.entry_status === "ok"
                      ? "rgba(var(--green-rgb, 76,175,80), 0.15)"
                      : "rgba(var(--red-rgb, 244,67,54), 0.15)",
                  }}>
                    {visit.entry_status === "ok" ? "OK" : "No Entry"}
                  </span>
                </div>
                <div style={mono(12, "var(--text-muted)")}>
                  {visit.visit_remark || "--"}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    className="toggle-btn"
                    onClick={() => deleteVisit && deleteVisit(idx)}
                    disabled={disabled}
                    style={{
                      padding: "4px 6px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
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
        <div style={{
          ...mono(12, "var(--text-muted)"),
          padding: 20,
          textAlign: "center",
          background: "var(--bg-raised)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
        }}>
          {t("noVisits")}
        </div>
      )}
    </div>
  );
};
