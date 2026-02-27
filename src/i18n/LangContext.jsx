import { createContext, useContext } from "react";
import { TRANSLATIONS } from "./translations";

export const LangCtx = createContext({ lang: "en", t: (k) => k });
export const useLang = () => useContext(LangCtx);

export const LangToggle = ({ lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const next = lang === "en" ? "nl" : "en";
  const flags = { en: "\u{1F1EC}\u{1F1E7}", nl: "\u{1F1F3}\u{1F1F1}" };
  return (
    <button className="lang-toggle" title={t.langTitle} onClick={() => setLang(next)}>
      <span className="lang-flag">{flags[next]}</span>
      <span className="lang-toggle-label">{t.langLabel}</span>
    </button>
  );
};
