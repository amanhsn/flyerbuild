import { Field } from "../../shared";
import { useLang } from "../../../i18n/LangContext";
import { mono } from "../../../styles/helpers";

export const ClientInfo = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const client = survey.client || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Field
          label={t("clientName")}
          value={client.company}
          onChange={(v) => setField("client.company", v)}
          disabled={disabled}
        />
        <Field
          label={t("contractor")}
          value={client.contractor}
          onChange={(v) => setField("client.contractor", v)}
          disabled={disabled}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <Field
          label={t("contactEmail")}
          value={client.contact_email}
          onChange={(v) => setField("client.contact_email", v)}
          disabled={disabled}
          type="email"
        />
        <Field
          label={t("contactPhone")}
          value={client.contact_phone}
          onChange={(v) => setField("client.contact_phone", v)}
          disabled={disabled}
          type="tel"
        />
      </div>

      <Field
        label={t("contactAddress")}
        value={client.contact_address}
        disabled
        placeholder="Address auto-populated from project data"
      />

      <Field
        label={t("contactName")}
        value={client.contact_name}
        onChange={(v) => setField("client.contact_name", v)}
        disabled={disabled}
      />
    </div>
  );
};
