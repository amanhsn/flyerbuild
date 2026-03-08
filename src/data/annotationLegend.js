// Wyre-specific annotation legend elements matching PDF2 output

export const ANNOTATION_LEGEND_ITEMS = [
  { key: "groene_lijnen", label: "Groene lijnen (40x40 kabel)", color: "#22c55e", shape: "line", dash: null },
  { key: "gele_lijnen", label: "Gele lijnen (12x20 klant)", color: "#eab308", shape: "line", dash: null },
  { key: "rode_lijnen", label: "Rode lijnen (invoerbuis)", color: "#ef4444", shape: "line", dash: null },
  { key: "budi", label: "BUDI", color: "#3b82f6", shape: "labelRect", text: "B" },
  { key: "floorbox", label: "Floorbox", color: "#eab308", shape: "labelRect", text: "F" },
  { key: "poc", label: "POC", color: "#22c55e", shape: "labelRect", text: "P" },
  { key: "intro", label: "Intro", color: "#ef4444", shape: "labelRect", text: "Intro" },
  { key: "stippellijnen_groen", label: "Stippellijnen groen", color: "#22c55e", shape: "line", dash: [6, 4] },
  { key: "stippellijnen_geel", label: "Stippellijnen geel", color: "#eab308", shape: "line", dash: [6, 4] },
  { key: "stippellijnen_rood", label: "Stippellijnen rood", color: "#ef4444", shape: "line", dash: [6, 4] },
  { key: "units", label: "Units", color: "#6b7280", shape: "labelRect", text: "UNIT" },
  { key: "verticale_doorboring", label: "Verticale Doorboring", color: "#22c55e", shape: "circle" },
  { key: "horizontale_doorboring", label: "Horizontale Doorboring", color: "#eab308", shape: "circle" },
];

export const SHAPE_TOOLS = [
  { key: "freehand", label: "Freehand", icon: "pen" },
  { key: "line", label: "Line", icon: "minus" },
  { key: "dashedLine", label: "Dashed", icon: "minus" },
  { key: "text", label: "Text", icon: "type" },
  { key: "circle", label: "Circle", icon: "circle" },
  { key: "rect", label: "Rect", icon: "rect" },
  { key: "triangle", label: "Triangle", icon: "triangle" },
  { key: "diamond", label: "Diamond", icon: "diamond" },
];

export const COLOR_PRESETS = [
  "#22c55e", "#eab308", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#1e293b", "#ffffff",
];
