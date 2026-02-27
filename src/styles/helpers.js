export const mono = (sz = 12, col = "var(--text-muted)", extra = {}) => ({
  fontFamily: "var(--font-body)", fontSize: sz, color: col, ...extra,
});

export const disp = (sz = 18, fw = 700, col = "var(--text-primary)", extra = {}) => ({
  fontFamily: "var(--font-display)", fontSize: sz, fontWeight: fw, letterSpacing: "0.02em", color: col, ...extra,
});
