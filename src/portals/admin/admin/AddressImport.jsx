import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { FileUploadZone } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";

export const AddressImport = () => {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("import");
  const [importedFiles, setImportedFiles] = useState([]);

  const tabs = [
    { id: "import", label: "CSV Import", icon: "upload" },
    { id: "grouping", label: "Building Grouping", icon: "building" },
    { id: "rbac", label: "RBAC Config", icon: "shield" },
    { id: "triggers", label: "Workflow Triggers", icon: "zap" },
  ];

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: "24px 28px" }}>
      <h1 className="font-display text-[28px] font-extrabold tracking-wide">Admin Tools</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-5">
        System configuration and bulk operations
      </p>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`filter-btn${activeTab === tab.id ? " active" : ""} flex items-center`}
            onClick={() => setActiveTab(tab.id)}
            style={{ gap: 5 }}
          >
            <Icon n={tab.icon} size={12} color={activeTab === tab.id ? "#000" : "var(--text-muted)"} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "import" && (
        <div style={{ maxWidth: 600 }}>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
            Bulk Address Import
          </div>
          <p className="font-mono text-xs text-text-secondary mb-4">
            Upload a CSV file with columns: street, number, bus, postal_code, city, lat, lng, assigned_surveyor
          </p>
          <FileUploadZone
            files={importedFiles}
            onUpload={(fileList) => {
              setImportedFiles(Array.from(fileList).map(f => ({ name: f.name, size: f.size })));
            }}
            onDelete={(idx) => setImportedFiles(f => f.filter((_, i) => i !== idx))}
            accept=".csv,.xlsx"
            maxFiles={1}
            label="CSV File"
          />
          {importedFiles.length > 0 && (
            <button className="toggle-btn green active mt-4" style={{ padding: "8px 20px" }}>
              Process Import
            </button>
          )}
        </div>
      )}

      {activeTab === "grouping" && (
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
            Building Grouping / Splitting
          </div>
          <p className="font-mono text-xs text-text-secondary mb-4">
            Group MDU buildings that share a basement or split grouped buildings into separate surveys. Use A/B suffixes for split buildings.
          </p>
          <div className="text-center bg-bg-raised border border-border rounded-lg" style={{
            padding: 24,
          }}>
            <Icon n="building" size={32} color="var(--text-muted)" />
            <div className="font-mono text-sm text-text-muted mt-2">
              Select buildings from the map view to group or split them
            </div>
          </div>
        </div>
      )}

      {activeTab === "rbac" && (
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
            Role-Based Access Control
          </div>
          <div className="flex flex-col gap-2.5">
            {["surveyor", "validator", "admin", "subcontractor"].map(role => (
              <div key={role} className="bg-bg-raised border border-border rounded-md flex items-center gap-3" style={{
                padding: "14px 18px",
              }}>
                <Icon n="user" size={16} color="var(--primary)" />
                <div className="flex-1">
                  <div className="font-mono text-sm text-text-primary font-semibold capitalize">
                    {role}
                  </div>
                  <div className="font-mono text-xs text-text-muted">
                    Configure permissions and access levels
                  </div>
                </div>
                <button className="toggle-btn primary" style={{ padding: "4px 12px" }}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "triggers" && (
        <div>
          <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-3">
            Workflow Triggers
          </div>
          <p className="font-mono text-xs text-text-secondary mb-4">
            Configure automated actions triggered by status changes.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { trigger: "Survey Completed", action: "Send notification to validator", active: true },
              { trigger: "Validation Approved", action: "Generate TSA PDF", active: true },
              { trigger: "Client Approved", action: "Generate syndic/owner PDF", active: false },
              { trigger: "Build Phase Complete", action: "Notify PM for review", active: true },
            ].map((wf, i) => (
              <div key={i} className="flex items-center gap-3 bg-bg-raised border border-border rounded-md" style={{
                padding: "12px 16px",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: wf.active ? "var(--green)" : "var(--text-muted)",
                }} />
                <div className="flex-1">
                  <div className="font-mono text-xs text-text-primary">{wf.trigger}</div>
                  <div className="font-mono text-xs text-text-secondary">{wf.action}</div>
                </div>
                <button className={`toggle-btn ${wf.active ? "green" : "primary"}`} style={{ padding: "4px 10px" }}>
                  {wf.active ? "Active" : "Enable"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
