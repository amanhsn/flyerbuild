import { useState, useMemo } from "react";
import { useLang } from "../../../i18n/LangContext";
import { MOCK_SURVEYS } from "../../../data/mockSurveys";
import { ApprovalGate, StatusBadge, EmptyState } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
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
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Approval Flow</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Multi-level approval gates -- {approvalSurveys.length} addresses in pipeline
      </p>

      <div className="gap-5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* List */}
        {(!isMobile || !selectedSurvey) && (
          <div className="flex-1 flex flex-col gap-2">
            {approvalSurveys.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedSurvey(s.id)}
                className="cursor-pointer rounded-md flex items-center gap-2.5"
                style={{
                  padding: "12px 16px",
                  background: selectedSurvey === s.id ? "var(--primary-glow)" : "var(--bg-raised)",
                  border: `1px solid ${selectedSurvey === s.id ? "var(--primary-dim)" : "var(--border)"}`,
                }}
              >
                <StatusBadge status={s.status} />
                <div className="flex-1">
                  <div className="font-mono text-sm text-text-primary">{s.address.street} {s.address.number}</div>
                  <div className="font-mono text-xs text-text-muted">{s.tsg_id}</div>
                </div>
                <Icon n="chevR" size={12} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        )}

        {/* Gate detail */}
        {(!isMobile || selectedSurvey) && (
          <div className="flex-1">
            {selectedData ? (
              <div className="flex flex-col gap-4">
                {isMobile && (
                  <button
                    onClick={() => setSelectedSurvey(null)}
                    className="font-mono text-sm text-text-primary-accent flex items-center gap-1.5 cursor-pointer"
                    style={{ background: "none", border: "none", padding: 0 }}
                  >
                    <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                    Back to list
                  </button>
                )}
                <div className="font-display text-lg font-bold tracking-wide">
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

                <div className="flex gap-2 mt-2 flex-wrap">
                  <button className="toggle-btn green active flex items-center gap-1.5" style={{ padding: "8px 16px" }}>
                    <Icon n="file" size={14} color="#fff" /> Generate PDF
                  </button>
                  <button className="toggle-btn primary flex items-center gap-1.5" style={{ padding: "8px 16px" }}>
                    <Icon n="mail" size={14} color="var(--primary)" /> Send Email
                  </button>
                </div>
              </div>
            ) : (
              <EmptyState icon="shield" message="Select an address to view approval gates" sub="Choose from the list on the left" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
