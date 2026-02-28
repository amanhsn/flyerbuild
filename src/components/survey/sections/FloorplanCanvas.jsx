import { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "../../../icons/Icon";
import { useLang } from "../../../i18n/LangContext";
import { cn } from "../../../lib/utils";


const CANVAS_H = 420;
const GRID_SIZE = 20;
const STROKE_COLOR = "#1e293b";
const GRID_COLOR = "rgba(0,0,0,0.06)";

const TOOLS = [
  { key: "pen",  icon: "pen",  label: "Pen" },
  { key: "line", icon: "sig",  label: "Line" },
  { key: "text", icon: "file", label: "Text" },
];

function drawGrid(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = GRID_COLOR;
  ctx.lineWidth = 1;
  for (let x = GRID_SIZE; x < w; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = GRID_SIZE; y < h; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

export const FloorplanCanvas = ({ survey, setField, disabled }) => {
  const { t } = useLang();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [activeTool, setActiveTool] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const drawing = useRef(false);
  const lineStart = useRef(null);
  const preLineSnap = useRef(null);
  const [textInput, setTextInput] = useState(null);
  const [canvasW, setCanvasW] = useState(800);

  // Coordinate helper
  const pt = useCallback((e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: ((e.clientX - r.left) / r.width) * canvasRef.current.width / dpr,
      y: ((e.clientY - r.top) / r.height) * canvasRef.current.height / dpr,
    };
  }, []);

  const persist = useCallback(() => {
    if (canvasRef.current) {
      setField("photos.floorplan", canvasRef.current.toDataURL("image/png"));
    }
  }, [setField]);

  const saveSnapshot = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      setSnapshots(prev => [...prev, ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    }
  }, []);

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const w = wrap.clientWidth;
    setCanvasW(w);
    canvas.width = w * dpr;
    canvas.height = CANVAS_H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, CANVAS_H);
    drawGrid(ctx, w, CANVAS_H);

    // Load existing
    const existing = survey.photos?.floorplan;
    if (existing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, CANVAS_H);
      };
      img.src = existing;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, w, h);
  }, []);

  const configCtx = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    return ctx;
  }, []);

  // Pointer handlers
  const onDown = useCallback((e) => {
    if (disabled || !activeTool) return;
    const p = pt(e);
    const ctx = configCtx();
    if (!ctx) return;

    if (activeTool === "pen") {
      saveSnapshot();
      drawing.current = true;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    } else if (activeTool === "line") {
      saveSnapshot();
      lineStart.current = p;
      preLineSnap.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    } else if (activeTool === "text") {
      setTextInput(p);
    }
  }, [disabled, activeTool, pt, configCtx, saveSnapshot]);

  const onMove = useCallback((e) => {
    if (disabled) return;
    const p = pt(e);
    const ctx = configCtx();
    if (!ctx) return;

    if (activeTool === "pen" && drawing.current) {
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    } else if (activeTool === "line" && lineStart.current && preLineSnap.current) {
      ctx.putImageData(preLineSnap.current, 0, 0);
      ctx.beginPath();
      ctx.moveTo(lineStart.current.x, lineStart.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, [disabled, activeTool, pt, configCtx]);

  const onUp = useCallback(() => {
    if (activeTool === "pen" && drawing.current) {
      drawing.current = false;
      persist();
    } else if (activeTool === "line" && lineStart.current) {
      lineStart.current = null;
      preLineSnap.current = null;
      persist();
    }
  }, [activeTool, persist]);

  const commitText = useCallback((text) => {
    if (!text || !textInput) return;
    saveSnapshot();
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = STROKE_COLOR;
      ctx.font = "14px 'DM Sans', sans-serif";
      ctx.fillText(text, textInput.x, textInput.y);
    }
    setTextInput(null);
    persist();
  }, [textInput, saveSnapshot, persist]);

  const handleUndo = useCallback(() => {
    if (snapshots.length === 0) return;
    const ctx = canvasRef.current?.getContext("2d");
    const last = snapshots[snapshots.length - 1];
    if (ctx && last) {
      ctx.putImageData(last, 0, 0);
      setSnapshots(prev => prev.slice(0, -1));
      persist();
    }
  }, [snapshots, persist]);

  const handleClear = useCallback(() => {
    saveSnapshot();
    resetCanvas();
    setField("photos.floorplan", null);
  }, [saveSnapshot, resetCanvas, setField]);

  const toolBtn = (key, icon, label) => {
    const isActive = activeTool === key;
    return (
      <button
        key={key}
        disabled={disabled}
        onClick={() => setActiveTool(isActive ? null : key)}
        className={cn(
          "flex items-center gap-1.5 py-1.5 px-3 rounded-sm",
          isActive ? "bg-primary-glow" : "bg-bg-elevated"
        )}
        style={{
          border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
        title={label}
      >
        <Icon n={icon} size={14} color={isActive ? "var(--primary)" : "var(--text-secondary)"} />
        <span className={cn("font-mono text-xs", isActive ? "text-primary" : "text-text-secondary")}>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Toolbar */}
      <div className="flex gap-1.5 py-2 px-2.5 flex-wrap bg-bg-overlay rounded-lg border border-border">
        {TOOLS.map(({ key, icon, label }) => toolBtn(key, icon, label))}
        <div className="flex-1" />
        <button
          disabled={disabled || snapshots.length === 0}
          onClick={handleUndo}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-bg-elevated border border-border rounded-sm"
          style={{
            cursor: disabled || snapshots.length === 0 ? "default" : "pointer",
            opacity: disabled || snapshots.length === 0 ? 0.4 : 1,
          }}
        >
          <Icon n="x" size={14} color="var(--text-secondary)" />
          <span className="font-mono text-xs text-text-secondary">Undo</span>
        </button>
        <button
          disabled={disabled}
          onClick={handleClear}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-bg-elevated border border-border rounded-sm"
          style={{
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Icon n="trash" size={14} color="var(--text-secondary)" />
          <span className="font-mono text-xs text-text-secondary">Clear</span>
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={wrapRef}
        className="relative w-full rounded-lg overflow-hidden border-2 border-border-bright"
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block", width: "100%", height: CANVAS_H,
            touchAction: "none",
            cursor: disabled ? "default" : activeTool === "text" ? "text" : activeTool ? "crosshair" : "default",
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
        {textInput && (
          <input
            autoFocus
            style={{
              position: "absolute",
              left: (textInput.x / canvasW) * 100 + "%",
              top: textInput.y,
              background: "transparent", border: "none", outline: "none",
              color: STROKE_COLOR, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              caretColor: "var(--primary)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { commitText(e.target.value); }
              if (e.key === "Escape") { setTextInput(null); }
            }}
            onBlur={(e) => commitText(e.target.value)}
          />
        )}
      </div>
    </div>
  );
};
