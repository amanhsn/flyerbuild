import { ICON_PATHS } from "./paths";

export const Icon = ({ n, size = 18, color = "currentColor", style: s = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}>
    {(ICON_PATHS[n] || "").split(" M").map((d, i) => <path key={i} d={(i ? "M" : "") + d} />)}
  </svg>
);
