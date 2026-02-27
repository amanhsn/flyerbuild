import { useState, useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { ApprovalGate, StatusBadge } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const ApprovalFlow = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Surveys that need approval actions
  const approvalSurveys = useMemo(() =>
    MOCK_SURVEYS.filter(s =>
      ["validation_f49", "validation_client", "completed", "sent"].includes(s.status)
    ), []
  );

  const selectedData = approvalSurveys.find(s => s.id === selectedSurvey);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>Approval Flow</h1>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Multi-level approval gates — {approvalSurveys.length} addresses in pipeline
      </p>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20 }}>
        {/* List */}
        {(!isMobile || !selectedSurvey) && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {approvalSurveys.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedSurvey(s.id)}
                style={{
                  padding: "12px 16px", cursor: "pointer",
                  background: selectedSurvey === s.id ? "var(--primary-glow)" : "var(--bg-raised)",
                  border: `1px solid ${selectedSurvey === s.id ? "var(--primary-dim)" : "var(--border)"}`,
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <StatusBadge status={s.status} />
                <div style={{ flex: 1 }}>
                  <div style={mono(14, "var(--text-primary)")}>{s.address.street} {s.address.number}</div>
                  <div style={mono(12, "var(--text-muted)")}>{s.tsg_id}</div>
                </div>
                <Icon n="chevR" size={12} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        )}

        {/* Gate detail */}
        {(!isMobile || selectedSurvey) && (
          <div style={{ flex: 1 }}>
            {selectedData ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {isMobile && (
                  <button
                    onClick={() => setSelectedSurvey(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, ...mono(14, "var(--text-primary-accent)") }}
                  >
                    <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                    Back to list
                  </button>
                )}
                <div style={disp(18, 700)}>
                  {selectedData.address.street} {selectedData.address.number}
                </div>

                <ApprovalGate
                  title="Survey Validation"
                  gates={[
                    {
                      key: "f49", label: "F49 Internal Validation",
                      cleared: ["validation_client", "completed", "sent"].includes(selectedData.status),
                      clearedBy: selectedData.validated_by, clearedAt: selectedData.validated_at,
                    },
                    {
                      key: "client", label: "Client Approval",
                      cleared: ["completed", "sent"].includes(selectedData.status),
                    },
                  ]}
                />

                <ApprovalGate
                  title="Post-Approval Gates"
                  gates={[
                    { key: "pdf_tsa", label: "TSA PDF Generated", cleared: selectedData.status === "sent" || selectedData.status === "completed" },
                    { key: "syndic", label: "Syndic/Owner Signed", cleared: !!selectedData.agreement?.owner_signature },
                    { key: "engineering", label: "Engineering Inputs Present", cleared: false },
                  ]}
                />

                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button className="toggle-btn green active" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon n="file" size={14} color="#fff" /> Generate PDF
                  </button>
                  <button className="toggle-btn primary" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon n="mail" size={14} color="var(--primary)" /> Send Email
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: "center", ...mono(13, "var(--text-muted)") }}>
                Select an address to view approval gates
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
