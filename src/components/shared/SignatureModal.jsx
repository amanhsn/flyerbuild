import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "../../icons/Icon";
import { mono, disp } from "../../styles/helpers";
import { useIsMobile } from "../../hooks/useIsMobile";

const STROKE_COLOR = "#1e293b";
const CANVAS_H = 160;

export const SignatureModal = ({ title, onSave, onCancel }) => {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState("draw"); // "draw" | "upload"
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const fileRef = useRef(null);

  // Init canvas
  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || 400;
    canvas.width = w * dpr;
    canvas.height = CANVAS_H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, CANVAS_H);
    // Signature line hint
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const lineY = CANVAS_H - 30;
    ctx.beginPath();
    ctx.moveTo(20, lineY);
    ctx.lineTo(w - 20, lineY);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [mode]);

  const pt = useCallback((e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: ((e.clientX - r.left) / r.width) * canvasRef.current.width / dpr,
      y: ((e.clientY - r.top) / r.height) * canvasRef.current.height / dpr,
    };
  }, []);

  const configCtx = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    return ctx;
  }, []);

  const onDown = useCallback((e) => {
    const p = pt(e);
    const ctx = configCtx();
    if (!ctx) return;
    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }, [pt, configCtx]);

  const onMove = useCallback((e) => {
    if (!drawing.current) return;
    const p = pt(e);
    const ctx = configCtx();
    if (!ctx) return;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasDrawn(true);
  }, [pt, configCtx]);

  const onUp = useCallback(() => {
    drawing.current = false;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, CANVAS_H);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const lineY = CANVAS_H - 30;
    ctx.beginPath();
    ctx.moveTo(20, lineY);
    ctx.lineTo(w - 20, lineY);
    ctx.stroke();
    ctx.setLineDash([]);
    setHasDrawn(false);
  }, []);

  const handleSave = useCallback(() => {
    if (mode === "draw" && canvasRef.current) {
      onSave(canvasRef.current.toDataURL("image/png"));
    } else if (mode === "upload" && uploaded) {
      onSave(uploaded);
    }
  }, [mode, uploaded, onSave]);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploaded(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const canSave = mode === "draw" ? hasDrawn : !!uploaded;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-base)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)", padding: isMobile ? 16 : 24,
          width: "100%", maxWidth: 500, margin: isMobile ? "0 16px" : 0,
          boxShadow: "0 8px 32px rgba(0,0,0,.4)",
          display: "flex", flexDirection: "column", gap: 16,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-md)",
            background: "var(--primary-glow)", border: "1px solid var(--primary-dim)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon n="sig" size={18} color="var(--primary)" />
          </div>
          <div style={disp(16, 700)}>{title}</div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={`filter-btn${mode === "draw" ? " active" : ""}`}
            onClick={() => { setMode("draw"); setUploaded(null); }}
          >
            Draw
          </button>
          <button
            className={`filter-btn${mode === "upload" ? " active" : ""}`}
            onClick={() => setMode("upload")}
          >
            Upload
          </button>
        </div>

        {/* Canvas / Upload area */}
        {mode === "draw" ? (
          <div style={{
            borderRadius: "var(--radius-md)", overflow: "hidden",
            border: "1px solid var(--border)",
          }}>
            <canvas
              ref={canvasRef}
              style={{
                display: "block", width: "100%", height: CANVAS_H,
                touchAction: "none", cursor: "crosshair",
              }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            />
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              height: CANVAS_H, borderRadius: "var(--radius-md)",
              border: "2px dashed var(--border)", background: "var(--bg-elevated)",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 8, cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {uploaded ? (
              <img src={uploaded} alt="Signature" style={{ maxHeight: CANVAS_H - 16, maxWidth: "90%", objectFit: "contain" }} />
            ) : (
              <>
                <Icon n="upload" size={24} color="var(--text-muted)" />
                <span style={mono(12, "var(--text-muted)")}>Click to upload signature image</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          {mode === "draw" && (
            <button
              onClick={clearCanvas}
              style={{
                ...mono(13, "var(--text-secondary)"),
                background: "none", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "8px 14px",
                cursor: "pointer", marginRight: "auto",
              }}
            >
              Clear
            </button>
          )}
          {mode === "upload" && uploaded && (
            <button
              onClick={() => setUploaded(null)}
              style={{
                ...mono(13, "var(--text-secondary)"),
                background: "none", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "8px 14px",
                cursor: "pointer", marginRight: "auto",
              }}
            >
              Remove
            </button>
          )}
          <button className="cta-btn secondary" onClick={onCancel}>Cancel</button>
          <button
            className="toggle-btn primary active"
            disabled={!canSave}
            onClick={handleSave}
            style={{
              padding: "8px 20px", display: "flex", alignItems: "center", gap: 6,
              opacity: canSave ? 1 : 0.5,
            }}
          >
            <Icon n="check" size={14} color="#fff" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
