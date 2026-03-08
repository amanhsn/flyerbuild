// ---------------------------------------------------------------------------
// pricingRegistry.js — Wyre Surveyor Portal
// Centralized pricing for all 10 execution quantity line items.
// Maps mock-data keys (snake_case) to form keys (camelCase) and unit prices.
// ---------------------------------------------------------------------------

export const PRICING_REGISTRY = [
  { code: "PC-001", key: "cost_lead_in_trench",         formKey: "leadInTrench",         label: "Lead-in Trench",         unit: "m",    unitPrice: 45.00 },
  { code: "PC-002", key: "diamond_drilling_cost",       formKey: "diamondDrilling",       label: "Diamond Drilling",       unit: "unit", unitPrice: 85.00 },
  { code: "PC-003", key: "wall_penetration_cost",       formKey: "wallPenetration",       label: "Wall Penetration",       unit: "unit", unitPrice: 35.00 },
  { code: "PC-004", key: "cable_ducts_60x100_cost",     formKey: "cableDucts60x100",     label: "Cable Ducts 60×100",     unit: "m",    unitPrice: 22.00 },
  { code: "PC-005", key: "cable_ducts_12x20_cost",      formKey: "cableDucts12x20",      label: "Cable Ducts 12×20",      unit: "m",    unitPrice: 15.00 },
  { code: "PC-006", key: "cable_ducts_40x40_cost",      formKey: "cableDucts40x40",      label: "Cable Ducts 40×40",      unit: "m",    unitPrice: 18.00 },
  { code: "PC-007", key: "cable_ducts_60x40_cost",      formKey: "cableDucts60x40",      label: "Cable Ducts 60×40",      unit: "m",    unitPrice: 20.00 },
  { code: "PC-008", key: "fire_retardant_conduit_cost", formKey: "fireRetardantConduit", label: "Fire Retardant Conduit", unit: "unit", unitPrice: 55.00 },
  { code: "PC-009", key: "co_flex_cost",                formKey: "coFlex",               label: "Co-Flex",                unit: "m",    unitPrice: 12.00 },
  { code: "PC-010", key: "floorbox_cost",               formKey: "floorbox",             label: "Floorbox",               unit: "unit", unitPrice: 120.00 },
];

export function getEstimatedCost(survey) {
  const eq = survey.execution_quantities || {};
  const items = PRICING_REGISTRY.map((p) => {
    const qty = eq[p.key] || 0;
    return { ...p, qty, cost: qty * p.unitPrice };
  });
  const total = items.reduce((s, i) => s + i.cost, 0);
  return { items, total };
}

export function getActualCost(survey) {
  const aq = survey.actual_quantities || {};
  const items = PRICING_REGISTRY.map((p) => {
    const qty = aq[p.key] || 0;
    return { ...p, qty, cost: qty * p.unitPrice };
  });
  const total = items.reduce((s, i) => s + i.cost, 0);
  return { items, total };
}

export function getComparisonData(survey) {
  const est = getEstimatedCost(survey);
  const act = getActualCost(survey);

  const items = PRICING_REGISTRY.map((p, i) => {
    const estQty = est.items[i].qty;
    const actQty = act.items[i].qty;
    const estCost = est.items[i].cost;
    const actCost = act.items[i].cost;
    const variancePct = estCost > 0
      ? Math.round(((actCost - estCost) / estCost) * 100)
      : actCost > 0 ? 100 : 0;

    return {
      code: p.code,
      label: p.label,
      unit: p.unit,
      unitPrice: p.unitPrice,
      estQty,
      actQty,
      estCost,
      actCost,
      variancePct,
    };
  });

  const totalEst = est.total;
  const totalAct = act.total;
  const overallVariance = totalEst > 0
    ? Math.round(((totalAct - totalEst) / totalEst) * 100)
    : 0;
  const accuracy = Math.max(0, 100 - Math.abs(overallVariance));

  return { items, totalEst, totalAct, overallVariance, accuracy };
}

export function formatEur(value) {
  return `€${value.toFixed(2)}`;
}
