import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { FileUploadZone } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";

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
    <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
      <h1 style={disp(28, 800)}>Admin Tools</h1>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 4, marginBottom: 20 })}>
        System configuration and bulk operations
      </p>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`filter-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <Icon n={tab.icon} size={12} color={activeTab === tab.id ? "#000" : "var(--text-muted)"} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "import" && (
        <div style={{ maxWidth: 600 }}>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
            Bulk Address Import
          </div>
          <p style={mono(12, "var(--text-secondary)", { marginBottom: 16 })}>
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
            <button className="toggle-btn green active" style={{ marginTop: 16, padding: "8px 20px" }}>
              Process Import
            </button>
          )}
        </div>
      )}

      {activeTab === "grouping" && (
        <div>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
            Building Grouping / Splitting
          </div>
          <p style={mono(12, "var(--text-secondary)", { marginBottom: 16 })}>
            Group MDU buildings that share a basement or split grouped buildings into separate surveys. Use A/B suffixes for split buildings.
          </p>
          <div style={{
            padding: 24, background: "var(--bg-raised)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", textAlign: "center",
          }}>
            <Icon n="building" size={32} color="var(--text-muted)" />
            <div style={mono(14, "var(--text-muted)", { marginTop: 8 })}>
              Select buildings from the map view to group or split them
            </div>
          </div>
        </div>
      )}

      {activeTab === "rbac" && (
        <div>
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
            Role-Based Access Control
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["surveyor", "validator", "admin", "subcontractor"].map(role => (
              <div key={role} style={{
                padding: "14px 18px", background: "var(--bg-raised)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <Icon n="user" size={16} color="var(--primary)" />
                <div style={{ flex: 1 }}>
                  <div style={mono(14, "var(--text-primary)", { fontWeight: 600, textTransform: "capitalize" })}>
                    {role}
                  </div>
                  <div style={mono(12, "var(--text-muted)")}>
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
          <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 })}>
            Workflow Triggers
          </div>
          <p style={mono(12, "var(--text-secondary)", { marginBottom: 16 })}>
            Configure automated actions triggered by status changes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { trigger: "Survey Completed", action: "Send notification to validator", active: true },
              { trigger: "Validation Approved", action: "Generate TSA PDF", active: true },
              { trigger: "Client Approved", action: "Generate syndic/owner PDF", active: false },
              { trigger: "Build Phase Complete", action: "Notify PM for review", active: true },
            ].map((wf, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", background: "var(--bg-raised)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: wf.active ? "var(--green)" : "var(--text-muted)",
                }} />
                <div style={{ flex: 1 }}>
                  <div style={mono(12, "var(--text-primary)")}>{wf.trigger}</div>
                  <div style={mono(12, "var(--text-secondary)")}>{wf.action}</div>
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
