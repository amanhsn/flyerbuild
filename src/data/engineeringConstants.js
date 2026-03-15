// ---------------------------------------------------------------------------
// engineeringConstants.js — Engineering Gate dropdown options
// DB7 and SubDuct colour options are PENDING CONFIRMATION from Mustafa Imran.
// Placeholder values based on jetting plan PDF references (DB7 GR- / DB7 OR-).
// Update this file once confirmed — no structural code changes required.
// ---------------------------------------------------------------------------

export const DB7_OPTIONS = [
  { value: "orange", label: "Orange (DB7 OR-)" },
  { value: "green", label: "Green (DB7 GR-)" },
  // TODO: Awaiting confirmation from @Mustafa Imran
];

export const SUBDUCT_COLOR_OPTIONS = [
  { value: "orange", label: "Orange" },
  { value: "green", label: "Green" },
  { value: "grey", label: "Grey" },
  { value: "blue", label: "Blue" },
  // TODO: Awaiting confirmation from @Mustafa Imran
];

// Splicing document types
export const SPLICING_TYPES = ["PDP", "DP", "POC", "BUDI", "Floorboxes"];
