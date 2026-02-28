import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";

const STROKE_COLOR = "#1e293b";
const CANVAS_H = 160;

export const SignatureModal = ({ title, onSave, onCancel }) => {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState("draw");
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
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-bg-base border border-border rounded-xl w-full max-w-[500px] shadow-[0_8px_32px_rgba(0,0,0,.4)] flex flex-col gap-4",
          isMobile ? "p-4 mx-4" : "p-6"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-primary-glow border border-primary-dim flex items-center justify-center">
            <Icon n="sig" size={18} color="var(--primary)" />
          </div>
          <div className="font-display text-base font-bold tracking-wide">{title}</div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1.5">
          <button
            className={cn(
              "font-mono text-xs font-semibold tracking-[.04em] uppercase px-3.5 py-[7px] rounded-sm border-none whitespace-nowrap cursor-pointer transition-all",
              mode === "draw" ? "bg-primary text-white" : "bg-bg-elevated text-text-secondary"
            )}
            onClick={() => { setMode("draw"); setUploaded(null); }}
          >
            Draw
          </button>
          <button
            className={cn(
              "font-mono text-xs font-semibold tracking-[.04em] uppercase px-3.5 py-[7px] rounded-sm border-none whitespace-nowrap cursor-pointer transition-all",
              mode === "upload" ? "bg-primary text-white" : "bg-bg-elevated text-text-secondary"
            )}
            onClick={() => setMode("upload")}
          >
            Upload
          </button>
        </div>

        {/* Canvas / Upload area */}
        {mode === "draw" ? (
          <div className="rounded-md overflow-hidden border border-border">
            <canvas
              ref={canvasRef}
              style={{ display: "block", width: "100%", height: CANVAS_H, touchAction: "none", cursor: "crosshair" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            />
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-bg-elevated cursor-pointer overflow-hidden"
            style={{ height: CANVAS_H }}
          >
            {uploaded ? (
              <img src={uploaded} alt="Signature" className="max-w-[90%] object-contain" style={{ maxHeight: CANVAS_H - 16 }} />
            ) : (
              <>
                <Icon n="upload" size={24} color="var(--text-muted)" />
                <span className="font-mono text-xs text-text-muted">Click to upload signature image</span>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2.5 justify-end">
          {mode === "draw" && (
            <button
              onClick={clearCanvas}
              className="font-mono text-[13px] text-text-secondary bg-transparent border border-border rounded-sm px-3.5 py-2 cursor-pointer mr-auto"
            >
              Clear
            </button>
          )}
          {mode === "upload" && uploaded && (
            <button
              onClick={() => setUploaded(null)}
              className="font-mono text-[13px] text-text-secondary bg-transparent border border-border rounded-sm px-3.5 py-2 cursor-pointer mr-auto"
            >
              Remove
            </button>
          )}
          <button
            className="px-4 py-2 bg-bg-elevated border border-border rounded-md font-display text-base font-semibold text-text-secondary cursor-pointer transition-all"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 px-5 py-2 rounded-md bg-primary border border-primary text-white font-display text-[17px] font-bold tracking-[.03em] cursor-pointer transition-all",
              !canSave && "opacity-50 cursor-default"
            )}
            disabled={!canSave}
            onClick={handleSave}
          >
            <Icon n="check" size={14} color="#fff" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
