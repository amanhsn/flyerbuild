"use client"

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "../../icons/Icon";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";
import { ANNOTATION_LEGEND_ITEMS, SHAPE_TOOLS, COLOR_PRESETS } from "../../data/annotationLegend";

const DEFAULT_COLOR = "#22c55e";
const DEFAULT_LINE_WIDTH = 3;

function renderAnnotation(ctx, ann, w, h) {
  ctx.save();
  ctx.strokeStyle = ann.color || DEFAULT_COLOR;
  ctx.fillStyle = ann.color || DEFAULT_COLOR;
  ctx.lineWidth = ann.lineWidth || DEFAULT_LINE_WIDTH;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (ann.dash?.length) {
    ctx.setLineDash(ann.dash);
  }

  const pts = (ann.points || []).filter(Boolean).map(p => ({ x: p.x * w, y: p.y * h }));

  switch (ann.type) {
    case "line":
    case "dashedLine":
      if (pts.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.stroke();
      }
      break;
    case "freehand":
      if (pts.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.stroke();
      }
      break;
    case "circle": {
      if (pts.length >= 2) {
        const cx = (pts[0].x + pts[1].x) / 2;
        const cy = (pts[0].y + pts[1].y) / 2;
        const rx = Math.abs(pts[1].x - pts[0].x) / 2;
        const ry = Math.abs(pts[1].y - pts[0].y) / 2;
        if (rx > 0 && ry > 0) {
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      break;
    }
    case "rect":
      if (pts.length >= 2) {
        const x = Math.min(pts[0].x, pts[1].x);
        const y = Math.min(pts[0].y, pts[1].y);
        const rw = Math.abs(pts[1].x - pts[0].x);
        const rh = Math.abs(pts[1].y - pts[0].y);
        ctx.strokeRect(x, y, rw, rh);
      }
      break;
    case "triangle":
      if (pts.length >= 2) {
        const x0 = pts[0].x, y0 = pts[0].y;
        const x1 = pts[1].x, y1 = pts[1].y;
        ctx.beginPath();
        ctx.moveTo((x0 + x1) / 2, y0);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x0, y1);
        ctx.closePath();
        ctx.stroke();
      }
      break;
    case "diamond":
      if (pts.length >= 2) {
        const x0 = pts[0].x, y0 = pts[0].y;
        const x1 = pts[1].x, y1 = pts[1].y;
        const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, y0);
        ctx.lineTo(x1, my);
        ctx.lineTo(mx, y1);
        ctx.lineTo(x0, my);
        ctx.closePath();
        ctx.stroke();
      }
      break;
    case "text":
      if (pts.length >= 1) {
        ctx.font = `${ann.fontSize || 16}px 'DM Sans', sans-serif`;
        ctx.fillText(ann.text || "", pts[0].x, pts[0].y);
      }
      break;
    case "legendItem":
      if (pts.length >= 1) {
        const fontSize = ann.fontSize || 14;
        ctx.font = `bold ${fontSize}px 'DM Sans', sans-serif`;
        const txt = ann.text || "";
        const tm = ctx.measureText(txt);
        const padX = 6, padY = 4;
        const bx = pts[0].x - padX;
        const by = pts[0].y - fontSize - padY;
        const bw = tm.width + padX * 2;
        const bh = fontSize + padY * 2;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(bx, by, bw, bh);
        ctx.globalAlpha = 1;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.fillText(txt, pts[0].x, pts[0].y);
      }
      break;
    case "arrow": {
      if (pts.length >= 2) {
        const x0 = pts[0].x, y0 = pts[0].y;
        const x1 = pts[pts.length - 1].x, y1 = pts[pts.length - 1].y;
        const angle = Math.atan2(y1 - y0, x1 - x0);
        const headLen = Math.max(10, (ann.lineWidth || DEFAULT_LINE_WIDTH) * 4);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - headLen * Math.cos(angle - Math.PI / 6), y1 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - headLen * Math.cos(angle + Math.PI / 6), y1 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

function redrawAll(canvas, annotations, dims) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(dpr, dpr);
  for (const ann of annotations) {
    renderAnnotation(ctx, ann, dims.w, dims.h);
  }
  return ctx;
}

export const AnnotationEditor = ({ photoBase64, annotations: initialAnnotations = [], onSave, onCancel, layerName = "surveyor", showToggle = false }) => {
  const isMobile = useIsMobile();
  const bgCanvasRef = useRef(null);
  const overlayRef = useRef(null);
  const wrapRef = useRef(null);
  const [annotations, setAnnotations] = useState(initialAnnotations);
  const [redoStack, setRedoStack] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [legendItem, setLegendItem] = useState(null);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [lineWidth, setLineWidth] = useState(DEFAULT_LINE_WIDTH);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const drawing = useRef(false);
  const currentPoints = useRef([]);
  const dragStart = useRef(null);
  const [textInput, setTextInput] = useState(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  // Use refs for values needed in pointer handlers to avoid stale closures
  const annotationsRef = useRef(annotations);
  annotationsRef.current = annotations;
  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;
  const legendItemRef = useRef(legendItem);
  legendItemRef.current = legendItem;
  const colorRef = useRef(color);
  colorRef.current = color;
  const lineWidthRef = useRef(lineWidth);
  lineWidthRef.current = lineWidth;
  const dimsRef = useRef(dims);
  dimsRef.current = dims;

  // Load photo and init canvases
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const maxW = wrap.clientWidth - 16; // account for padding
      const maxH = window.innerHeight - (isMobile ? 160 : 200);
      let w = img.width, h = img.height;
      const scale = Math.min(maxW / w, maxH / h, 1);
      w = Math.round(w * scale);
      h = Math.round(h * scale);

      const dpr = window.devicePixelRatio || 1;

      const bgCanvas = bgCanvasRef.current;
      bgCanvas.width = w * dpr;
      bgCanvas.height = h * dpr;
      const bgCtx = bgCanvas.getContext("2d");
      bgCtx.scale(dpr, dpr);
      bgCtx.drawImage(img, 0, 0, w, h);

      const overlay = overlayRef.current;
      overlay.width = w * dpr;
      overlay.height = h * dpr;

      setDims({ w, h });
      setReady(true);
    };
    img.src = photoBase64;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoBase64]);

  // Redraw annotations when they change
  useEffect(() => {
    if (!ready) return;
    redrawAll(overlayRef.current, showAnnotations ? annotations : [], dims);
  }, [annotations, dims, ready, showAnnotations]);

  const pt = useCallback((e) => {
    const r = overlayRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    };
  }, []);

  // Determine the preview annotation type/config for the current legend item
  const getLegendDrawConfig = useCallback((item) => {
    if (item.shape === "circle") return { type: "circle", dash: null };
    if (item.dash) return { type: "dashedLine", dash: item.dash };
    return { type: "line", dash: null };
  }, []);

  const onDown = useCallback((e) => {
    e.preventDefault();
    if (!ready) return;
    const p = pt(e);
    const legend = legendItemRef.current;
    const tool = activeToolRef.current;

    if (legend) {
      const item = ANNOTATION_LEGEND_ITEMS.find(i => i.key === legend);
      if (item) {
        if (item.shape === "labelRect") {
          setAnnotations(prev => [...prev, {
            type: "legendItem",
            points: [p],
            color: item.color,
            lineWidth: lineWidthRef.current,
            text: item.text,
            fontSize: 14,
            legendKey: item.key,
          }]);
        } else {
          dragStart.current = p;
          drawing.current = true;
        }
      }
      return;
    }

    if (!tool) return;

    if (tool === "text") {
      setTextInput(p);
      return;
    }

    // Eraser: find and remove the closest annotation
    if (tool === "eraser") {
      const threshold = 0.03; // 3% of canvas size
      const anns = annotationsRef.current;
      let closestIdx = -1;
      let closestDist = Infinity;
      anns.forEach((ann, idx) => {
        (ann.points || []).forEach(ap => {
          if (!ap) return;
          const dist = Math.hypot(ap.x - p.x, ap.y - p.y);
          if (dist < closestDist) { closestDist = dist; closestIdx = idx; }
        });
      });
      if (closestIdx >= 0 && closestDist < threshold) {
        setAnnotations(prev => prev.filter((_, i) => i !== closestIdx));
      }
      return;
    }

    drawing.current = true;
    dragStart.current = p;
    currentPoints.current = [p];
  }, [pt, ready, getLegendDrawConfig]);

  const onMove = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current || !ready) return;
    const p = pt(e);
    const tool = activeToolRef.current;
    const legend = legendItemRef.current;
    const curColor = colorRef.current;
    const curLineWidth = lineWidthRef.current;
    const curDims = dimsRef.current;
    const curAnnotations = annotationsRef.current;

    // Redraw existing annotations first
    const ctx = redrawAll(overlayRef.current, curAnnotations, curDims);
    if (!ctx) return;

    if (tool === "freehand" && !legend) {
      currentPoints.current.push(p);
      renderAnnotation(ctx, {
        type: "freehand",
        points: currentPoints.current,
        color: curColor,
        lineWidth: curLineWidth,
      }, curDims.w, curDims.h);
    } else if (dragStart.current) {
      let type, dash, drawColor;

      if (legend) {
        const item = ANNOTATION_LEGEND_ITEMS.find(i => i.key === legend);
        if (item) {
          const cfg = getLegendDrawConfig(item);
          type = cfg.type;
          dash = cfg.dash;
          drawColor = item.color;
        } else return;
      } else {
        type = tool || "line";
        dash = tool === "dashedLine" ? [6, 4] : null;
        drawColor = curColor;
      }

      renderAnnotation(ctx, {
        type,
        points: [dragStart.current, p],
        color: drawColor,
        lineWidth: curLineWidth,
        dash,
      }, curDims.w, curDims.h);
    }
  }, [pt, ready, getLegendDrawConfig]);

  const onUp = useCallback((e) => {
    e.preventDefault();
    if (!drawing.current) return;
    drawing.current = false;
    const p = pt(e);
    const tool = activeToolRef.current;
    const legend = legendItemRef.current;
    const curColor = colorRef.current;
    const curLineWidth = lineWidthRef.current;

    if (legend) {
      const item = ANNOTATION_LEGEND_ITEMS.find(i => i.key === legend);
      if (item && dragStart.current) {
        const cfg = getLegendDrawConfig(item);
        setAnnotations(prev => [...prev, {
          type: cfg.type,
          points: [dragStart.current, p],
          color: item.color,
          lineWidth: curLineWidth,
          dash: cfg.dash,
          legendKey: item.key,
        }]);
      }
      dragStart.current = null;
      return;
    }

    if (!tool) { dragStart.current = null; return; }

    if (tool === "freehand") {
      if (currentPoints.current.length >= 2) {
        setAnnotations(prev => [...prev, {
          type: "freehand",
          points: [...currentPoints.current],
          color: curColor,
          lineWidth: curLineWidth,
        }]);
      }
    } else if (["line", "dashedLine", "circle", "rect", "triangle", "diamond", "arrow"].includes(tool) && dragStart.current) {
      setAnnotations(prev => [...prev, {
        type: tool,
        points: [dragStart.current, p],
        color: curColor,
        lineWidth: curLineWidth,
        dash: tool === "dashedLine" ? [6, 4] : null,
      }]);
    }

    dragStart.current = null;
    currentPoints.current = [];
  }, [pt, getLegendDrawConfig]);

  const commitText = useCallback((text) => {
    if (!text || !textInput) return;
    setAnnotations(prev => [...prev, {
      type: "text",
      points: [textInput],
      color: colorRef.current,
      lineWidth: lineWidthRef.current,
      text,
      fontSize: 16,
    }]);
    setTextInput(null);
  }, [textInput]);

  const handleUndo = useCallback(() => {
    setAnnotations(prev => {
      if (prev.length === 0) return prev;
      const removed = prev[prev.length - 1];
      setRedoStack(rs => [...rs, removed]);
      return prev.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setRedoStack(rs => {
      if (rs.length === 0) return rs;
      const restored = rs[rs.length - 1];
      setAnnotations(prev => [...prev, restored]);
      return rs.slice(0, -1);
    });
  }, []);

  const handleClear = useCallback(() => {
    setRedoStack(annotations);
    setAnnotations([]);
  }, [annotations]);

  const handleSave = useCallback(() => {
    const bg = bgCanvasRef.current;
    const overlay = overlayRef.current;
    if (!bg || !overlay) return;

    const out = document.createElement("canvas");
    out.width = bg.width;
    out.height = bg.height;
    const ctx = out.getContext("2d");
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(overlay, 0, 0);
    const composite = out.toDataURL("image/png");
    onSave({ annotations, composite, layer: layerName });
  }, [annotations, onSave]);

  const selectTool = (key) => {
    setLegendItem(null);
    setActiveTool(activeTool === key ? null : key);
  };

  const selectLegend = (key) => {
    setActiveTool(null);
    setLegendItem(legendItem === key ? null : key);
    const item = ANNOTATION_LEGEND_ITEMS.find(i => i.key === key);
    if (item) setColor(item.color);
  };

  const isActive = (key) => activeTool === key;

  const toolBtn = (key, icon, label, active) => (
    <button
      key={key}
      onClick={() => selectTool(key)}
      className={cn(
        "flex items-center gap-1 py-1 px-2 rounded-sm text-xs font-mono shrink-0",
        active ? "bg-primary-glow text-primary" : "bg-bg-elevated text-text-secondary"
      )}
      style={{ border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`, cursor: "pointer" }}
      title={label}
    >
      <Icon n={icon} size={13} color={active ? "var(--primary)" : "var(--text-secondary)"} />
      {!isMobile && <span>{label}</span>}
    </button>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex flex-col bg-black/80"
    >
      {/* Invisible backdrop for cancel - only covers areas outside the content */}
      <div className="absolute inset-0" onClick={onCancel} />

      <div
        className="relative flex flex-col h-full z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="bg-bg-base border-b border-border flex flex-col gap-1.5 p-2 shrink-0">
          {/* Legend items row */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {ANNOTATION_LEGEND_ITEMS.map((item) => {
              const active = legendItem === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => selectLegend(item.key)}
                  className={cn(
                    "flex items-center gap-1.5 py-1 px-2 rounded-sm text-xs font-mono shrink-0 whitespace-nowrap",
                    active ? "bg-primary-glow" : "bg-bg-elevated"
                  )}
                  style={{
                    border: `1px solid ${active ? item.color : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                  title={item.label}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span style={{ color: active ? item.color : "var(--text-secondary)" }}>
                    {isMobile ? (item.text || item.key.slice(0, 3)) : item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Shape tools + controls row */}
          <div className="flex gap-1 items-center overflow-x-auto scrollbar-none">
            {SHAPE_TOOLS.map(({ key, icon, label }) =>
              toolBtn(key, icon, label, isActive(key))
            )}

            <div className="w-px h-5 bg-border mx-1 shrink-0" />

            {/* Line width */}
            <input
              type="range"
              min="1"
              max="8"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 shrink-0"
              title={`Width: ${lineWidth}`}
            />

            <div className="w-px h-5 bg-border mx-1 shrink-0" />

            {/* Color swatches */}
            <div className="flex gap-0.5 shrink-0">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setLegendItem(null); }}
                  className="w-5 h-5 rounded-full border-2 cursor-pointer shrink-0"
                  style={{
                    background: c,
                    borderColor: color === c ? "var(--primary)" : "var(--border)",
                  }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => { setColor(e.target.value); setLegendItem(null); }}
                className="w-5 h-5 rounded cursor-pointer shrink-0"
                style={{ padding: 0, border: "none" }}
              />
            </div>

            <div className="flex-1" />

            {/* Actions */}
            <button
              onClick={handleUndo}
              disabled={annotations.length === 0}
              className="flex items-center gap-1 py-1 px-2 bg-bg-elevated border border-border rounded-sm text-xs font-mono shrink-0 cursor-pointer disabled:opacity-40"
            >
              <Icon n="undo" size={13} color="var(--text-secondary)" />
              {!isMobile && "Undo"}
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="flex items-center gap-1 py-1 px-2 bg-bg-elevated border border-border rounded-sm text-xs font-mono shrink-0 cursor-pointer disabled:opacity-40"
              style={{ transform: "scaleX(-1)" }}
              title="Redo"
            >
              <Icon n="undo" size={13} color="var(--text-secondary)" />
            </button>
            {showToggle && (
              <button
                onClick={() => setShowAnnotations(v => !v)}
                className={cn(
                  "flex items-center gap-1 py-1 px-2 border rounded-sm text-xs font-mono shrink-0 cursor-pointer",
                  showAnnotations ? "bg-primary-glow border-primary text-primary" : "bg-bg-elevated border-border text-text-secondary"
                )}
              >
                <Icon n="eye" size={13} color={showAnnotations ? "var(--primary)" : "var(--text-secondary)"} />
                {!isMobile && "Annotations"}
              </button>
            )}
            <button
              onClick={handleClear}
              disabled={annotations.length === 0}
              className="flex items-center gap-1 py-1 px-2 bg-bg-elevated border border-border rounded-sm text-xs font-mono shrink-0 cursor-pointer disabled:opacity-40"
            >
              <Icon n="trash" size={13} color="var(--text-secondary)" />
              {!isMobile && "Clear"}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 py-1 px-2 bg-bg-elevated border border-border rounded-sm text-xs font-mono shrink-0 cursor-pointer"
            >
              <Icon n="x" size={13} color="var(--text-secondary)" />
              {!isMobile && "Cancel"}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 py-1 px-2.5 bg-primary border border-primary rounded-sm text-xs font-mono font-bold text-white shrink-0 cursor-pointer"
            >
              <Icon n="check" size={13} color="#fff" />
              Save
            </button>
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={wrapRef}
          className="flex-1 flex items-center justify-center overflow-auto p-2"
        >
          {!ready && (
            <div className="flex flex-col items-center gap-2 text-text-muted font-mono text-sm">
              <Icon n="camera" size={32} color="var(--text-muted)" />
              Loading photo...
            </div>
          )}
          <div className="relative" style={{ width: dims.w || 0, height: dims.h || 0, display: ready ? "block" : "none" }}>
            <canvas
              ref={bgCanvasRef}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            />
            <canvas
              ref={overlayRef}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                touchAction: "none",
                cursor: activeTool === "text" ? "text" : (activeTool || legendItem) ? "crosshair" : "default",
              }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={(e) => { if (drawing.current) onUp(e); }}
            />
            {textInput && (
              <input
                autoFocus
                className="absolute bg-transparent border-none outline-none z-10"
                style={{
                  left: textInput.x * 100 + "%",
                  top: textInput.y * 100 + "%",
                  color,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 16,
                  caretColor: "var(--primary)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitText(e.target.value);
                  if (e.key === "Escape") setTextInput(null);
                }}
                onBlur={(e) => commitText(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
