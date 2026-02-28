/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        "bg-base":       "var(--bg-base)",
        "bg-raised":     "var(--bg-raised)",
        "bg-elevated":   "var(--bg-elevated)",
        "bg-overlay":    "var(--bg-overlay)",
        border:          "var(--border)",
        "border-bright": "var(--border-bright)",
        primary: {
          DEFAULT: "var(--primary)",
          dim:     "var(--primary-dim)",
          glow:    "var(--primary-glow)",
        },
        green: {
          DEFAULT: "var(--green)",
          dim:     "var(--green-dim)",
          glow:    "var(--green-glow)",
        },
        red: {
          DEFAULT: "var(--red)",
          dim:     "var(--red-dim)",
          glow:    "var(--red-glow)",
        },
        blue: {
          DEFAULT: "var(--blue)",
          glow:    "var(--blue-glow)",
        },
        "text-primary":        "var(--text-primary)",
        "text-secondary":      "var(--text-secondary)",
        "text-muted":          "var(--text-muted)",
        "text-primary-accent": "var(--text-primary-accent)",
        "text-green":          "var(--text-green)",
        "text-red":            "var(--text-red)",
        "card-shadow":         "var(--card-shadow)",
      },
      fontFamily: {
        display: ["'DM Sans'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        sm:  "var(--radius-sm)",
        md:  "var(--radius-md)",
        lg:  "var(--radius-lg)",
        xl:  "var(--radius-xl)",
      },
      spacing: {
        xs:    "var(--space-xs)",
        sm:    "var(--space-sm)",
        md:    "var(--space-md)",
        lg:    "var(--space-lg)",
        xl:    "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        sidebar: "var(--sidebar-w)",
        topbar:  "var(--topbar-h)",
      },
      boxShadow: {
        card: "0 2px 8px var(--card-shadow)",
      },
      keyframes: {
        fadeUp:   { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
        langFlip: { from: { opacity: "0", transform: "scale(.9)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer:  { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
      },
      animation: {
        "fade-up":   "fadeUp .28s ease both",
        "fade-in":   "fadeIn .2s ease both",
        "pulse-dot": "pulseDot 1.4s ease infinite",
        "lang-flip": "langFlip .2s ease both",
        shimmer:     "shimmer 1.5s ease infinite",
      },
    },
  },
  plugins: [],
};
