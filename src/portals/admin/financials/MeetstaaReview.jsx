import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { FileUploadZone } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { useIsMobile } from "../../../hooks/useIsMobile";

const PAYMENT_CODES = [
  { code: "PC-001", description: "Lead-in trench (per meter)", unitPrice: 45.00 },
  { code: "PC-002", description: "Diamond drilling (per unit)", unitPrice: 85.00 },
  { code: "PC-003", description: "Wall penetration (per unit)", unitPrice: 35.00 },
  { code: "PC-004", description: "Cable duct installation (per meter)", unitPrice: 22.00 },
  { code: "PC-005", description: "Fire retardant conduit (per unit)", unitPrice: 55.00 },
  { code: "PC-006", description: "Floorbox installation (per unit)", unitPrice: 120.00 },
];

const MOCK_MEETSTAAT = [
  { tsg_id: "WERK-08", subco: "FiberCo BVBA", status: "pending_review", uploadedAt: "2026-02-26", files: [{ name: "meetstaat_WERK-08.pdf" }] },
  { tsg_id: "MEN-09", subco: "TelNet BV", status: "approved", uploadedAt: "2026-02-24", files: [{ name: "meetstaat_MEN-09.pdf" }] },
];

export const MeetstaaReview = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState(null);
  const [lineItems, setLineItems] = useState({});

  const selected = MOCK_MEETSTAAT.find(m => m.tsg_id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 className={`font-display ${isMobile ? "text-[22px]" : "text-[28px]"} font-extrabold tracking-wide`}>Meetstaat & Financials</h1>
      <p className="font-mono text-sm text-text-secondary mt-1 mb-6">
        Review subcontractor return PDFs and reconcile payment items
      </p>

      <div className="gap-5" style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        {/* List */}
        {(!isMobile || !selectedId) && (
        <div className="shrink-0 flex flex-col gap-2" style={{ width: isMobile ? "100%" : 280 }}>
          {MOCK_MEETSTAAT.map(m => (
            <div
              key={m.tsg_id}
              onClick={() => setSelectedId(m.tsg_id)}
              className="cursor-pointer rounded-md"
              style={{
                padding: "12px 16px",
                background: selectedId === m.tsg_id ? "var(--primary-glow)" : "var(--bg-raised)",
                border: `1px solid ${selectedId === m.tsg_id ? "var(--primary-dim)" : "var(--border)"}`,
              }}
            >
              <div className="flex items-center gap-2">
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: m.status === "approved" ? "var(--green)" : "var(--primary)",
                }} />
                <span className="font-mono text-sm text-text-primary">{m.tsg_id}</span>
              </div>
              <div className="font-mono text-xs text-text-secondary mt-1">
                {m.subco} · {m.status === "approved" ? "Approved" : "Pending Review"}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Detail */}
        {(!isMobile || selectedId) && (
        <div className="flex-1">
          {selected ? (
            <div className="flex flex-col gap-5">
              {isMobile && (
                <button
                  onClick={() => setSelectedId(null)}
                  className="font-mono text-sm text-text-primary-accent flex items-center gap-1.5 cursor-pointer"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                  Back to list
                </button>
              )}
              <div>
                <div className="font-display text-lg font-bold tracking-wide">{selected.tsg_id}</div>
                <div className="font-mono text-xs text-text-secondary mt-1">
                  {selected.subco} · Uploaded {selected.uploadedAt}
                </div>
              </div>

              {/* Uploaded meetstaat */}
              <div className="bg-bg-raised border border-border rounded-md flex items-center gap-2.5 flex-wrap" style={{
                padding: "12px 16px",
              }}>
                <Icon n="file" size={18} color="var(--primary)" />
                <span className="font-mono text-sm text-text-primary flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{selected.files[0].name}</span>
                <button className="toggle-btn primary" style={{ padding: "4px 10px" }}>
                  View PDF
                </button>
              </div>

              {/* Payment code line items */}
              <div>
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2.5">
                  Payment Code Line Items
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                  {PAYMENT_CODES.map(pc => {
                    const qty = lineItems[`${selected.tsg_id}-${pc.code}`] || 0;
                    return (
                      <div key={pc.code} className="flex items-center gap-3 border-b border-border bg-bg-raised" style={{
                        padding: "10px 14px",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                      }}>
                        <span className="font-mono text-xs text-primary" style={{ width: 60 }}>{pc.code}</span>
                        <span className="font-mono text-xs text-text-secondary" style={{ flex: isMobile ? "1 1 100%" : 1 }}>{pc.description}</span>
                        <span className="font-mono text-xs text-text-muted">{pc.unitPrice.toFixed(2)}</span>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => setLineItems(li => ({
                            ...li,
                            [`${selected.tsg_id}-${pc.code}`]: parseInt(e.target.value) || 0,
                          }))}
                          className="text-center rounded-sm"
                          style={{
                            width: 60, padding: "4px 8px",
                            background: "var(--bg-overlay)", border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-mono)", fontSize: 11,
                          }}
                        />
                        <span className="font-mono text-xs text-text-primary text-right" style={{ width: 70 }}>
                          {(qty * pc.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button className="toggle-btn green active" style={{ padding: "8px 16px" }}>
                  Approve Meetstaat
                </button>
                <button className="toggle-btn red" style={{ padding: "8px 16px" }}>
                  Request Corrections
                </button>
              </div>
            </div>
          ) : (
            <div className="font-mono text-[13px] text-text-muted text-center" style={{ padding: 40 }}>
              Select a meetstaat to review
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
