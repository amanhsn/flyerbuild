import { useState, createContext, useContext } from "react";

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // App shell
    appName:          "Fyberbuild",
    appRole:          "Surveyor Portal",
    online:           "Online",
    offline:          "Offline",
    syncDone:         "Synced 2 min ago",
    syncPending:      "3 changes queued",
    syncOnline:       "Online · Connected",
    syncOffline:      "Offline · Saved locally",

    // Nav
    navScope:         "My Scope",
    navMap:           "Map",
    navHistory:       "History",
    navProfile:       "Profile",

    // Queue
    queueTitle:       "My Scope",
    queueDate:        "FRI 28 FEB",
    queueSurveyor:    "Jonas Jacobs",
    queueCount:       (n) => `${n} assignments today`,
    downloadTomorrow: "Download Tomorrow",
    downloadSub:      "6 assignments available · 47 MB",
    downloadFetch:    "Fetch",
    filterAll:        "All",
    filterBusy:       "In Progress",
    filterWaiting:    "Waiting",
    filterConflict:   "Conflict",
    filterDone:       "Done",

    // Status badges
    statusPending:    "Waiting",
    statusInprogress: "In Progress",
    statusDone:       "Completed",
    statusConflict:   "Conflict",

    // Survey card
    selectPromptTitle:"Select an Assignment",
    selectPromptSub:  "Choose an address from the list to open the survey",

    // Survey detail
    backToScope:      "My Scope",
    completed:        "completed",
    buildingWarning:  "Linked Building",
    buildingWarnSub:  (addr) => `Shares a basement with ${addr}`,

    // Section tabs & titles
    sec_connectable:  "Connectable?",
    sec_address:      "Address Correct?",
    sec_conntype:     "Connection Type",
    sec_connection:   "Connection",
    sec_function:     "Building Function",
    sec_units:        "Units",
    sec_remarks:      "Remarks",
    sec_photos:       "Photos",

    // Section short labels (tabs)
    short_connectable:"Connectable",
    short_address:    "Address",
    short_conntype:   "Type",
    short_connection: "Connection",
    short_function:   "Function",
    short_units:      "Units",
    short_remarks:    "Remarks",
    short_photos:     "Photos",

    // Section detail
    client:           "Client",
    fyber:            "Fyber",
    saved:            "Saved",
    filled:           "✓ Filled",
    notFilled:        "—",
    edit:             "Edit",
    savedLabel:       "Saved",

    // Connectable
    secConnTitle:     "Is this address connectable?",
    yes:              "Yes",
    no:               "No",

    // Address
    secAddrTitle:     "Is the address correct?",
    street:           "Street",
    number:           "No.",
    postalCode:       "Postal Code",
    city:             "City",

    // Connection type
    secConntypeTitle: "Connection Type",
    unclear:          "Unclear",
    underground:      "Underground",
    facade:           "Façade",
    pole:             "Pole",
    poleNote:         "Public connection via pole",

    // Connection
    secConnectionTitle: "Connection",
    connectionPlaceholder: "Connection details...",

    // Function
    secFunctionTitle: "Building Function",
    residential:      "Residential",
    commercial:       "Commercial",

    // Units
    unitsTitle:       "Units",
    unitsSub:         "SDU · 1 unit",
    addUnit:          "Add Unit",
    currentUnit:      "Current",

    // Remarks
    remarksTitle:     "Remarks",
    remarksPlaceholder: "Add remarks...",
    refusalTitle:     "Log Refusal",
    refusalSub:       "Client refused access or cooperation",
    refusalBtn:       "Log",

    // Photos
    photosTitle:      "Photos",
    photosUploaded:   "3/4 uploaded",
    photoFacade:      "Facade View",
    photoPavement:    "Pavement",
    photoMailboxes:   "Mailboxes",
    photoExtra:       "Extra Photo",
    signaturesTitle:  "Signatures",
    sigSurveyor:      "Surveyor — Jonas Jacobs",
    sigClient:        "Client / Owner",
    signHere:         "Sign here",

    // CTA
    previous:         "← Previous",
    markDone:         "Mark Complete →",
    submit:           "Submit Survey",
    alreadyDone:      "✓ Completed",

    // History
    historyTitle:     "Visit History",

    // Profile
    region:           "Region",
    todayDone:        "Completed Today",
    syncStatus:       "Sync Status",
    offlineCache:     "Offline Cache",

    // Map
    mapTitle:         "Map View",
    mapSub:           "GIS map with status cluster display",

    // Lang toggle
    langLabel:        "NL",
    langTitle:        "Switch to Dutch",
  },

  nl: {
    appName:          "Fyberbuild",
    appRole:          "Surveyor Portaal",
    online:           "Online",
    offline:          "Offline",
    syncDone:         "Gesynchroniseerd 2 min geleden",
    syncPending:      "3 wijzigingen in wachtrij",
    syncOnline:       "Online · Verbonden",
    syncOffline:      "Offline · Lokaal opgeslagen",

    navScope:         "Mijn Scope",
    navMap:           "Kaart",
    navHistory:       "Historie",
    navProfile:       "Profiel",

    queueTitle:       "Mijn Scope",
    queueDate:        "VR 28 FEB",
    queueSurveyor:    "Jonas Jacobs",
    queueCount:       (n) => `${n} opdrachten vandaag`,
    downloadTomorrow: "Download morgen",
    downloadSub:      "6 opdrachten beschikbaar · 47 MB",
    downloadFetch:    "Ophalen",
    filterAll:        "Alles",
    filterBusy:       "Bezig",
    filterWaiting:    "Wachten",
    filterConflict:   "Conflict",
    filterDone:       "Klaar",

    statusPending:    "Wachten",
    statusInprogress: "Bezig",
    statusDone:       "Voltooid",
    statusConflict:   "Conflict",

    selectPromptTitle:"Selecteer een opdracht",
    selectPromptSub:  "Kies een adres uit de lijst om het survey te openen",

    backToScope:      "Mijn Scope",
    completed:        "voltooid",
    buildingWarning:  "Gekoppeld gebouw",
    buildingWarnSub:  (addr) => `Deelt een kelder met ${addr}`,

    sec_connectable:  "Aansluitbaar?",
    sec_address:      "Adres Correct?",
    sec_conntype:     "Aansluittpe",
    sec_connection:   "Aansluiting",
    sec_function:     "Functie gebouw",
    sec_units:        "Units",
    sec_remarks:      "Opmerkingen",
    sec_photos:       "Foto's",

    short_connectable:"Aansluitbaar",
    short_address:    "Adres",
    short_conntype:   "Type",
    short_connection: "Aansl.",
    short_function:   "Functie",
    short_units:      "Units",
    short_remarks:    "Opmerk.",
    short_photos:     "Foto's",

    client:           "Klant",
    fyber:            "Fyber",
    saved:            "Opgeslagen",
    filled:           "✓ Ingevuld",
    notFilled:        "—",
    edit:             "Bewerk",
    savedLabel:       "Opgeslagen",

    secConnTitle:     "Is het adres aansluitbaar?",
    yes:              "Ja",
    no:               "Nee",

    secAddrTitle:     "Is het adres correct?",
    street:           "Straat",
    number:           "Nr.",
    postalCode:       "Postcode",
    city:             "Gemeente",

    secConntypeTitle: "Aansluittpe",
    unclear:          "Onduidelijk",
    underground:      "Underground",
    facade:           "Façade",
    pole:             "Pole",
    poleNote:         "Publieke aansluiting via pole",

    secConnectionTitle: "Aansluiting",
    connectionPlaceholder: "Details aansluiting...",

    secFunctionTitle: "Functie gebouw",
    residential:      "Woonfunctie",
    commercial:       "Zakelijk",

    unitsTitle:       "Units",
    unitsSub:         "SDU · 1 eenheid",
    addUnit:          "Toevoegen",
    currentUnit:      "Huidig",

    remarksTitle:     "Opmerkingen",
    remarksPlaceholder: "Voeg opmerkingen toe...",
    refusalTitle:     "Weigering registreren",
    refusalSub:       "Klant weigerde toegang of medewerking",
    refusalBtn:       "Registreer",

    photosTitle:      "Foto's",
    photosUploaded:   "3/4 geüpload",
    photoFacade:      "Gevelaanzicht",
    photoPavement:    "Bestrating",
    photoMailboxes:   "Brievenbussen",
    photoExtra:       "Extra foto",
    signaturesTitle:  "Handtekeningen",
    sigSurveyor:      "Surveyor — Jonas Jacobs",
    sigClient:        "Klant / Eigenaar",
    signHere:         "Teken hier",

    previous:         "← Vorige",
    markDone:         "Voltooien →",
    submit:           "Indienen",
    alreadyDone:      "✓ Voltooid",

    historyTitle:     "Bezoekhistorie",

    region:           "Regio",
    todayDone:        "Vandaag voltooid",
    syncStatus:       "Sync status",
    offlineCache:     "Offline cache",

    mapTitle:         "Kaartweergave",
    mapSub:           "GIS-kaart met clusterweergave per status",

    langLabel:        "EN",
    langTitle:        "Switch to English",
  },
};

