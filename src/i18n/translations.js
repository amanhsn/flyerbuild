// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
// Merged: original Fyberbuild Surveyor Portal + Wyre site-survey sections
// ────────────────────────────────────────────────────────────────────────────────

export const TRANSLATIONS = {
  en: {
    // ── App shell ────────────────────────────────────────────────────────────
    appName:              "Fyberbuild",
    appRole:              "Surveyor Portal",
    online:               "Online",
    offline:              "Offline",
    syncDone:             "Synced 2 min ago",
    syncPending:          "3 changes queued",
    syncOnline:           "Online \u00b7 Connected",
    syncOffline:          "Offline \u00b7 Saved locally",

    // ── Nav ──────────────────────────────────────────────────────────────────
    navDashboard:         "Dashboard",
    navScope:             "My Scope",
    navMap:               "Map",
    navHistory:           "History",
    navProfile:           "Profile",

    // ── Queue ────────────────────────────────────────────────────────────────
    queueTitle:           "My Scope",
    queueDate:            "FRI 28 FEB",
    queueSurveyor:        "Jonas Jacobs",
    queueCount:           (n) => `${n} assignments today`,
    downloadTomorrow:     "Download Tomorrow",
    downloadSub:          "6 assignments available \u00b7 47 MB",
    downloadFetch:        "Fetch",

    // ── Filters ──────────────────────────────────────────────────────────────
    filterAll:            "All",
    filterBusy:           "In Progress",
    filterWaiting:        "Waiting",
    filterConflict:       "Conflict",
    filterDone:           "Done",
    filterActive:         "Active",
    filterPending:        "Pending",
    filterReview:         "Review",
    filterIssues:         "Issues",

    // ── Status badges (15 Wyre statuses) ─────────────────────────────────────
    statusInactive:           "Inactive",
    statusSv:                 "SV",
    statusNa:                 "N/A",
    statusToDo:               "To Do",
    statusAppointment:        "Appointment",
    statusOnGoing:            "Ongoing",
    statusVisited:            "Visited",
    statusRework:             "Rework",
    statusValidationF49:      "Validation F49",
    statusValidationClient:   "Validation Client",
    statusSent:               "Sent",
    statusCompleted:          "Completed",
    statusRejected:           "Rejected",
    statusFinalNoEntry:       "Final No Entry",
    statusNoTsaNd:            "No TSA/ND",

    // ── Legacy status badges (kept for backward compat) ──────────────────────
    statusPending:        "Waiting",
    statusInprogress:     "In Progress",
    statusDone:           "Completed",
    statusConflict:       "Conflict",

    // ── Survey card ──────────────────────────────────────────────────────────
    selectPromptTitle:    "Select an Assignment",
    selectPromptSub:      "Choose an address from the list to open the survey",

    // ── Survey detail ────────────────────────────────────────────────────────
    backToDashboard:      "Dashboard",
    completed:            "completed",
    buildingWarning:      "Linked Building",
    buildingWarnSub:      (addr) => `Shares a basement with ${addr}`,

    // ── Original section tabs & titles (Fyberbuild) ──────────────────────────
    sec_connectable:      "Connectable?",
    sec_address:          "Address Correct?",
    sec_conntype:         "Connection Type",
    sec_connection:       "Connection",
    sec_function:         "Building Function",
    sec_units:            "Units",
    sec_remarks:          "Remarks",
    sec_photos:           "Photos",

    short_connectable:    "Connectable",
    short_address:        "Address",
    short_conntype:       "Type",
    short_connection:     "Connection",
    short_function:       "Function",
    short_units:          "Units",
    short_remarks:        "Remarks",
    short_photos:         "Photos",

    // ── Section detail (legacy) ──────────────────────────────────────────────
    client:               "Client",
    fyber:                "Fyber",
    savedLabel:           "Saved",

    // ── Connectable ──────────────────────────────────────────────────────────
    secConnTitle:         "Is this address connectable?",

    // ── Address ──────────────────────────────────────────────────────────────
    secAddrTitle:         "Is the address correct?",
    number:               "No.",

    // ── Connection type ──────────────────────────────────────────────────────
    secConntypeTitle:     "Connection Type",
    unclear:              "Unclear",
    pole:                 "Pole",
    poleNote:             "Public connection via pole",

    // ── Connection ───────────────────────────────────────────────────────────
    secConnectionTitle:   "Connection",
    connectionPlaceholder:"Connection details...",

    // ── Function ─────────────────────────────────────────────────────────────
    secFunctionTitle:     "Building Function",
    residential:          "Residential",
    commercial:           "Commercial",

    // ── Units ────────────────────────────────────────────────────────────────
    unitsTitle:           "Units",
    unitsSub:             "SDU \u00b7 1 unit",
    addUnit:              "Add Unit",
    currentUnit:          "Current",

    // ── Remarks ──────────────────────────────────────────────────────────────
    remarksTitle:         "Remarks",
    remarksPlaceholder:   "Add remarks...",
    refusalTitle:         "Log Refusal",
    refusalSub:           "Client refused access or cooperation",
    refusalBtn:           "Log",

    // ── Photos (legacy) ──────────────────────────────────────────────────────
    photosTitle:          "Photos",
    photosUploaded:       "3/4 uploaded",
    photoFacade:          "Facade View",
    photoPavement:        "Pavement",
    photoMailboxes:       "Mailboxes",
    photoExtra:           "Extra Photo",
    signaturesTitle:      "Signatures",
    sigSurveyor:          "Surveyor \u2014 Jonas Jacobs",
    sigClient:            "Client / Owner",

    // ── CTA ──────────────────────────────────────────────────────────────────
    previous:             "\u2190 Previous",
    saveAndContinue:      "Save & Continue \u2192",
    submit:               "Submit Survey",
    alreadyDone:          "\u2713 Completed",

    // ── History ──────────────────────────────────────────────────────────────
    historyTitle:         "Visit History",

    // ── Profile ──────────────────────────────────────────────────────────────
    region:               "Region",
    todayDone:            "Completed Today",
    syncStatus:           "Sync Status",
    offlineCache:         "Offline Cache",

    // ── Map ──────────────────────────────────────────────────────────────────
    mapTitle:             "Map View",
    mapSub:               "GIS map with status cluster display",

    // ── Lang toggle ──────────────────────────────────────────────────────────
    langLabel:            "NL",
    langTitle:            "Switch to Dutch",

    // ═════════════════════════════════════════════════════════════════════════
    // WYRE SITE SURVEY — 22 Section Names (full)
    // ═════════════════════════════════════════════════════════════════════════
    sec_visit_info:           "Information about Visit",
    sec_appointment_info:     "Appointments",
    sec_client_info:          "Client Information",
    sec_building_owner:       "Building Owner / V.M.E",
    sec_building_info:        "MDU / Building Information",
    sec_distribution_zone:    "Info Zone \u2013 Distribution",
    sec_facade_street:        "Facade & Street",
    sec_existing_telecom:     "Existing Telecom",
    sec_execution_quantities: "Quantities for Execution",
    sec_legend:               "Legend",
    sec_photo_facade:         "Photo Facade",
    sec_photo_letterbox:      "Photo Letterbox",
    sec_floorplan_canvas:     "Floorplan",
    sec_bordje_syndic:        "Syndic Sign",
    sec_fire_department:      "Fire Department Plan",
    sec_underground_intro:    "Underground Introduction",
    sec_facade_distribution:  "Facade Distribution",
    sec_technical_room:       "Technical Room Access",
    sec_cable_trajectory:     "Cable Trajectory",
    sec_photo_misc:           "Miscellaneous Photos",
    sec_engineering_plans:    "Engineering Plans",
    sec_statement_agreement:  "Statement of Agreement",

    // ── Wyre section short labels (tabs) ─────────────────────────────────────
    short_visit:          "Visit",
    short_appointment:    "Appoint.",
    short_client:         "Client",
    short_owner:          "Owner",
    short_building:       "Building",
    short_distribution:   "Distrib.",
    short_facade:         "Facade",
    short_telecom:        "Telecom",
    short_quantities:     "Quantities",
    short_legend:         "Legend",
    short_photoFacade:    "Facade Ph.",
    short_letterbox:      "Letterbox",
    short_floorplan:      "Floorplan",
    short_syndic:         "Syndic",
    short_firePlan:       "Fire Plan",
    short_underground:    "Undergr.",
    short_facadeDist:     "Fac. Dist.",
    short_techRoom:       "Tech Room",
    short_cable:          "Cable",
    short_photoMisc:      "Misc.",
    short_engPlans:       "Plans",
    short_agreement:      "Agreement",

    // ═════════════════════════════════════════════════════════════════════════
    // KPI DASHBOARD
    // ═════════════════════════════════════════════════════════════════════════
    kpiTotalAssigned:     "Total Assigned",
    kpiInProgress:        "In Progress",
    kpiCompletedToday:    "Completed Today",
    kpiPending:           "Pending",
    kpiConflicts:         "Rework / Conflicts",

    // ═════════════════════════════════════════════════════════════════════════
    // FORM FIELD LABELS — Visit Info
    // ═════════════════════════════════════════════════════════════════════════
    entryStatus:          "Entry Status",
    entryOk:              "Entry OK",
    noEntry:              "No Entry",
    visitRemark:          "Remark",
    visitHistory:         "Visit History",
    addVisit:             "Add Visit",

    // ── Appointments ─────────────────────────────────────────────────────────
    surveyorName:         "Surveyor",
    appointmentDate:      "Date",
    appointmentRemark:    "Remark",
    addAppointment:       "Add Appointment",

    // ── Client Info ──────────────────────────────────────────────────────────
    clientName:           "Client Name",
    contractorName:       "Contractor",
    contactEmail:         "Email",
    contactPhone:         "Phone",
    contactAddress:       "Address",
    contactName:          "Contact Person",

    // ── Building Owner ───────────────────────────────────────────────────────
    ownerFound:           "Owner Found",
    ownerNotFound:        "Owner Not Found",
    ownerInfo:            "Owner Info",
    syndicInfo:           "Syndic Info",
    ownerName:            "Name",
    ownerFunction:        "Function",
    ownerEmail:           "Email",
    ownerPhone:           "Phone",
    ownerPresent:         "Owner Present During Visit",
    syndicName:           "Syndic Name",
    syndicManager:        "Syndic Manager",
    syndicEmail:          "Email",
    syndicPhone:          "Phone",
    syndicPresent:        "Syndic Present During Visit",
    street:               "Street",
    houseNumber:          "House No.",
    boxNumber:            "Box",
    postalCode:           "Postal Code",
    city:                 "City",
    dateBoardOwners:      "Date Board of Co-owners",
    ownerRemarks:         "Remarks",

    // ── Building Info ────────────────────────────────────────────────────────
    mainAddress:          "Main Address",
    nameResidence:        "Residence Name",
    evpArea:              "EVP Area",
    addGroupedMdu:        "Add Grouped MDU's",
    groupedMdus:          "Grouped MDU's",
    totalUnits:           "Total Units",
    amountLu:             "Living Units (LU)",
    amountBu:             "Business Units (BU)",
    amountSu:             "Storage Units (SU)",
    nrOfFloors:           "Number of Floors",
    buildingType:         "Building Type",
    addSecondaryAddresses:"Add Secondary Addresses",
    secondaryAddresses:   "Secondary Addresses",
    buildingRemarks:      "Remarks",

    // ── Distribution Zone ────────────────────────────────────────────────────
    mroZone:              "MRO Zone",
    popArea:              "Pop Area",
    plannedDistribution:  "Planned Distribution",
    plannedIntroduction:  "Planned Introduction",
    underground:          "Underground",
    facadeCabling:        "Facade Cabling",
    both:                 "Both",
    verticalSolution:     "Vertical Solution",
    frontGarden:          "Front Garden",
    frontGardenLength:    "Front Garden Length (m)",
    decorativePaving:     "Decorative Paving",

    // ── Facade & Street ──────────────────────────────────────────────────────
    facadeSection:        "Facade",
    streetSection:        "Street",
    heritageProtection:   "Heritage Protection",
    electricCables:       "Electric Cables",
    coaxCables:           "Coax Cables",
    coaxMultitaps:        "Coax Multitaps",
    publicLighting:       "Public Lighting",
    streetCabinet:        "Street Cabinet",
    streetCabinetType:    "Cabinet Type",
    facadeObstacles:      "Facade Obstacles",
    remarks:              "Remarks",

    // ── Existing Telecom ─────────────────────────────────────────────────────
    existingFiber:        "Existing Fiber",
    existingFiberRemarks: "Fiber Remarks",
    technicalShafts:      "Technical Shafts",
    shaftVertical:        "Vertical",
    shaftHorizontal:      "Horizontal",
    electricityTelcoRoom: "Electricity in Telco Room",
    spaceMainDistBox:     "Space for Main Distribution Box",
    verticalCabling:      "Existing Vertical Cabling",
    cat5Cat6:             "CAT5e / CAT6",
    cat3Vvt:              "CAT3 / VVT",
    coaxMultitapsTech:    "Multitaps (Tech Room)",
    coaxCount:            "Count (Tech Room)",
    coaxDirect:           "Coax Direct",

    // ── Execution Quantities ─────────────────────────────────────────────────
    leadInTrench:         "Lead-in (drop) trench",
    diamondDrilling:      "VC1 Diamond Drilling (Vertical)",
    wallPenetration:      "VC2 Wall Penetration (Horizontal)",
    cableDucts60x100:     "VC3 Cable Ducts 60x100",
    cableDucts12x20:      "VC4 Cable Ducts 12x20",
    cableDucts40x40:      "VC4.1 Cable Ducts 40x40",
    cableDucts60x40:      "VC5 Cable Ducts 60x40",
    fireRetardantConduit: "VC6 Fire Retardant Conduit",
    coFlex:               "VC7 Co-flex",
    floorbox:             "Floorbox",

    // ── Photos (Wyre) ────────────────────────────────────────────────────────
    uploadPhoto:          "Upload Photo",
    required:             "Required",
    optional:             "Optional",
    annotate:             "Annotate",
    photoRemarks:         "Photo Remarks",

    // ── Engineering Plans ────────────────────────────────────────────────────
    uploadPlan:           "Upload Plan",
    planDescription:      "Description",
    uploadedBy:           "Uploaded By",
    uploadedAt:           "Upload Date",
    deletePlan:           "Delete Plan",

    // ── Statement of Agreement ───────────────────────────────────────────────
    agreementTitle:       "Agreement Declaration",
    undersignedName:      "Undersigned",
    signatureDate:        "Signature Date",
    ownerSignature:       "Owner Signature",
    subcoSignature:       "Subcontractor Signature",
    refuseSignature:      "Refuse",
    signHere:             "Sign Here",
    notAllSigned:         "Not yet all parties have signed",

    // ── Sidebar ──────────────────────────────────────────────────────────────
    sidebarDetails:       "Details",
    sidebarTsgId:         "TSG ID",
    sidebarReworkRemarks: "Rework Remarks",
    sidebarValidatedBy:   "Validated By",
    sidebarCompletedBy:   "Completed By",
    sidebarEmailLog:      "Email Log",
    sidebarSections:      "Completed Sections",
    sidebarDistance:       "Distance to Address",
    sidebarPdfDownloads:  "PDF Downloads",
    downloadTsa:          "Download TSA Report",
    downloadSsv:          "Download SSV Report",

    // ── Missing keys used by section components ───────────────────────────────
    address:              "Address",
    annotationLegend:     "Annotation Legend",
    canvasPlaceholder:    "Draw floor plan here",
    coax:                 "Coax",
    coaxRemarks:          "Coax Remarks",
    contractor:           "Contractor",
    currentAppointment:   "Current Appointment",
    drawFloorPlan:        "Floorplan",
    dropFiles:            "Click or drag files here to upload",
    executionQuantities:  "Execution Quantities",
    existingVerticalFyber:"Existing Vertical Fiber",
    extraRemarksTelecom:  "Extra Remarks (Telecom)",
    facade:               "Facade",
    noAppointment:        "No appointment scheduled yet.",
    noPlans:              "No engineering plans uploaded yet.",
    noVisits:             "No visits recorded yet.",
    refuse:               "Refuse",
    remark:               "Remark",
    remarksCabling:       "Cabling Remarks",
    remarksFacade:        "Facade Remarks",
    remarksStreet:        "Street Remarks",
    unitCounts:           "Unit Counts",
    uploadPlanBtn:        "Upload Plan",

    // ── General ──────────────────────────────────────────────────────────────
    save:                 "Save",
    saved:                "Saved",
    cancel:               "Cancel",
    delete:               "Delete",
    confirm:              "Confirm",
    edit:                 "Edit",
    filled:               "Filled",
    notFilled:            "Not Filled",
    yes:                  "Yes",
    no:                   "No",

    // ── Portal names ────────────────────────────────────────────────────────
    portalSurveyor:       "Surveyor Portal",
    portalValidator:      "Validator Portal",
    portalAdmin:          "Admin Console",
    portalSubcontractor:  "Subcontractor Portal",

    // ── Validator ───────────────────────────────────────────────────────────
    validationQueue:      "Validation Queue",
    approve:              "Approve",
    reject:               "Reject",
    rejectionReason:      "Rejection Reason",
    rejectionNotes:       "Notes",
    preValidationFlags:   "Pre-validation Flags",
    reworkHistory:        "Rework History",

    // ── Admin ───────────────────────────────────────────────────────────────
    executiveDashboard:   "Executive Dashboard",
    projectDashboard:     "Project Dashboard",
    performanceDashboard: "Performance Dashboard",
    approvalFlow:         "Approval Flow",
    engineeringGate:      "Engineering Gate",
    subcoMonitor:         "Subcontractor Monitor",
    disputeManager:       "Dispute Manager",
    meetstaatReview:      "Meetstaat & Financials",
    adminTools:           "Admin Tools",

    // ── Subcontractor ───────────────────────────────────────────────────────
    myAssignments:        "My Assignments",
    acceptPackage:        "Accept Package",
    requestReassignment:  "Request Reassignment",
    preBuild:             "Pre-Build",
    duringBuild:          "During Build",
    postBuild:            "Post-Build",
    submitMeetstaat:      "Submit Meetstaat",
    disputeRaised:        "Dispute Raised",
    uploadsBlocked:       "Uploads Blocked",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DUTCH (NL)
  // ═══════════════════════════════════════════════════════════════════════════
  nl: {
    // ── App shell ────────────────────────────────────────────────────────────
    appName:              "Fyberbuild",
    appRole:              "Surveyor Portaal",
    online:               "Online",
    offline:              "Offline",
    syncDone:             "Gesynchroniseerd 2 min geleden",
    syncPending:          "3 wijzigingen in wachtrij",
    syncOnline:           "Online \u00b7 Verbonden",
    syncOffline:          "Offline \u00b7 Lokaal opgeslagen",

    // ── Nav ──────────────────────────────────────────────────────────────────
    navDashboard:         "Dashboard",
    navScope:             "Mijn Scope",
    navMap:               "Kaart",
    navHistory:           "Historie",
    navProfile:           "Profiel",

    // ── Queue ────────────────────────────────────────────────────────────────
    queueTitle:           "Mijn Scope",
    queueDate:            "VR 28 FEB",
    queueSurveyor:        "Jonas Jacobs",
    queueCount:           (n) => `${n} opdrachten vandaag`,
    downloadTomorrow:     "Download morgen",
    downloadSub:          "6 opdrachten beschikbaar \u00b7 47 MB",
    downloadFetch:        "Ophalen",

    // ── Filters ──────────────────────────────────────────────────────────────
    filterAll:            "Alles",
    filterBusy:           "Bezig",
    filterWaiting:        "Wachten",
    filterConflict:       "Conflict",
    filterDone:           "Klaar",
    filterActive:         "Actief",
    filterPending:        "In Afwachting",
    filterReview:         "Beoordeling",
    filterIssues:         "Problemen",

    // ── Status badges (15 Wyre statuses) ─────────────────────────────────────
    statusInactive:           "Inactief",
    statusSv:                 "SV",
    statusNa:                 "N.v.t.",
    statusToDo:               "Te Doen",
    statusAppointment:        "Afspraak",
    statusOnGoing:            "Lopend",
    statusVisited:            "Bezocht",
    statusRework:             "Herwerk",
    statusValidationF49:      "Validatie F49",
    statusValidationClient:   "Validatie Klant",
    statusSent:               "Verzonden",
    statusCompleted:          "Voltooid",
    statusRejected:           "Afgekeurd",
    statusFinalNoEntry:       "Definitief Geen Toegang",
    statusNoTsaNd:            "Geen TSA/ND",

    // ── Legacy status badges (kept for backward compat) ──────────────────────
    statusPending:        "Wachten",
    statusInprogress:     "Bezig",
    statusDone:           "Voltooid",
    statusConflict:       "Conflict",

    // ── Survey card ──────────────────────────────────────────────────────────
    selectPromptTitle:    "Selecteer een opdracht",
    selectPromptSub:      "Kies een adres uit de lijst om het survey te openen",

    // ── Survey detail ────────────────────────────────────────────────────────
    backToDashboard:      "Dashboard",
    completed:            "voltooid",
    buildingWarning:      "Gekoppeld gebouw",
    buildingWarnSub:      (addr) => `Deelt een kelder met ${addr}`,

    // ── Original section tabs & titles (Fyberbuild) ──────────────────────────
    sec_connectable:      "Aansluitbaar?",
    sec_address:          "Adres Correct?",
    sec_conntype:         "Aansluittpe",
    sec_connection:       "Aansluiting",
    sec_function:         "Functie gebouw",
    sec_units:            "Units",
    sec_remarks:          "Opmerkingen",
    sec_photos:           "Foto's",

    short_connectable:    "Aansluitbaar",
    short_address:        "Adres",
    short_conntype:       "Type",
    short_connection:     "Aansl.",
    short_function:       "Functie",
    short_units:          "Units",
    short_remarks:        "Opmerk.",
    short_photos:         "Foto's",

    // ── Section detail (legacy) ──────────────────────────────────────────────
    client:               "Klant",
    fyber:                "Fyber",
    savedLabel:           "Opgeslagen",

    // ── Connectable ──────────────────────────────────────────────────────────
    secConnTitle:         "Is het adres aansluitbaar?",

    // ── Address ──────────────────────────────────────────────────────────────
    secAddrTitle:         "Is het adres correct?",
    number:               "Nr.",

    // ── Connection type ──────────────────────────────────────────────────────
    secConntypeTitle:     "Aansluittpe",
    unclear:              "Onduidelijk",
    pole:                 "Pole",
    poleNote:             "Publieke aansluiting via pole",

    // ── Connection ───────────────────────────────────────────────────────────
    secConnectionTitle:   "Aansluiting",
    connectionPlaceholder:"Details aansluiting...",

    // ── Function ─────────────────────────────────────────────────────────────
    secFunctionTitle:     "Functie gebouw",
    residential:          "Woonfunctie",
    commercial:           "Zakelijk",

    // ── Units ────────────────────────────────────────────────────────────────
    unitsTitle:           "Units",
    unitsSub:             "SDU \u00b7 1 eenheid",
    addUnit:              "Toevoegen",
    currentUnit:          "Huidig",

    // ── Remarks ──────────────────────────────────────────────────────────────
    remarksTitle:         "Opmerkingen",
    remarksPlaceholder:   "Voeg opmerkingen toe...",
    refusalTitle:         "Weigering registreren",
    refusalSub:           "Klant weigerde toegang of medewerking",
    refusalBtn:           "Registreer",

    // ── Photos (legacy) ──────────────────────────────────────────────────────
    photosTitle:          "Foto's",
    photosUploaded:       "3/4 ge\u00fcpload",
    photoFacade:          "Gevelaanzicht",
    photoPavement:        "Bestrating",
    photoMailboxes:       "Brievenbussen",
    photoExtra:           "Extra foto",
    signaturesTitle:      "Handtekeningen",
    sigSurveyor:          "Surveyor \u2014 Jonas Jacobs",
    sigClient:            "Klant / Eigenaar",

    // ── CTA ──────────────────────────────────────────────────────────────────
    previous:             "\u2190 Vorige",
    saveAndContinue:      "Opslaan & Verder \u2192",
    submit:               "Indienen",
    alreadyDone:          "\u2713 Voltooid",

    // ── History ──────────────────────────────────────────────────────────────
    historyTitle:         "Bezoekhistorie",

    // ── Profile ──────────────────────────────────────────────────────────────
    region:               "Regio",
    todayDone:            "Vandaag voltooid",
    syncStatus:           "Sync status",
    offlineCache:         "Offline cache",

    // ── Map ──────────────────────────────────────────────────────────────────
    mapTitle:             "Kaartweergave",
    mapSub:               "GIS-kaart met clusterweergave per status",

    // ── Lang toggle ──────────────────────────────────────────────────────────
    langLabel:            "EN",
    langTitle:            "Switch to English",

    // ═════════════════════════════════════════════════════════════════════════
    // WYRE SITE SURVEY — 22 Section Names (full)
    // ═════════════════════════════════════════════════════════════════════════
    sec_visit_info:           "Informatie over bezoek",
    sec_appointment_info:     "Afspraken",
    sec_client_info:          "Klantinformatie",
    sec_building_owner:       "Gebouweigenaar / V.M.E",
    sec_building_info:        "MDU / Gebouwinformatie",
    sec_distribution_zone:    "Info Zone \u2013 Distributie",
    sec_facade_street:        "Gevel & Straat",
    sec_existing_telecom:     "Bestaande Telecom",
    sec_execution_quantities: "Aantallen bij Uitvoering",
    sec_legend:               "Legende",
    sec_photo_facade:         "Foto Voorgevel",
    sec_photo_letterbox:      "Foto Brievenbus",
    sec_floorplan_canvas:     "Grondplan",
    sec_bordje_syndic:        "Bordje Syndicus",
    sec_fire_department:      "Grondplan Brandweer",
    sec_underground_intro:    "Ondergrondse Introductie",
    sec_facade_distribution:  "Geveldistributie",
    sec_technical_room:       "Toegang Technische Ruimte",
    sec_cable_trajectory:     "Kabeltraject",
    sec_photo_misc:           "Diverse Foto's",
    sec_engineering_plans:    "Technische Plannen",
    sec_statement_agreement:  "Akkoordverklaring",

    // ── Wyre section short labels (tabs) ─────────────────────────────────────
    short_visit:          "Bezoek",
    short_appointment:    "Afspraak",
    short_client:         "Klant",
    short_owner:          "Eigenaar",
    short_building:       "Gebouw",
    short_distribution:   "Distrib.",
    short_facade:         "Gevel",
    short_telecom:        "Telecom",
    short_quantities:     "Aantallen",
    short_legend:         "Legende",
    short_photoFacade:    "Foto Gev.",
    short_letterbox:      "Brievenbus",
    short_floorplan:      "Grondplan",
    short_syndic:         "Syndicus",
    short_firePlan:       "Brandweer",
    short_underground:    "Ondergr.",
    short_facadeDist:     "Gev. Dist.",
    short_techRoom:       "Tech. Ruim.",
    short_cable:          "Kabel",
    short_photoMisc:      "Divers",
    short_engPlans:       "Plannen",
    short_agreement:      "Akkoord",

    // ═════════════════════════════════════════════════════════════════════════
    // KPI DASHBOARD
    // ═════════════════════════════════════════════════════════════════════════
    kpiTotalAssigned:     "Totaal Toegewezen",
    kpiInProgress:        "In Uitvoering",
    kpiCompletedToday:    "Vandaag Voltooid",
    kpiPending:           "In Afwachting",
    kpiConflicts:         "Herwerk / Conflicten",

    // ═════════════════════════════════════════════════════════════════════════
    // FORM FIELD LABELS — Visit Info
    // ═════════════════════════════════════════════════════════════════════════
    entryStatus:          "Toegangsstatus",
    entryOk:              "Toegang OK",
    noEntry:              "Geen Toegang",
    visitRemark:          "Opmerking",
    visitHistory:         "Bezoekgeschiedenis",
    addVisit:             "Bezoek Toevoegen",

    // ── Appointments ─────────────────────────────────────────────────────────
    surveyorName:         "Landmeter",
    appointmentDate:      "Datum",
    appointmentRemark:    "Opmerking",
    addAppointment:       "Afspraak Toevoegen",

    // ── Client Info ──────────────────────────────────────────────────────────
    clientName:           "Klantnaam",
    contractorName:       "Aannemer",
    contactEmail:         "E-mail",
    contactPhone:         "Telefoon",
    contactAddress:       "Adres",
    contactName:          "Contactpersoon",

    // ── Building Owner ───────────────────────────────────────────────────────
    ownerFound:           "Eigenaar Gevonden",
    ownerNotFound:        "Eigenaar Niet Gevonden",
    ownerInfo:            "Eigenaarinfo",
    syndicInfo:           "Syndicus Info",
    ownerName:            "Naam",
    ownerFunction:        "Functie",
    ownerEmail:           "E-mail",
    ownerPhone:           "Telefoon",
    ownerPresent:         "Eigenaar Aanwezig bij Bezoek",
    syndicName:           "Naam Syndicus",
    syndicManager:        "Beheerder Syndicus",
    syndicEmail:          "E-mail",
    syndicPhone:          "Telefoon",
    syndicPresent:        "Syndicus Aanwezig bij Bezoek",
    street:               "Straat",
    houseNumber:          "Huisnr.",
    boxNumber:            "Bus",
    postalCode:           "Postcode",
    city:                 "Gemeente",
    dateBoardOwners:      "Datum Raad van Mede-eigenaars",
    ownerRemarks:         "Opmerkingen",

    // ── Building Info ────────────────────────────────────────────────────────
    mainAddress:          "Hoofdadres",
    nameResidence:        "Naam Residentie",
    evpArea:              "EVP Gebied",
    addGroupedMdu:        "Gegroepeerde MDU's Toevoegen",
    groupedMdus:          "Gegroepeerde MDU's",
    totalUnits:           "Totaal Eenheden",
    amountLu:             "Wooneenheden (LU)",
    amountBu:             "Bedrijfseenheden (BU)",
    amountSu:             "Bergruimten (SU)",
    nrOfFloors:           "Aantal Verdiepingen",
    buildingType:         "Gebouwtype",
    addSecondaryAddresses:"Secundaire Adressen Toevoegen",
    secondaryAddresses:   "Secundaire Adressen",
    buildingRemarks:      "Opmerkingen",

    // ── Distribution Zone ────────────────────────────────────────────────────
    mroZone:              "MRO Zone",
    popArea:              "Pop Gebied",
    plannedDistribution:  "Geplande Distributie",
    plannedIntroduction:  "Geplande Introductie",
    underground:          "Ondergronds",
    facadeCabling:        "Gevelbekabeling",
    both:                 "Beide",
    verticalSolution:     "Verticale Oplossing",
    frontGarden:          "Voortuin",
    frontGardenLength:    "Lengte Voortuin (m)",
    decorativePaving:     "Sierbestrating",

    // ── Facade & Street ──────────────────────────────────────────────────────
    facadeSection:        "Gevel",
    streetSection:        "Straat",
    heritageProtection:   "Patrimonium Erfgoed",
    electricCables:       "Elektriciteitskabels",
    coaxCables:           "Coaxkabels",
    coaxMultitaps:        "Coaxiale Multitaps",
    publicLighting:       "Openbare Verlichting",
    streetCabinet:        "Straatmeubilair",
    streetCabinetType:    "Type Meubilair",
    facadeObstacles:      "Gevelobstakels",
    remarks:              "Opmerkingen",

    // ── Existing Telecom ─────────────────────────────────────────────────────
    existingFiber:        "Bestaande Fiber",
    existingFiberRemarks: "Fiber Opmerkingen",
    technicalShafts:      "Technische Schachten",
    shaftVertical:        "Verticaal",
    shaftHorizontal:      "Horizontaal",
    electricityTelcoRoom: "Elektriciteit in Telco Room",
    spaceMainDistBox:     "Ruimte voor Hoofdverdeeldoos",
    verticalCabling:      "Bestaande Verticale Bekabeling",
    cat5Cat6:             "CAT5e / CAT6",
    cat3Vvt:              "CAT3 / VVT",
    coaxMultitapsTech:    "Multitaps (Technische Zaal)",
    coaxCount:            "Aantal (Tech. Zaal)",
    coaxDirect:           "Coax Direct",

    // ── Execution Quantities ─────────────────────────────────────────────────
    leadInTrench:         "Lead-in (drop) sleuf",
    diamondDrilling:      "VC1 Diamandboring (Verticaal)",
    wallPenetration:      "VC2 Muurdoorboring (Horizontaal)",
    cableDucts60x100:     "VC3 Kabelgoten 60x100",
    cableDucts12x20:      "VC4 Kabelgoten 12x20",
    cableDucts40x40:      "VC4.1 Kabelgoten 40x40",
    cableDucts60x40:      "VC5 Kabelgoten 60x40",
    fireRetardantConduit: "VC6 Brandvertragende Flex",
    coFlex:               "VC7 Co-flex",
    floorbox:             "Floorbox",

    // ── Photos (Wyre) ────────────────────────────────────────────────────────
    uploadPhoto:          "Foto Uploaden",
    required:             "Verplicht",
    optional:             "Optioneel",
    annotate:             "Bewerken",
    photoRemarks:         "Foto Opmerkingen",

    // ── Engineering Plans ────────────────────────────────────────────────────
    uploadPlan:           "Plan Uploaden",
    planDescription:      "Beschrijving",
    uploadedBy:           "Ge\u00fcpload Door",
    uploadedAt:           "Uploaddatum",
    deletePlan:           "Plan Verwijderen",

    // ── Statement of Agreement ───────────────────────────────────────────────
    agreementTitle:       "Akkoordverklaring",
    undersignedName:      "Ondergetekende",
    signatureDate:        "Datum Handtekening",
    ownerSignature:       "Handtekening Eigenaar",
    subcoSignature:       "Handtekening Onderaannemer",
    refuseSignature:      "Weigeren",
    signHere:             "Teken Hier",
    notAllSigned:         "Nog niet alle partijen hebben getekend",

    // ── Sidebar ──────────────────────────────────────────────────────────────
    sidebarDetails:       "Details",
    sidebarTsgId:         "TSG ID",
    sidebarReworkRemarks: "Herwerkopmerkingen",
    sidebarValidatedBy:   "Gevalideerd Door",
    sidebarCompletedBy:   "Voltooid Door",
    sidebarEmailLog:      "E-mail Log",
    sidebarSections:      "Afgewerkte Secties",
    sidebarDistance:       "Afstand tot Adres",
    sidebarPdfDownloads:  "PDF Downloads",
    downloadTsa:          "Download TSA Rapport",
    downloadSsv:          "Download SSV Rapport",

    // ── Missing keys used by section components ───────────────────────────────
    address:              "Adres",
    annotationLegend:     "Annotatie Legende",
    canvasPlaceholder:    "Teken hier het grondplan",
    coax:                 "Coax",
    coaxRemarks:          "Coax Opmerkingen",
    contractor:           "Aannemer",
    currentAppointment:   "Huidige Afspraak",
    drawFloorPlan:        "Grondplan",
    dropFiles:            "Klik of sleep bestanden om te uploaden",
    executionQuantities:  "Uitvoeringsaantallen",
    existingVerticalFyber:"Bestaande Verticale Fiber",
    extraRemarksTelecom:  "Extra Opmerkingen (Telecom)",
    facade:               "Gevel",
    noAppointment:        "Nog geen afspraak gepland.",
    noPlans:              "Nog geen technische plannen ge\u00fcpload.",
    noVisits:             "Nog geen bezoeken geregistreerd.",
    refuse:               "Weigeren",
    remark:               "Opmerking",
    remarksCabling:       "Bekabeling Opmerkingen",
    remarksFacade:        "Gevel Opmerkingen",
    remarksStreet:        "Straat Opmerkingen",
    unitCounts:           "Eenheden Telling",
    uploadPlanBtn:        "Plan Uploaden",

    // ── General ──────────────────────────────────────────────────────────────
    save:                 "Opslaan",
    saved:                "Opgeslagen",
    cancel:               "Annuleren",
    delete:               "Verwijderen",
    confirm:              "Bevestigen",
    edit:                 "Bewerken",
    filled:               "Ingevuld",
    notFilled:            "Niet Ingevuld",
    yes:                  "Ja",
    no:                   "Nee",

    // ── Portal names ────────────────────────────────────────────────────────
    portalSurveyor:       "Surveyor Portaal",
    portalValidator:      "Validatie Portaal",
    portalAdmin:          "Admin Console",
    portalSubcontractor:  "Onderaannemer Portaal",

    // ── Validator ───────────────────────────────────────────────────────────
    validationQueue:      "Validatie Wachtrij",
    approve:              "Goedkeuren",
    reject:               "Afkeuren",
    rejectionReason:      "Reden Afkeuring",
    rejectionNotes:       "Opmerkingen",
    preValidationFlags:   "Pre-validatie Meldingen",
    reworkHistory:        "Herwerk Geschiedenis",

    // ── Admin ───────────────────────────────────────────────────────────────
    executiveDashboard:   "Executive Dashboard",
    projectDashboard:     "Project Dashboard",
    performanceDashboard: "Prestatie Dashboard",
    approvalFlow:         "Goedkeuringsproces",
    engineeringGate:      "Engineering Gate",
    subcoMonitor:         "Onderaannemer Monitor",
    disputeManager:       "Geschillenbeheer",
    meetstaatReview:      "Meetstaat & Financiën",
    adminTools:           "Beheertools",

    // ── Subcontractor ───────────────────────────────────────────────────────
    myAssignments:        "Mijn Opdrachten",
    acceptPackage:        "Pakket Accepteren",
    requestReassignment:  "Hertoewijzing Aanvragen",
    preBuild:             "Pre-Bouw",
    duringBuild:          "Tijdens Bouw",
    postBuild:            "Post-Bouw",
    submitMeetstaat:      "Meetstaat Indienen",
    disputeRaised:        "Geschil Aangemeld",
    uploadsBlocked:       "Uploads Geblokkeerd",
  },
};
