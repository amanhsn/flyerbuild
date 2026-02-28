import { useState } from "react";
import { Field, TextArea, ToggleButton, Checkbox } from "../../shared";
import { useLang } from "../../../i18n/LangContext";
import { cn } from "../../../lib/utils";


export const BuildingOwner = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("owner");
  const owner = survey.building_owner || {};

  return (
    <div className="flex flex-col gap-5">
      {/* Owner Found Toggle */}
      <div>
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
          {t("ownerFound")}
        </div>
        <div className="flex gap-2">
          <ToggleButton
            label="Owner Found"
            variant="green"
            active={owner.ownerFound === true}
            onClick={() => setField("building_owner.ownerFound", true)}
            disabled={disabled}
          />
          <ToggleButton
            label="Not Found"
            variant="red"
            active={owner.ownerFound === false}
            onClick={() => setField("building_owner.ownerFound", false)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Sub-tabs: Owner Info / Syndic Info */}
      <div>
        <div className="flex gap-0 border-b-2 border-border mb-4">
          {[
            { key: "owner", label: t("ownerInfo") },
            { key: "syndic", label: t("syndicInfo") },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "font-mono text-xs uppercase tracking-widest py-2.5 px-5 bg-transparent border-none cursor-pointer -mb-0.5",
                activeTab === key ? "text-primary" : "text-text-muted"
              )}
              style={{
                borderBottom: activeTab === key ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Owner Info Tab */}
        {activeTab === "owner" && (
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-3">
              <Field
                label={t("ownerName")}
                value={owner.ownerName}
                onChange={(v) => setField("building_owner.ownerName", v)}
                disabled={disabled}
              />
              <Field
                label={t("ownerFunction")}
                value={owner.ownerFunction}
                onChange={(v) => setField("building_owner.ownerFunction", v)}
                disabled={disabled}
              />
            </div>
            <div className="flex gap-3">
              <Field
                label={t("ownerEmail")}
                value={owner.ownerEmail}
                onChange={(v) => setField("building_owner.ownerEmail", v)}
                disabled={disabled}
                type="email"
              />
              <Field
                label={t("ownerPhone")}
                value={owner.ownerPhone}
                onChange={(v) => setField("building_owner.ownerPhone", v)}
                disabled={disabled}
                type="tel"
              />
            </div>
            <Checkbox
              label={t("ownerPresent")}
              checked={!!owner.ownerPresent}
              onChange={() => setField("building_owner.ownerPresent", !owner.ownerPresent)}
              disabled={disabled}
            />
          </div>
        )}

        {/* Syndic Info Tab */}
        {activeTab === "syndic" && (
          <div className="flex flex-col gap-3.5">
            <div className="flex gap-3">
              <Field
                label={t("syndicName")}
                value={owner.syndicName}
                onChange={(v) => setField("building_owner.syndicName", v)}
                disabled={disabled}
              />
              <Field
                label={t("syndicManager")}
                value={owner.syndicManager}
                onChange={(v) => setField("building_owner.syndicManager", v)}
                disabled={disabled}
              />
            </div>
            <div className="flex gap-3">
              <Field
                label={t("syndicEmail")}
                value={owner.syndicEmail}
                onChange={(v) => setField("building_owner.syndicEmail", v)}
                disabled={disabled}
                type="email"
              />
              <Field
                label={t("syndicPhone")}
                value={owner.syndicPhone}
                onChange={(v) => setField("building_owner.syndicPhone", v)}
                disabled={disabled}
                type="tel"
              />
            </div>
            <Checkbox
              label={t("syndicPresent")}
              checked={!!owner.syndicPresent}
              onChange={() => setField("building_owner.syndicPresent", !owner.syndicPresent)}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* Common Address Fields */}
      <div className="border-t border-border pt-4 flex flex-col gap-3.5">
        <div className="font-mono text-xs text-text-muted uppercase tracking-widest">
          {t("address")}
        </div>
        <Field
          label={t("street")}
          value={owner.street}
          onChange={(v) => setField("building_owner.street", v)}
          disabled={disabled}
        />
        <div className="flex gap-3">
          <Field
            label={t("houseNumber")}
            value={owner.houseNumber}
            onChange={(v) => setField("building_owner.houseNumber", v)}
            disabled={disabled}
          />
          <Field
            label={t("boxNumber")}
            value={owner.boxNumber}
            onChange={(v) => setField("building_owner.boxNumber", v)}
            disabled={disabled}
          />
        </div>
        <div className="flex gap-3">
          <Field
            label={t("postalCode")}
            value={owner.postalCode}
            onChange={(v) => setField("building_owner.postalCode", v)}
            disabled={disabled}
          />
          <Field
            label={t("city")}
            value={owner.city}
            onChange={(v) => setField("building_owner.city", v)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Date Board Owners */}
      <Field
        label={t("dateBoardOwners")}
        type="date"
        value={owner.dateBoardOwners}
        onChange={(v) => setField("building_owner.dateBoardOwners", v)}
        disabled={disabled}
      />

      {/* Owner Remarks */}
      <TextArea
        label={t("ownerRemarks")}
        value={owner.ownerRemarks}
        onChange={(v) => setField("building_owner.ownerRemarks", v)}
        disabled={disabled}
        placeholder="Additional remarks about the owner..."
        rows={3}
      />
    </div>
  );
};
