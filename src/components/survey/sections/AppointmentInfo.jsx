import { useState } from "react";
import { Field, TextArea } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { mono, disp } from "../../../styles/helpers";

export const AppointmentInfo = ({ survey, setField, disabled, addAppointment, deleteAppointment }) => {
  const { t } = useLang();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [remark, setRemark] = useState("");

  const appointment = survey.appointment;

  const handleAddAppointment = () => {
    if (addAppointment) {
      addAppointment("Jonas Jacobs", appointmentDate, remark);
      setAppointmentDate("");
      setRemark("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Surveyor Name (readonly) */}
      <Field
        label={t("surveyorName")}
        value="Jonas Jacobs"
        disabled
      />

      {/* Appointment Date */}
      <Field
        label={t("appointmentDate")}
        type="datetime-local"
        value={appointmentDate}
        onChange={setAppointmentDate}
        disabled={disabled}
      />

      {/* Remark */}
      <TextArea
        label={t("remark")}
        value={remark}
        onChange={setRemark}
        disabled={disabled}
        placeholder="Add a remark..."
        rows={3}
      />

      {/* Add Appointment Button */}
      <button
        className="toggle-btn primary active"
        onClick={handleAddAppointment}
        disabled={disabled}
        style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6 }}
      >
        <Icon n="plus" size={14} color="#fff" />
        <span>{t("addAppointment")}</span>
      </button>

      {/* Current Appointment */}
      {appointment && (
        <div style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={disp(14, 600, "var(--text-primary)")}>
              {t("currentAppointment")}
            </div>
            {deleteAppointment && !disabled && (
              <button
                className="toggle-btn red"
                onClick={deleteAppointment}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px" }}
              >
                <Icon n="trash" size={12} color="var(--red)" />
                <span style={mono(12, "var(--red)")}>{t("delete")}</span>
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 })}>
                  Surveyor
                </div>
                <div style={mono(14, "var(--text-secondary)")}>
                  {appointment.surveyor_name || "Jonas Jacobs"}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 })}>
                  Date
                </div>
                <div style={mono(14, "var(--text-secondary)")}>
                  {appointment.date || "--"}
                </div>
              </div>
            </div>
            {appointment.remark && (
              <div>
                <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 })}>
                  Remark
                </div>
                <div style={mono(14, "var(--text-secondary)")}>
                  {appointment.remark}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!appointment && (
        <div style={{
          ...mono(12, "var(--text-muted)"),
          padding: 20,
          textAlign: "center",
          background: "var(--bg-raised)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
        }}>
          {t("noAppointment")}
        </div>
      )}
    </div>
  );
};
