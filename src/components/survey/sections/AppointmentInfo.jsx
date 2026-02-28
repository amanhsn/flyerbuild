import { useState } from "react";
import { Field, TextArea } from "../../shared";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";


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
    <div className="flex flex-col gap-5">
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
        className="toggle-btn primary active self-start flex items-center gap-1.5"
        onClick={handleAddAppointment}
        disabled={disabled}
      >
        <Icon n="plus" size={14} color="#fff" />
        <span>{t("addAppointment")}</span>
      </button>

      {/* Current Appointment */}
      {appointment && (
        <div className="bg-bg-raised border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-sm font-semibold tracking-wide text-text-primary">
              {t("currentAppointment")}
            </div>
            {deleteAppointment && !disabled && (
              <button
                className="toggle-btn red flex items-center gap-[5px] py-1 px-2.5"
                onClick={deleteAppointment}
              >
                <Icon n="trash" size={12} color="var(--red)" />
                <span className="font-mono text-xs text-red">{t("delete")}</span>
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-1">
                  Surveyor
                </div>
                <div className="font-mono text-sm text-text-secondary">
                  {appointment.surveyor_name || "Jonas Jacobs"}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-1">
                  Date
                </div>
                <div className="font-mono text-sm text-text-secondary">
                  {appointment.date || "--"}
                </div>
              </div>
            </div>
            {appointment.remark && (
              <div>
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-1">
                  Remark
                </div>
                <div className="font-mono text-sm text-text-secondary">
                  {appointment.remark}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!appointment && (
        <div className="font-mono text-xs text-text-muted text-center p-5 bg-bg-raised rounded-lg border border-border">
          {t("noAppointment")}
        </div>
      )}
    </div>
  );
};
