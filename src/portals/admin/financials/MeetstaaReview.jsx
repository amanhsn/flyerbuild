import { useState } from "react";
import { useLang } from "../../../i18n/LangContext";
import { FileUploadZone } from "../../../components/shared";
import { Icon } from "../../../icons/Icon";
import { disp, mono } from "../../../styles/helpers";
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
    <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "24px 28px" }}>
      <h1 style={disp(isMobile ? 22 : 28, 800)}>Meetstaat & Financials</h1>
      <p style={mono(14, "var(--text-secondary)", { marginTop: 4, marginBottom: 24 })}>
        Review subcontractor return PDFs and reconcile payment items
      </p>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 20 }}>
        {/* List */}
        {(!isMobile || !selectedId) && (
        <div style={{ width: isMobile ? "100%" : 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {MOCK_MEETSTAAT.map(m => (
            <div
              key={m.tsg_id}
              onClick={() => setSelectedId(m.tsg_id)}
              style={{
                padding: "12px 16px", cursor: "pointer",
                background: selectedId === m.tsg_id ? "var(--primary-glow)" : "var(--bg-raised)",
                border: `1px solid ${selectedId === m.tsg_id ? "var(--primary-dim)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: m.status === "approved" ? "var(--green)" : "var(--primary)",
                }} />
                <span style={mono(14, "var(--text-primary)")}>{m.tsg_id}</span>
              </div>
              <div style={mono(12, "var(--text-secondary)", { marginTop: 4 })}>
                {m.subco} · {m.status === "approved" ? "Approved" : "Pending Review"}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Detail */}
        {(!isMobile || selectedId) && (
        <div style={{ flex: 1 }}>
          {selected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {isMobile && (
                <button
                  onClick={() => setSelectedId(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, ...mono(14, "var(--text-primary-accent)") }}
                >
                  <Icon n="chevR" size={12} color="var(--text-primary-accent)" style={{ transform: "rotate(180deg)" }} />
                  Back to list
                </button>
              )}
              <div>
                <div style={disp(18, 700)}>{selected.tsg_id}</div>
                <div style={mono(12, "var(--text-secondary)", { marginTop: 4 })}>
                  {selected.subco} · Uploaded {selected.uploadedAt}
                </div>
              </div>

              {/* Uploaded meetstaat */}
              <div style={{
                padding: "12px 16px", background: "var(--bg-raised)",
                border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", gap: 10,
                flexWrap: "wrap",
              }}>
                <Icon n="file" size={18} color="var(--primary)" />
                <span style={{ ...mono(14, "var(--text-primary)"), flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.files[0].name}</span>
                <button className="toggle-btn primary" style={{ padding: "4px 10px" }}>
                  View PDF
                </button>
              </div>

              {/* Payment code line items */}
              <div>
                <div style={mono(12, "var(--text-muted)", { textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 })}>
                  Payment Code Line Items
                </div>
                <div style={{
                  border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}>
                  {PAYMENT_CODES.map(pc => {
                    const qty = lineItems[`${selected.tsg_id}-${pc.code}`] || 0;
                    return (
                      <div key={pc.code} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderBottom: "1px solid var(--border)",
                        background: "var(--bg-raised)",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                      }}>
                        <span style={mono(12, "var(--primary)", { width: 60 })}>{pc.code}</span>
                        <span style={{ ...mono(12, "var(--text-secondary)"), flex: isMobile ? "1 1 100%" : 1 }}>{pc.description}</span>
                        <span style={mono(12, "var(--text-muted)")}>€{pc.unitPrice.toFixed(2)}</span>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => setLineItems(li => ({
                            ...li,
                            [`${selected.tsg_id}-${pc.code}`]: parseInt(e.target.value) || 0,
                          }))}
                          style={{
                            width: 60, padding: "4px 8px", textAlign: "center",
                            background: "var(--bg-overlay)", border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)", color: "var(--text-primary)",
                            fontFamily: "var(--font-mono)", fontSize: 11,
                          }}
                        />
                        <span style={mono(12, "var(--text-primary)", { width: 70, textAlign: "right" })}>
                          €{(qty * pc.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="toggle-btn green active" style={{ padding: "8px 16px" }}>
                  Approve Meetstaat
                </button>
                <button className="toggle-btn red" style={{ padding: "8px 16px" }}>
                  Request Corrections
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: "center", ...mono(13, "var(--text-muted)") }}>
              Select a meetstaat to review
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
