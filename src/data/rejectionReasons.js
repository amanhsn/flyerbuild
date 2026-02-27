// ---------------------------------------------------------------------------
// rejectionReasons.js — Predefined reason codes for validator rejections
// ---------------------------------------------------------------------------

export const REJECTION_REASONS = [
  {
    code: "MISSING_PHOTOS",
    label: "Missing Photos",
    labelNl: "Ontbrekende Foto's",
    description: "One or more required photo sections are incomplete",
  },
  {
    code: "MISSING_SIGNATURE",
    label: "Missing Signature",
    labelNl: "Ontbrekende Handtekening",
    description: "Owner or subcontractor signature is missing",
  },
  {
    code: "INCORRECT_UNIT_COUNT",
    label: "Incorrect Unit Count",
    labelNl: "Onjuist Aantal Eenheden",
    description: "The living/business unit count does not match reality",
  },
  {
    code: "INCORRECT_FLOOR_COUNT",
    label: "Incorrect Floor Count",
    labelNl: "Onjuist Aantal Verdiepingen",
    description: "The floor count is wrong or inconsistent",
  },
  {
    code: "MISSING_QUANTITIES",
    label: "Missing Execution Quantities",
    labelNl: "Ontbrekende Uitvoeringsaantallen",
    description: "Execution quantity fields are empty or clearly wrong",
  },
  {
    code: "POOR_PHOTO_QUALITY",
    label: "Poor Photo Quality",
    labelNl: "Slechte Fotokwaliteit",
    description: "Photos are blurry, too dark, or do not show required details",
  },
  {
    code: "INCOMPLETE_SECTIONS",
    label: "Incomplete Sections",
    labelNl: "Onvolledige Secties",
    description: "One or more required sections were not completed",
  },
  {
    code: "DATA_INCONSISTENCY",
    label: "Data Inconsistency",
    labelNl: "Gegevensinconsistentie",
    description: "Information conflicts between sections",
  },
  {
    code: "OTHER",
    label: "Other",
    labelNl: "Overig",
    description: "See free-text notes for details",
  },
];

export function getReasonByCode(code) {
  return REJECTION_REASONS.find(r => r.code === code);
}
