import * as XLSX from "xlsx";
import {
  emptyPhotos, emptyAgreement, emptyBuildingInfo,
  emptyBuildingOwner, emptyDistributionZone, emptyFacadeStreet,
  emptyExistingTelecom, emptyExecutionQuantities,
} from "../data/mockSurveys";

/**
 * Parse an uploaded Excel/CSV file into an array of address objects.
 * Expects columns: BUILDING_ID, STREET, BM_HOUSENUMBER, Postcode,
 * MUNICIPALITY, LAT, LON, IS_ELIGIBLE_TO_BE_INCLUDED_IN_FTTH_DESIGN
 */
export async function parseAddressFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const addresses = rows
    .filter((r) => {
      const eligible = r.IS_ELIGIBLE_TO_BE_INCLUDED_IN_FTTH_DESIGN;
      if (eligible === undefined) return true;
      return String(eligible).toLowerCase() === "yes" || eligible === 1 || eligible === true;
    })
    .map((r) => ({
      tsg_id: String(r.BUILDING_ID || r.building_id || r.TSG_ID || r.tsg_id || "").trim(),
      street: String(r.STREET || r.street || r.Street || "").trim(),
      number: String(r.BM_HOUSENUMBER || r.housenumber || r.Number || r.number || "").trim(),
      postal_code: String(r.Postcode || r.postcode || r.POSTCODE || r.postal_code || "").trim(),
      city: String(r.MUNICIPALITY || r.municipality || r.City || r.city || "").trim(),
      lat: parseFloat(r.LAT || r.lat || r.Lat || 0) || 50.78 + Math.random() * 0.04,
      lng: parseFloat(r.LON || r.lon || r.Lon || r.LNG || r.lng || 0) || 3.03 + Math.random() * 0.04,
      selected: true,
    }));

  return {
    addresses,
    metadata: {
      fileName: file.name,
      totalRows: rows.length,
      eligibleRows: addresses.length,
      sheetName: workbook.SheetNames[0],
    },
  };
}

/**
 * Convert a parsed address into a full survey stub object.
 */
export function addressToSurvey(addr, projectId) {
  return {
    id: Date.now() + Math.floor(Math.random() * 10000),
    project_id: projectId,
    tsg_id: addr.tsg_id,
    building_id: `BLD-${addr.tsg_id}`,
    address: {
      street: addr.street,
      number: addr.number,
      bus: "",
      postal_code: addr.postal_code,
      city: addr.city,
      lat: addr.lat,
      lng: addr.lng,
    },
    status: "to_do",
    assigned_surveyor: "",
    assigned_date: new Date().toISOString().split("T")[0],
    scheduled_time: "",
    distance_km: 0,
    priority: false,
    visits: [],
    appointment: null,
    client: { company: "Wyre NV", contact_name: "", contact_phone: "", contact_email: "", contractor: "" },
    building_owner: emptyBuildingOwner(),
    building_info: emptyBuildingInfo(),
    distribution_zone: emptyDistributionZone(),
    facade_street: emptyFacadeStreet(),
    existing_telecom: emptyExistingTelecom(),
    execution_quantities: emptyExecutionQuantities(),
    photos: emptyPhotos(),
    engineering_plans: [],
    agreement: emptyAgreement(),
    completed_sections: [],
    editing: {},
    rework_remarks: "",
    validated_by: null,
    validated_at: null,
    completed_by: null,
    completed_at: null,
    assigned_subcontractor: null,
    assigned_subcontractor_date: null,
  };
}