// ─── LANGUAGE CONTEXT ─────────────────────────────────────────────────────────
const LangCtx = createContext({ lang: "en", t: (k) => k });
const useLang = () => useContext(LangCtx);

// ─── FONTS & CSS ──────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }

  :root {
    --font-display: 'DM Sans', sans-serif;
    --font-body:    'DM Sans', sans-serif;
    --font-mono:    'JetBrains Mono', monospace;
    --radius-sm:    4px;
    --radius-md:    8px;
    --radius-lg:    12px;
    --radius-xl:    16px;
    --sidebar-w:    260px;
    --topbar-h:     56px;
    --bg-base:       #f5f6f8;
    --bg-raised:     #ffffff;
    --bg-elevated:   #f0f1f4;
    --bg-overlay:    #e4e6eb;
    --border:        #dce0e6;
    --border-bright: #c4c9d4;
    --primary:       #c0392b;
    --primary-dim:   #f5d5d2;
    --primary-glow:  rgba(192,57,43,0.08);
    --green:         #059669;
    --green-dim:     #d1fae5;
    --green-glow:    rgba(5,150,105,0.06);
    --red:           #dc2626;
    --red-dim:       #fee2e2;
    --red-glow:      rgba(220,38,38,0.06);
    --blue:          #2563eb;
    --blue-glow:     rgba(37,99,235,0.06);
    --text-primary:        #1e293b;
    --text-secondary:      #64748b;
    --text-muted:          #94a3b8;
    --text-primary-accent: #c0392b;
    --text-green:          #059669;
    --text-red:            #dc2626;
  }
  [data-theme="dark"] {
    --bg-base:       #0e1117;
    --bg-raised:     #161b24;
    --bg-elevated:   #1e2535;
    --bg-overlay:    #252d3d;
    --border:        #2a3348;
    --border-bright: #3d4f6e;
    --primary:       #e74c3c;
    --primary-dim:   #922b21;
    --primary-glow:  rgba(231,76,60,0.12);
    --green:         #10b981;
    --green-dim:     #065f46;
    --green-glow:    rgba(16,185,129,0.12);
    --red:           #ef4444;
    --red-dim:       #7f1d1d;
    --red-glow:      rgba(239,68,68,0.12);
    --blue:          #3b82f6;
    --blue-glow:     rgba(59,130,246,0.12);
    --text-primary:        #f1f5f9;
    --text-secondary:      #94a3b8;
    --text-muted:          #4b5563;
    --text-primary-accent: #e74c3c;
    --text-green:          #34d399;
    --text-red:            #f87171;
  }

  body { background: var(--bg-base); color: var(--text-primary); font-family: var(--font-body); overflow: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 2px; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes pulseDot  { 0%,100% { opacity:1; } 50% { opacity:.35; } }
  @keyframes langFlip  { from { opacity:0; transform:scale(.9); } to { opacity:1; transform:scale(1); } }

  .fade-up { animation: fadeUp .28s ease both; }
  .fade-in { animation: fadeIn .2s ease both; }
  .lang-flip { animation: langFlip .2s ease both; }

  /* ── LAYOUT ── */
  .app-shell {
    display: grid;
    grid-template-rows: var(--topbar-h) 1fr auto;
    grid-template-columns: 1fr;
    height: 100vh;
    overflow: hidden;
  }
  .app-topbar {
    grid-column: 1/-1; grid-row: 1;
    display: flex; align-items: center;
    padding: 0 20px; gap: 16px;
    background: var(--bg-raised);
    border-bottom: 1px solid var(--border);
    z-index: 40;
  }
  .app-body { grid-row: 2; display: flex; overflow: hidden; }
  .app-syncbar { grid-row: 3; grid-column: 1/-1; }

  /* Sidebar */
  .sidebar {
    width: var(--sidebar-w); flex-shrink: 0;
    background: var(--bg-raised);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden;
  }
  .sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 0; }
  .sidebar-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 20px; cursor: pointer;
    font-family: var(--font-body); font-size: 14px; font-weight: 500;
    color: var(--text-secondary);
    border-left: 3px solid transparent;
    transition: all .15s;
    background: none; border-top: none; border-right: none; border-bottom: none;
    width: 100%; text-align: left;
  }
  .sidebar-nav-item.active { color: var(--text-primary-accent); border-left-color: var(--primary); background: var(--primary-glow); }
  .sidebar-nav-item:hover:not(.active) { background: var(--bg-elevated); color: var(--text-primary); }

  /* Bottom nav – mobile only */
  .bottom-nav { display: none; border-top: 1px solid var(--border); background: var(--bg-raised); }
  .bottom-nav-item {
    flex: 1; padding: 11px 8px 9px;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); transition: color .15s;
    font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  }
  .bottom-nav-item.active { color: var(--text-primary-accent); }

  .main-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
  .content-split { display: flex; flex: 1; overflow: hidden; }

  .queue-panel {
    width: 380px; flex-shrink: 0;
    border-right: 1px solid var(--border);
    overflow-y: auto; display: flex; flex-direction: column;
  }
  .detail-panel { flex: 1; overflow: hidden; display: flex; flex-direction: column; }

  /* Responsive */
  @media (max-width: 767px) {
    .sidebar { display: none; }
    .bottom-nav { display: flex; }
    .queue-panel { width: 100%; border-right: none; }
    .queue-panel.hidden-mobile { display: none; }
    .detail-panel.hidden-mobile { display: none; }
    .detail-panel { width: 100%; }
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    :root { --sidebar-w: 60px; }
    .sidebar-nav-item { justify-content: center; padding: 13px 0; }
    .sidebar-label { display: none; }
    .sidebar-logo-text { display: none; }
    .sidebar-user-info { display: none; }
    .queue-panel { width: 300px; }
  }
  @media (min-width: 1024px) { .queue-panel { width: 360px; } }
  @media (min-width: 1280px) { .queue-panel { width: 420px; } }

  /* Components */
  .survey-card {
    background: var(--bg-raised); border-radius: var(--radius-lg);
    border: 1px solid var(--border); padding: 16px; cursor: pointer;
    transition: border-color .15s, background .15s; margin-bottom: 8px;
  }
  .survey-card:hover { background: var(--bg-elevated); }
  .survey-card.conflict { border-color: var(--red-dim); }
  .survey-card.priority { border-color: var(--primary-dim); }
  .survey-card.selected { border-color: var(--primary); background: var(--primary-glow); }

  .toggle-btn {
    padding: 12px 20px; border-radius: var(--radius-md);
    border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-secondary);
    font-family: var(--font-display); font-size: 17px; font-weight: 700; letter-spacing: .03em;
    cursor: pointer; transition: all .15s;
  }
  .toggle-btn:disabled { opacity: .55; cursor: default; }
  .toggle-btn.primary.active { background: var(--primary); border-color: var(--primary); color: #fff; }
  .toggle-btn.green.active { background: var(--green); border-color: var(--green); color: #fff; }
  .toggle-btn.red.active   { background: var(--red);   border-color: var(--red);   color: #fff; }

  .filter-btn {
    font-family: var(--font-body); font-size: 12px; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
    padding: 7px 13px; border-radius: var(--radius-sm);
    border: none; white-space: nowrap; cursor: pointer; transition: all .15s;
    background: var(--bg-elevated); color: var(--text-secondary);
  }
  .filter-btn.active { background: var(--primary); color: #fff; }

  .field-input {
    width: 100%; padding: 10px 12px;
    background: var(--bg-elevated); border: 1px solid var(--border-bright);
    border-radius: var(--radius-md); color: var(--text-primary);
    font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color .15s;
  }
  .field-input:focus { border-color: var(--primary); }
  .field-input:disabled { background: var(--bg-overlay); border-color: var(--border); }
  textarea.field-input { resize: vertical; }

  .section-card { border-radius: var(--radius-xl); border: 1px solid var(--border); background: var(--bg-raised); overflow: hidden; }
  .section-card.done { border-color: var(--green-dim); background: rgba(16,185,129,.04); }

  .cta-btn {
    flex: 1; padding: 14px 20px; border: none; border-radius: var(--radius-md);
    font-family: var(--font-display); font-size: 18px; font-weight: 800;
    letter-spacing: .04em; cursor: pointer; transition: all .2s;
  }
  .cta-btn.primary    { background: var(--primary); color: #fff; }
  .cta-btn.done-state { background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border); }
  .cta-btn.secondary  { background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-secondary); flex: 0 0 auto; padding: 14px 18px; font-size: 16px; }

  .photo-slot {
    border-radius: var(--radius-lg); overflow: hidden;
    border: 1px solid var(--border); background: var(--bg-elevated);
    aspect-ratio: 4/3; cursor: pointer;
    display: flex; flex-direction: column; transition: border-color .15s;
  }
  .photo-slot:hover { border-color: var(--border-bright); }
  .photo-slot.missing-required { border-color: var(--red-dim); }

  /* Lang toggle button */
  .lang-toggle {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 11px; border-radius: var(--radius-sm);
    background: var(--bg-overlay); border: 1px solid var(--border-bright);
    cursor: pointer; transition: all .15s;
    font-family: var(--font-body); font-size: 11px; font-weight: 600;
    letter-spacing: .06em; color: var(--text-secondary);
  }
  .lang-toggle:hover { border-color: var(--primary); color: var(--text-primary-accent); background: var(--primary-glow); }
  .lang-flag { font-size: 14px; line-height: 1; }

  @media (max-width: 767px) {
    .bottom-nav { display: flex !important; }
    .app-syncbar:not(.bottom-nav) { display: none; }
  }
`;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const P = {
  map:"M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
  list:"M4 6h16M4 10h16M4 14h16M4 18h16",
  chevR:"M9 5l7 7-7 7",
  check:"M5 13l4 4L19 7",
  x:"M6 18L18 6M6 6l12 12",
  camera:"M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0",
  wifi:"M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01",
  wifiOff:"M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01",
  alert:"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  user:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  nav:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0",
  clock:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  download:"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  pen:"M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  plus:"M12 4v16m8-8H4",
  sig:"M3 17l4-4 4 4 4-8 4 4M3 21h18",
  star:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  info:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  flag:"M3 21V4m0 0l9-1 9 1v13l-9-1-9 1V4z",
  globe:"M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};
const Icon = ({ n, size=18, color="currentColor", style:s={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}>
    {(P[n]||"").split(" M").map((d,i) => <path key={i} d={(i?"M":"")+d} />)}
  </svg>
);

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const mono  = (sz=12, col="var(--text-muted)", extra={}) => ({ fontFamily:"var(--font-body)", fontSize:sz, color:col, ...extra });
const disp  = (sz=18, fw=700, col="var(--text-primary)", extra={}) => ({ fontFamily:"var(--font-display)", fontSize:sz, fontWeight:fw, letterSpacing:"0.02em", color:col, ...extra });

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const { t } = useLang();
  const m = {
    pending:    { label:t("statusPending"),    bg:"var(--bg-overlay)", text:"var(--text-secondary)", border:"var(--border)" },
    inprogress: { label:t("statusInprogress"), bg:"var(--blue-glow)",  text:"var(--blue)",           border:"var(--blue)" },
    done:       { label:t("statusDone"),       bg:"var(--green-glow)", text:"var(--text-green)",     border:"var(--green-dim)" },
    conflict:   { label:t("statusConflict"),   bg:"var(--red-glow)",   text:"var(--text-red)",       border:"var(--red-dim)" },
  };
  const s = m[status] || m.pending;
  return (
    <span style={{ ...mono(11, s.text), fontWeight:600, letterSpacing:".08em", textTransform:"uppercase",
      padding:"3px 8px", borderRadius:"var(--radius-sm)", background:s.bg, border:`1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
};

const MiniProgress = ({ val, total, status }) => (
  <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
    <div style={{ flex:1, height:3, background:"var(--bg-overlay)", borderRadius:2 }}>
      <div style={{ width:`${(val/total)*100}%`, height:"100%", borderRadius:2, transition:"width .4s ease",
        background: status==="done"?"var(--green)":status==="conflict"?"var(--red)":"var(--primary)" }} />
    </div>
    <span style={mono(11,"var(--text-muted)",{flexShrink:0})}>{val}/{total}</span>
  </div>
);

const SyncBar = ({ online }) => {
  const { t } = useLang();
  return (
    <div className="app-syncbar" style={{
      display:"flex", alignItems:"center", gap:10, padding:"7px 20px",
      background: online?"rgba(16,185,129,.06)":"rgba(192,57,43,.06)",
      borderTop:`1px solid ${online?"var(--green-dim)":"var(--primary-dim)"}`,
    }}>
      <Icon n={online?"wifi":"wifiOff"} size={13} color={online?"var(--text-green)":"var(--text-primary-accent)"} />
      <span style={mono(11, online?"var(--text-green)":"var(--text-primary-accent)")}>{online?t("syncOnline"):t("syncOffline")}</span>
      <span style={{ ...mono(10), marginLeft:"auto" }}>{online?t("syncDone"):t("syncPending")}</span>
      <div style={{ width:7, height:7, borderRadius:"50%",
        background:online?"var(--green)":"var(--primary)",
        animation:online?"none":"pulseDot 2s infinite" }} />
    </div>
  );
};

// ─── LANGUAGE TOGGLE ─────────────────────────────────────────────────────────
const LangToggle = ({ lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const next = lang === "en" ? "nl" : "en";
  const flags = { en: "🇬🇧", nl: "🇳🇱" };
  return (
    <button className="lang-toggle" title={t.langTitle} onClick={() => setLang(next)}>
      <span className="lang-flag">{flags[next]}</span>
      <span>{t.langLabel}</span>
    </button>
  );
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SURVEYS = [
  { id:1, address:"Geluwesesteenweg 158", city:"Wervik",  code:"WERK-03", dist:"1.2 km", time:"09:00", status:"inprogress", sections:3, total:8, priority:true },
  { id:2, address:"Nieuwstraat 44",       city:"Wervik",  code:"WERK-07", dist:"2.8 km", time:"10:30", status:"pending",    sections:0, total:8, priority:false },
  { id:3, address:"Leiestraat 12B",       city:"Menen",   code:"MEN-02",  dist:"4.1 km", time:"11:00", status:"pending",    sections:0, total:8, priority:false },
  { id:4, address:"Kortrijksesteenweg 5", city:"Wervik",  code:"WERK-11", dist:"3.5 km", time:"13:00", status:"conflict",   sections:5, total:8, priority:true },
  { id:5, address:"Stationsplein 2",      city:"Menen",   code:"MEN-09",  dist:"6.7 km", time:"14:30", status:"done",       sections:8, total:8, priority:false },
];

const SECTIONS = [
  { key:"connectable" },
  { key:"address"     },
  { key:"conntype"    },
  { key:"connection"  },
  { key:"function"    },
  { key:"units"       },
  { key:"remarks"     },
  { key:"photos"      },
];

// ─── QUEUE PANEL ─────────────────────────────────────────────────────────────
const QueuePanel = ({ selectedId, onSelect, mobileHidden }) => {
  const { t } = useLang();
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? SURVEYS : SURVEYS.filter(s => s.status===filter);

  const filters = [
    ["all",        t("filterAll")],
    ["inprogress", t("filterBusy")],
    ["pending",    t("filterWaiting")],
    ["conflict",   t("filterConflict")],
    ["done",       t("filterDone")],
  ];

  return (
    <div className={`queue-panel${mobileHidden?" hidden-mobile":""}`}>
      <div style={{ padding:"20px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4 }}>
          <h1 style={disp(30,800)}>{t("queueTitle")}</h1>
          <span style={{ ...mono(11,"var(--text-muted)"), background:"var(--bg-elevated)",
            padding:"3px 8px", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)" }}>
            {t("queueDate")}
          </span>
        </div>
        <p style={mono(12,"var(--text-secondary)",{marginTop:5})}>
          {t("queueSurveyor")} · {t("queueCount")(SURVEYS.length)}
        </p>
      </div>

      {/* Download tomorrow */}
      <div style={{ margin:"14px 20px 0", padding:"12px 16px", borderRadius:"var(--radius-md)",
        background:"var(--bg-elevated)", border:"1px solid var(--border)",
        display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
        <Icon n="download" size={15} color="var(--text-primary-accent)" />
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--font-body)", fontWeight:600, fontSize:14 }}>{t("downloadTomorrow")}</div>
          <div style={mono(11,"var(--text-secondary)",{marginTop:2})}>{t("downloadSub")}</div>
        </div>
        <span style={{ ...mono(11,"var(--text-primary-accent)"), background:"var(--primary-glow)",
          padding:"4px 10px", borderRadius:"var(--radius-sm)", border:"1px solid var(--primary-dim)" }}>
          {t("downloadFetch")}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:6, padding:"12px 20px", overflowX:"auto", flexShrink:0 }}>
        {filters.map(([v,l]) => (
          <button key={v} className={`filter-btn${filter===v?" active":""}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 20px 20px" }}>
        {filtered.map((s,i) => (
          <div key={s.id}
            className={`survey-card${s.status==="conflict"?" conflict":s.priority?" priority":""}${selectedId===s.id?" selected":""} fade-up`}
            style={{ animationDelay:`${i*.04}s` }}
            onClick={() => onSelect(s)}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6, flexWrap:"wrap" }}>
                  {s.priority && <Icon n="star" size={12} color="var(--text-primary-accent)" />}
                  <StatusBadge status={s.status} />
                  <span style={mono(11,"var(--text-muted)")}>{s.code}</span>
                </div>
                <div style={disp(19,700)}>{s.address}</div>
                <div style={mono(12,"var(--text-secondary)",{marginTop:3})}>{s.city}</div>
              </div>
              <Icon n="chevR" size={16} color="var(--text-muted)" style={{ flexShrink:0, marginTop:4 }} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:13,
              paddingTop:11, borderTop:"1px solid var(--border)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Icon n="clock" size={12} color="var(--text-muted)" />
                <span style={mono(11,"var(--text-secondary)")}>{s.time}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Icon n="nav" size={12} color="var(--text-muted)" />
                <span style={mono(11,"var(--text-secondary)")}>{s.dist}</span>
              </div>
              <MiniProgress val={s.sections} total={s.total} status={s.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── EMPTY DETAIL ─────────────────────────────────────────────────────────────
const EmptyDetail = () => {
  const { t } = useLang();
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", gap:16, padding:48, textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:16, background:"var(--bg-elevated)",
        border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon n="list" size={28} color="var(--text-muted)" />
      </div>
      <div>
        <div style={disp(22,700)}>{t("selectPromptTitle")}</div>
        <div style={{ fontFamily:"var(--font-body)", fontSize:14, color:"var(--text-secondary)", marginTop:6 }}>
          {t("selectPromptSub")}
        </div>
      </div>
    </div>
  );
};

// ─── TOGGLE BTN ───────────────────────────────────────────────────────────────
const TBtn = ({ label, variant="primary", active, onClick, disabled }) => (
  <button className={`toggle-btn ${variant}${active?" active":""}`} onClick={onClick} disabled={disabled}>{label}</button>
);

// ─── FIELD ────────────────────────────────────────────────────────────────────
const Field = ({ label, value, disabled, flex }) => (
  <div style={{ flex:flex||1 }}>
    <div style={mono(11,"var(--text-muted)",{textTransform:"uppercase",letterSpacing:".08em",marginBottom:5})}>{label}</div>
    <input className="field-input" defaultValue={value} disabled={disabled} />
  </div>
);

// ─── SECTION CARD WRAPPER ─────────────────────────────────────────────────────
const SectionCard = ({ title, sectionKey, completed, editing, setEditing, clientValue, children }) => {
  const { t } = useLang();
  const isDone = !!completed[sectionKey];
  const isEditing = !!editing[sectionKey];
  return (
    <div className={`section-card${isDone&&!isEditing?" done":""} fade-up`}>
      <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)",
        background:"var(--bg-elevated)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={disp(18,700)}>{title}</div>
          {isDone && !isEditing && (
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}>
              <Icon n="check" size={11} color="var(--text-green)" />
              <span style={mono(11,"var(--text-green)")}>{t("savedLabel")}</span>
            </div>
          )}
        </div>
        {isDone && !isEditing && (
          <button onClick={() => setEditing(p => ({...p,[sectionKey]:true}))} style={{
            display:"flex", alignItems:"center", gap:6, padding:"7px 12px",
            borderRadius:"var(--radius-sm)", background:"var(--bg-overlay)",
            border:"1px solid var(--border)", color:"var(--text-secondary)",
            ...mono(11), cursor:"pointer",
          }}>
            <Icon n="pen" size={12} /> {t("edit")}
          </button>
        )}
      </div>
      <div style={{ padding:"9px 16px", background:"var(--bg-overlay)", borderBottom:"1px solid var(--border)",
        display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <span style={mono(11,"var(--text-muted)",{textTransform:"uppercase",letterSpacing:".08em"})}>{t("client")}</span>
        <span style={{ ...mono(12,"var(--text-secondary)"), padding:"2px 8px",
          background:"var(--bg-elevated)", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)" }}>
          {clientValue}
        </span>
        <span style={mono(11,"var(--text-muted)",{textTransform:"uppercase",letterSpacing:".08em",marginLeft:8})}>{t("fyber")}</span>
        <span style={{ ...mono(12, isDone?"var(--text-green)":"var(--text-muted)"),
          padding:"2px 8px", borderRadius:"var(--radius-sm)",
          background:isDone?"var(--green-glow)":"transparent",
          border:`1px solid ${isDone?"var(--green-dim)":"var(--border)"}` }}>
          {isDone ? t("filled") : t("notFilled")}
        </span>
      </div>
      <div style={{ padding:"16px" }}>{children}</div>
    </div>
  );
};

// ─── SECTION CONTENTS ─────────────────────────────────────────────────────────
const UnitsSection = () => {
  const { t } = useLang();
  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={disp(22,800)}>{t("unitsTitle")}</div>
          <div style={mono(11,"var(--text-secondary)",{marginTop:3})}>{t("unitsSub")}</div>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px",
          borderRadius:"var(--radius-md)", background:"var(--bg-elevated)", border:"1px solid var(--border)",
          color:"var(--text-secondary)", ...mono(12), cursor:"pointer" }}>
          <Icon n="plus" size={13} /> {t("addUnit")}
        </button>
      </div>
      <div style={{ padding:"14px 16px", borderRadius:"var(--radius-lg)",
        background:"var(--bg-elevated)", border:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <div style={disp(17,700)}>Geluwesesteenweg 158</div>
            <div style={mono(11,"var(--text-secondary)",{marginTop:3})}>8940 Wervik</div>
          </div>
          <span style={{ ...mono(11,"var(--text-primary-accent)"), background:"var(--primary-glow)",
            padding:"3px 8px", borderRadius:"var(--radius-sm)", border:"1px solid var(--primary-dim)" }}>
            {t("currentUnit")}
          </span>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          {["Residential","Underground"].map(tag => (
            <span key={tag} style={{ ...mono(11,"var(--text-muted)"), background:"var(--bg-overlay)",
              padding:"3px 8px", borderRadius:"var(--radius-sm)", border:"1px solid var(--border)" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const RemarksSection = () => {
  const { t } = useLang();
  return (
    <div className="fade-up">
      <div style={{ ...disp(22,800), marginBottom:14 }}>{t("remarksTitle")}</div>
      <textarea className="field-input" placeholder={t("remarksPlaceholder")} rows={5}
        style={{ width:"100%", marginBottom:12 }} />
      <div style={{ padding:"12px 14px", borderRadius:"var(--radius-md)",
        background:"var(--red-glow)", border:"1px solid var(--red-dim)",
        display:"flex", alignItems:"center", gap:12 }}>
        <Icon n="flag" size={14} color="var(--text-red)" />
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--font-body)", fontWeight:600, fontSize:13, color:"var(--text-red)" }}>
            {t("refusalTitle")}
          </div>
          <div style={mono(11,"var(--text-secondary)",{marginTop:2})}>{t("refusalSub")}</div>
        </div>
        <button style={{ padding:"7px 12px", background:"var(--bg-elevated)", border:"1px solid var(--red-dim)",
          borderRadius:"var(--radius-sm)", color:"var(--text-red)", ...mono(11), cursor:"pointer" }}>
          {t("refusalBtn")}
        </button>
      </div>
    </div>
  );
};

const PhotosSection = () => {
  const { t } = useLang();
  const slots = [
    { label:t("photoFacade"),    req:true,  filled:true },
    { label:t("photoPavement"),  req:true,  filled:true },
    { label:t("photoMailboxes"), req:false, filled:true },
    { label:t("photoExtra"),     req:false, filled:false },
  ];
  return (
    <div className="fade-up">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={disp(22,800)}>{t("photosTitle")}</div>
        <span style={mono(11,"var(--text-secondary)")}>{t("photosUploaded")}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:10, marginBottom:20 }}>
        {slots.map((sl,i) => (
          <div key={i} className={`photo-slot${!sl.filled&&sl.req?" missing-required":""}`}>
            {sl.filled ? (
              <>
                <div style={{ flex:1, background:"linear-gradient(135deg,var(--bg-overlay),var(--bg-elevated))",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon n="camera" size={26} color="var(--text-muted)" />
                </div>
                <div style={{ padding:"7px 10px", background:"var(--bg-overlay)",
                  display:"flex", justifyContent:"space-between", ...mono(11,"var(--text-secondary)") }}>
                  <span>{sl.label}</span>
                  <span style={{ color:"var(--text-green)" }}>✓</span>
                </div>
              </>
            ) : (
              <div style={{ flex:1, display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", gap:6, margin:8,
                border:`2px dashed ${sl.req?"var(--red-dim)":"var(--border)"}`,
                borderRadius:"var(--radius-lg)" }}>
                <Icon n="plus" size={20} color={sl.req?"var(--text-red)":"var(--text-muted)"} />
                <span style={{ ...mono(11,sl.req?"var(--text-red)":"var(--text-muted)"), textAlign:"center" }}>
                  {sl.label}{sl.req&&" *"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Signatures */}
      <div style={{ padding:16, borderRadius:"var(--radius-xl)", background:"var(--bg-elevated)", border:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <Icon n="sig" size={16} color="var(--text-primary-accent)" />
          <span style={disp(19,700)}>{t("signaturesTitle")}</span>
        </div>
        {[t("sigSurveyor"), t("sigClient")].map((lbl,i) => (
          <div key={i} style={{ marginBottom:i===0?12:0, padding:"12px 14px",
            borderRadius:"var(--radius-md)", background:"var(--bg-overlay)", border:"1px solid var(--border)" }}>
            <div style={mono(11,"var(--text-muted)",{textTransform:"uppercase",letterSpacing:".08em",marginBottom:8})}>{lbl}</div>
            <div style={{ height:60, borderRadius:"var(--radius-sm)", border:"1px dashed var(--border-bright)",
              display:"flex", alignItems:"center", justifyContent:"center", ...mono(11) }}>
              {t("signHere")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SURVEY DETAIL ────────────────────────────────────────────────────────────
const SurveyDetail = ({ survey, onBack }) => {
  const { t } = useLang();
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState({ connectable:true, address:true });
  const [editing, setEditing] = useState({});
  const [answers, setAnswers] = useState({ connectable:"ja", conntype:"pole", function:"residential" });
  const [showBanner, setShowBanner] = useState(true);

  const completedCount = Object.keys(completed).length;
  const curKey = SECTIONS[activeSection].key;
  const dis = (k) => !!completed[k] && !editing[k];

  const markDone = (key) => {
    setCompleted(p => ({...p,[key]:true}));
    setEditing(p => ({...p,[key]:false}));
    if (activeSection < SECTIONS.length-1) setTimeout(() => setActiveSection(s => s+1), 200);
  };

  const sectionTitle = (key) => t(`sec_${key}`);
  const sectionShort = (key) => t(`short_${key}`);

  return (
    <div className="detail-panel" style={{ position:"relative" }}>
      {/* Hero */}
      <div style={{ padding:"14px 24px 0", background:"var(--bg-elevated)",
        borderBottom:"1px solid var(--border)", flexShrink:0 }}>
        <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:5,
          background:"none", border:"none", cursor:"pointer", color:"var(--text-secondary)",
          ...mono(11), marginBottom:10, padding:0 }}>
          <Icon n="chevR" size={12} style={{ transform:"rotate(180deg)" }} color="var(--text-secondary)" />
          {t("backToScope")}
        </button>

        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5, flexWrap:"wrap" }}>
              <StatusBadge status="inprogress" />
              <span style={mono(11,"var(--text-muted)")}>{survey.code}</span>
            </div>
            <h2 style={disp(26,800)}>{survey.address}</h2>
            <div style={mono(12,"var(--text-secondary)",{marginTop:3})}>{survey.city}</div>
            <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap" }}>
              {[["nav",survey.dist],["clock",survey.time],["nav","50.7972, 3.0592"]].map(([icon,val],i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <Icon n={icon} size={12} color="var(--text-muted)" />
                  <span style={mono(11,"var(--text-secondary)")}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:40, fontWeight:800,
              color:"var(--text-primary-accent)", lineHeight:1 }}>{completedCount}/{SECTIONS.length}</div>
            <div style={mono(11,"var(--text-muted)")}>{t("completed")}</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height:3, background:"var(--bg-overlay)", marginTop:12 }}>
          <div style={{ height:"100%", background:"var(--primary)",
            width:`${(completedCount/SECTIONS.length)*100}%`, transition:"width .4s ease" }} />
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", overflowX:"auto" }}>
          {SECTIONS.map((s,i) => {
            const isAct = i===activeSection, isDone = !!completed[s.key];
            return (
              <button key={s.key} onClick={() => setActiveSection(i)} style={{
                flexShrink:0, padding:"10px 13px", background:"none", border:"none", cursor:"pointer",
                ...mono(11, isAct?"var(--text-primary-accent)":isDone?"var(--text-green)":"var(--text-muted)",
                  {fontWeight:600, letterSpacing:".04em", textTransform:"uppercase"}),
                borderBottom:isAct?"2px solid var(--primary)":"2px solid transparent",
                display:"flex", alignItems:"center", gap:5, transition:"all .15s",
              }}>
                {isDone && <Icon n="check" size={10} color="var(--text-green)" />}
                {sectionShort(s.key)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 24px 100px" }}>
        {showBanner && (
          <div style={{ padding:"12px 14px", borderRadius:"var(--radius-md)", marginBottom:16,
            background:"var(--primary-glow)", border:"1px solid var(--primary-dim)",
            display:"flex", alignItems:"flex-start", gap:10 }} className="fade-up">
            <Icon n="alert" size={15} color="var(--text-primary-accent)" style={{ flexShrink:0, marginTop:1 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"var(--font-body)", fontWeight:600, fontSize:13, color:"var(--text-primary-accent)" }}>
                {t("buildingWarning")}
              </div>
              <div style={mono(11,"var(--text-secondary)",{marginTop:3})}>
                {t("buildingWarnSub")(<span style={{ color:"var(--text-primary)", textDecoration:"underline", cursor:"pointer" }}>Geluwesesteenweg 158-A</span>)}
              </div>
            </div>
            <button onClick={() => setShowBanner(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)", padding:0 }}>
              <Icon n="x" size={14} />
            </button>
          </div>
        )}

        {activeSection===0 && (
          <SectionCard title={sectionTitle("connectable")} sectionKey="connectable"
            completed={completed} editing={editing} setEditing={setEditing} clientValue="YES">
            <div style={{ display:"flex", gap:10, marginTop:4, flexWrap:"wrap" }}>
              <TBtn label={t("yes")} variant="green" active={answers.connectable==="ja"} disabled={dis("connectable")}
                onClick={() => setAnswers(p=>({...p,connectable:"ja"}))} />
              <TBtn label={t("no")} variant="red" active={answers.connectable==="nee"} disabled={dis("connectable")}
                onClick={() => setAnswers(p=>({...p,connectable:"nee"}))} />
            </div>
          </SectionCard>
        )}

        {activeSection===1 && (
          <SectionCard title={sectionTitle("address")} sectionKey="address"
            completed={completed} editing={editing} setEditing={setEditing} clientValue="Geluwesesteenweg 158 — 8940 Wervik">
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
              <Field label={t("street")} value="Geluwesesteenweg" disabled={dis("address")} />
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <Field label={t("number")} value="158" disabled={dis("address")} flex="0 0 80px" />
                <Field label={t("postalCode")} value="8940" disabled={dis("address")} />
                <Field label={t("city")} value="Wervik" disabled={dis("address")} />
              </div>
            </div>
          </SectionCard>
        )}

        {activeSection===2 && (
          <SectionCard title={sectionTitle("conntype")} sectionKey="conntype"
            completed={completed} editing={editing} setEditing={setEditing} clientValue="Unclear">
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
              {[["unclear",t("unclear")],["underground",t("underground")],["facade",t("facade")],["pole",t("pole")]].map(([v,l]) => (
                <TBtn key={v} label={l} variant="primary" disabled={dis("conntype")}
                  active={answers.conntype===v}
                  onClick={() => setAnswers(p=>({...p,conntype:v}))} />
              ))}
            </div>
            {answers.conntype==="pole" && (
              <div style={{ marginTop:12, padding:"10px 14px", borderRadius:"var(--radius-md)",
                background:"var(--bg-overlay)", border:"1px solid var(--border)",
                display:"flex", alignItems:"center", gap:8, ...mono(12,"var(--text-secondary)") }}>
                <Icon n="info" size={13} color="var(--text-primary-accent)" />
                {t("poleNote")}
              </div>
            )}
          </SectionCard>
        )}

        {activeSection===3 && (
          <SectionCard title={sectionTitle("connection")} sectionKey="connection"
            completed={completed} editing={editing} setEditing={setEditing} clientValue="Unclear">
            <textarea className="field-input" placeholder={t("connectionPlaceholder")} rows={4}
              disabled={dis("connection")} style={{ width:"100%", marginTop:8 }} />
          </SectionCard>
        )}

        {activeSection===4 && (
          <SectionCard title={sectionTitle("function")} sectionKey="function"
            completed={completed} editing={editing} setEditing={setEditing} clientValue="Residential">
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:4 }}>
              <TBtn label={t("residential")} variant="primary" disabled={dis("function")}
                active={answers.function==="residential"}
                onClick={() => setAnswers(p=>({...p,function:"residential"}))} />
              <TBtn label={t("commercial")} variant="primary" disabled={dis("function")}
                active={answers.function==="commercial"}
                onClick={() => setAnswers(p=>({...p,function:"commercial"}))} />
            </div>
          </SectionCard>
        )}

        {activeSection===5 && <UnitsSection />}
        {activeSection===6 && <RemarksSection />}
        {activeSection===7 && <PhotosSection />}
      </div>

      {/* Bottom CTA */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 24px 16px",
        background:"linear-gradient(180deg,transparent 0%,var(--bg-base) 45%)",
        display:"flex", gap:10 }}>
        {activeSection>0 && (
          <button className="cta-btn secondary" onClick={() => setActiveSection(s=>s-1)}>
            {t("previous")}
          </button>
        )}
        <button className={`cta-btn ${completed[curKey]?"done-state":"primary"}`}
          onClick={() => markDone(curKey)}>
          {completed[curKey]
            ? t("alreadyDone")
            : activeSection===SECTIONS.length-1 ? t("submit") : t("markDone")}
        </button>
      </div>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const SidebarNav = ({ active, setActive }) => {
  const { t } = useLang();
  const items = [
    ["queue", "list",    t("navScope")],
    ["map",   "map",     t("navMap")],
    ["history","clock",  t("navHistory")],
    ["profile","user",   t("navProfile")],
  ];
  return (
    <div className="sidebar">
      <div style={{ padding:"0 0 12px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"var(--radius-sm)", background:"var(--primary)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon n="layers" size={16} color="#000" />
          </div>
          <div className="sidebar-logo-text">
            <div style={disp(14,800,undefined,{letterSpacing:".06em",textTransform:"uppercase",lineHeight:1})}>
              {t("appName")}
            </div>
            <div style={mono(11,"var(--text-muted)",{textTransform:"uppercase",letterSpacing:".1em"})}>
              Surveyor
            </div>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map(([id,icon,lbl]) => (
          <button key={id} className={`sidebar-nav-item${active===id?" active":""}`} onClick={() => setActive(id)}>
            <Icon n={icon} size={18} color="currentColor" />
            <span className="sidebar-label">{lbl}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding:"12px 20px", borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--primary)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontWeight:800, fontSize:13, color:"#fff", flexShrink:0 }}>JJ</div>
          <div className="sidebar-user-info">
            <div style={{ fontFamily:"var(--font-body)", fontWeight:600, fontSize:13 }}>Jonas Jacobs</div>
            <div style={mono(11,"var(--text-muted)",{marginTop:1})}>v2.4.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PLACEHOLDER SCREENS ──────────────────────────────────────────────────────
const PlaceholderScreen = ({ icon, title, sub }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", gap:14, padding:40, textAlign:"center" }}>
    <div style={{ width:64, height:64, borderRadius:16, background:"var(--bg-elevated)",
      border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Icon n={icon} size={28} color="var(--text-muted)" />
    </div>
    <div>
      <div style={disp(22,700)}>{title}</div>
      <div style={{ fontFamily:"var(--font-body)", fontSize:14, color:"var(--text-secondary)", marginTop:6 }}>{sub}</div>
    </div>
  </div>
);

const HistoryScreen = () => {
  const { t } = useLang();
  return (
    <div style={{ flex:1, overflowY:"auto", padding:24 }}>
      <h2 style={{ ...disp(28,800), marginBottom:16 }}>{t("historyTitle")}</h2>
      {[["Feb 26","Stationsplein 2","done"],["Feb 25","Leiestraat 8","done"],["Feb 24","Nieuwstraat 11","conflict"]].map(([d,a,s],i) => (
        <div key={i} style={{ padding:"14px 16px", marginBottom:8, borderRadius:"var(--radius-lg)",
          background:"var(--bg-raised)", border:"1px solid var(--border)",
          display:"flex", alignItems:"center", gap:14 }}>
          <div style={mono(11,"var(--text-muted)",{flexShrink:0, width:52})}>{d}</div>
          <div style={{ flex:1, ...disp(17,600) }}>{a}</div>
          <StatusBadge status={s} />
        </div>
      ))}
    </div>
  );
};

const ProfileScreen = () => {
  const { t } = useLang();
  return (
    <div style={{ flex:1, padding:24, maxWidth:480 }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:"var(--primary)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"var(--font-display)", fontSize:22, fontWeight:800, color:"#fff" }}>JJ</div>
        <div>
          <div style={disp(22,800)}>Jonas Jacobs</div>
          <div style={mono(11,"var(--text-secondary)",{marginTop:3})}>Surveyor · Fyber v2.4.0</div>
        </div>
      </div>
      {[[t("region"),"WERK / MEN"],[t("todayDone"),"2/5"],[t("syncStatus"),"Online"],[t("offlineCache"),"47 MB"]].map(([k,v]) => (
        <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"14px 0", borderBottom:"1px solid var(--border)" }}>
          <span style={{ fontFamily:"var(--font-body)", fontSize:15, color:"var(--text-secondary)" }}>{k}</span>
          <span style={mono(13)}>{v}</span>
        </div>
      ))}
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function SurveyorPortal() {
  const [lang, setLang] = useState("en");
  const [navTab, setNavTab] = useState("queue");
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const online = true;

  const t = (key) => {
    const val = TRANSLATIONS[lang][key];
    return typeof val === "function" ? val : (val ?? key);
  };

  const handleSelect = (s) => { setSelectedSurvey(s); setMobileShowDetail(true); };
  const handleBack   = ()  => { setMobileShowDetail(false); };
  const handleNav    = (id) => { setNavTab(id); if (id !== "queue") setMobileShowDetail(false); };

  const navItems = [
    ["queue",   "list",  t("navScope")],
    ["map",     "map",   t("navMap")],
    ["history", "clock", t("navHistory")],
    ["profile", "user",  t("navProfile")],
  ];

  return (
    <LangCtx.Provider value={{ lang, t }}>
      <style>{FONTS}{CSS}</style>
      <div className="app-shell">

        {/* Top bar */}
        <header className="app-topbar">
          <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
            <div style={{ width:30, height:30, borderRadius:"var(--radius-sm)", background:"var(--primary)",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon n="layers" size={15} color="#000" />
            </div>
            <div>
              <div style={disp(14,800,undefined,{letterSpacing:".06em",textTransform:"uppercase",lineHeight:1})}>
                {t("appName")}
              </div>
              <div style={mono(11,"var(--text-muted)",{textTransform:"uppercase",letterSpacing:".1em"})}>
                {t("appRole")}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            {/* Language toggle */}
            <LangToggle lang={lang} setLang={setLang} />

            <div style={{ display:"flex", alignItems:"center", gap:6, ...mono(11,"var(--text-green)") }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--green)" }} />
              {t("online")}
            </div>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--bg-elevated)",
              border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"var(--font-display)", fontWeight:800, fontSize:12, color:"var(--text-primary-accent)" }}>JJ</div>
          </div>
        </header>

        {/* Body */}
        <div className="app-body">
          <SidebarNav active={navTab} setActive={handleNav} />
          <main className="main-content">
            {navTab==="queue" && (
              <div className="content-split">
                <QueuePanel selectedId={selectedSurvey?.id} onSelect={handleSelect}
                  mobileHidden={mobileShowDetail} />
                <div className={`detail-panel${!mobileShowDetail?" hidden-mobile":""}`}
                  style={{ display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
                  {selectedSurvey ? <SurveyDetail survey={selectedSurvey} onBack={handleBack} /> : <EmptyDetail />}
                </div>
              </div>
            )}
            {navTab==="map"     && <PlaceholderScreen icon="map"   title={t("mapTitle")}     sub={t("mapSub")} />}
            {navTab==="history" && <HistoryScreen />}
            {navTab==="profile" && <ProfileScreen />}
          </main>
        </div>

        {/* Bottom nav – mobile */}
        <nav className="bottom-nav app-syncbar">
          {navItems.map(([id,icon,lbl]) => (
            <button key={id} className={`bottom-nav-item${navTab===id?" active":""}`} onClick={() => handleNav(id)}>
              <Icon n={icon} size={20} />
              {lbl}
            </button>
          ))}
        </nav>

        <SyncBar online={online} />
      </div>
    </LangCtx.Provider>
  );
}
