# Fyberbuild Surveyor Portal — User Flows for Linear Tickets

> Use this document to create Linear tickets/epics per role. Each flow maps to one or more implementable tickets.

---

## Table of Contents

1. [Authentication & Routing](#1-authentication--routing)
2. [Surveyor Flows](#2-surveyor-flows)
3. [Validator Flows](#3-validator-flows)
4. [PM/Admin Flows](#4-pmadmin-flows)
5. [Subcontractor Flows](#5-subcontractor-flows)
6. [Cross-Functional Flows](#6-cross-functional-flows)

---

## 1. Authentication & Routing

### AUTH-01: Login & Role-Based Redirect
- User enters credentials on `/login`
- System authenticates and determines role (PM, Surveyor, Validator, Subcontractor)
- Redirect to role-specific portal: `/admin`, `/surveyor`, `/validator`, `/subcontractor`
- Unauthorized access to other portals blocked

### AUTH-02: Session Management
- Token-based session persistence
- Auto-logout on token expiry
- "Remember me" option
- Redirect to login on expired session

### AUTH-03: Role-Based Access Control (RBAC)
- Each API call validates role permissions server-side
- Frontend hides UI elements based on role
- Permission matrix enforced (see appendix)

---

## 2. Surveyor Flows

### Epic: Surveyor Dashboard

#### SVR-01: View Dashboard with KPI Cards
**As a** Surveyor **I want to** see my dashboard with KPI metrics **so that** I have an overview of my workload.

**Acceptance Criteria:**
- Display KPI cards: Total Assigned, Active (in_progress + visited), Pending (to_do + appointment), In Review (validation_f49 + validation_client), Issues (rework + rejected + final_no_entry)
- KPIs update in real-time when survey statuses change
- Mobile: cards stack vertically

#### SVR-02: Filter Surveys by Status Category
**As a** Surveyor **I want to** filter my survey list by status category **so that** I can focus on specific work items.

**Acceptance Criteria:**
- Filter buttons: Active, Pending, Review, Done, Issues
- Survey card list updates immediately on filter selection
- Active filter visually highlighted
- Project dropdown filter available alongside status filters

#### SVR-03: View Survey Cards List
**As a** Surveyor **I want to** see a list of my assigned surveys as cards **so that** I can pick which one to work on.

**Acceptance Criteria:**
- Each card shows: tsg_id, full address, status badge (color-coded), building type indicator
- Cards sorted by priority, then by status
- Click card → opens survey form
- Mobile: full-width cards in scrollable list

#### SVR-04: Download Tomorrow's Surveys
**As a** Surveyor **I want to** download scheduled survey imports **so that** I have the latest assignments.

**Acceptance Criteria:**
- "Download Tomorrow" card visible on dashboard
- Shows count of scheduled imports
- Click to fetch and sync new assignments
- Success/error toast notification

---

### Epic: Survey Form

#### SVR-05: Open Survey Form
**As a** Surveyor **I want to** open a survey form **so that** I can fill in site data.

**Acceptance Criteria:**
- Click survey card → full survey form opens
- Desktop: sidebar collapses, form takes full width
- Mobile: bottom nav hides, back button appears in header
- Form sections rendered based on current survey status (see section visibility rules)

#### SVR-06: Auto Status Transition — First Save
**As a** Surveyor **when** I save a survey for the first time (status = to_do) **then** the status auto-transitions to `on_going`.

**Acceptance Criteria:**
- First field save on a `to_do` survey changes status to `on_going`
- Status badge updates immediately
- Dashboard KPIs reflect the change
- Grouped MDU statuses also update

#### SVR-07: Autosave Survey Data
**As a** Surveyor **I want** my form data to auto-save **so that** I don't lose work.

**Acceptance Criteria:**
- Debounced autosave triggers 3 seconds after last field change
- "Saving..." indicator visible during save
- "Saved" confirmation after successful save
- Save disabled for statuses: inactive, sv, na, to_do (until first explicit save)
- Works offline (queues saves for sync)

#### SVR-08: Navigate Between Sections
**As a** Surveyor **I want to** move between survey form sections **so that** I can fill data section by section.

**Acceptance Criteria:**
- "Save and Continue" button advances to next section
- "Previous" button returns to prior section
- Section navigation sidebar/stepper shows progress
- Cannot advance if current section has missing required fields (validation error shown)

#### SVR-09: Section Visibility Based on Status
**As a** Surveyor **I want** only relevant sections to be visible **so that** I'm not overwhelmed.

**Acceptance Criteria:**
- **Always visible** (any status): building_owner, photo_letterbox, bordje_syndic
- **Hidden** in early statuses (inactive, sv, na, to_do, appointment): client_info, building_info, distribution_zone, facade_street, existing_telecom, execution_quantities, legend, photo sections (facade, floorplan, fire_dept, misc), technical sections, engineering_plans, statement_agreement
- **Conditionally visible**: appointment_info visible in to_do, rework, visited, on_going, appointment
- **Post-on_going**: All remaining sections become visible

#### SVR-10: Fill Building Owner Section (Required)
**As a** Surveyor **I want to** record building owner details **so that** we have owner contact info.

**Acceptance Criteria:**
- Owner name field (required)
- Contact details (phone, email)
- Always visible regardless of status
- Validation: cannot submit survey without owner_name

#### SVR-11: Fill Client Info Section
**As a** Surveyor **I want to** record client information **so that** the survey has company and contact context.

**Acceptance Criteria:**
- Company name (required)
- Contact name (required)
- Contact phone, email
- Visible after status = on_going

#### SVR-12: Fill Building Info Section
**As a** Surveyor **I want to** record building classification data **so that** engineering can determine build type.

**Acceptance Criteria:**
- Number of units input
- Number of floors input
- Building type auto-calculated: 9–16 units = small, 17–48 = large, >48 = extra_large
- Building type badge displayed (read-only, auto-set)

#### SVR-13: Fill Distribution Zone Section
**As a** Surveyor **I want to** record MRO/POP area details.

**Acceptance Criteria:**
- MRO zone selection
- POP zone selection
- Distribution type

#### SVR-14: Fill Facade & Existing Telecom Sections
**As a** Surveyor **I want to** assess facade conditions and existing telecom infrastructure.

**Acceptance Criteria:**
- Facade street assessment fields
- Existing telecom infrastructure details
- Visible after status = on_going

#### SVR-15: Fill Execution Quantities Section
**As a** Surveyor **I want to** estimate cost-related quantities **so that** financials can be projected.

**Acceptance Criteria:**
- Quantity input fields per material/labor type
- Auto-calculation of subtotals where applicable

#### SVR-16: View Legend Section (Read-Only)
**As a** Surveyor **I want to** reference the legend **so that** I use correct codes/symbols.

**Acceptance Criteria:**
- Legend section is read-only
- No edit controls
- Always accessible when visible

#### SVR-17: Fill Technical Sections (Underground, Facade Dist, Tech Room, Cable Trajectory)
**As a** Surveyor **I want to** fill in technical infrastructure sections.

**Acceptance Criteria:**
- Underground introduction details
- Facade distribution assessment
- Technical room details
- Cable trajectory data
- Each section has its own fields and validation

---

### Epic: Photo Management

#### SVR-18: Upload Photos — Letterbox (Required)
**As a** Surveyor **I want to** upload letterbox photos **so that** there's visual evidence of building identification.

**Acceptance Criteria:**
- Photo upload control (camera capture on mobile, file select on desktop)
- Minimum 1 photo required
- Annotation capability (draw/mark on photo)
- Remarks text field
- Always visible regardless of status

#### SVR-19: Upload Photos — Bordje Syndic (Required)
**As a** Surveyor **I want to** upload syndic sign/board photos.

**Acceptance Criteria:**
- Same pattern as letterbox: upload + annotation + remarks
- Minimum 1 photo required
- Always visible

#### SVR-20: Upload Photos — Facade
**As a** Surveyor **I want to** upload facade photos **so that** the building exterior is documented.

**Acceptance Criteria:**
- Multiple photo upload
- Annotation on each photo
- Remarks field
- Visible after status = on_going

#### SVR-21: Upload Photos — Floorplan Canvas
**As a** Surveyor **I want to** upload/draw floorplan photos **so that** the building layout is documented.

**Acceptance Criteria:**
- Photo upload with canvas annotation
- Drawing tools for marking cable routes on floorplan
- Visible after status = on_going

#### SVR-22: Upload Photos — Fire Department
**As a** Surveyor **I want to** upload fire department compliance photos.

**Acceptance Criteria:**
- Photo upload + annotation + remarks
- Visible after status = on_going

#### SVR-23: Upload Photos — Miscellaneous
**As a** Surveyor **I want to** upload any additional photos not covered by other sections.

**Acceptance Criteria:**
- Multiple photo upload
- Label/tag each photo
- Remarks field

---

### Epic: Visit & Appointment Management

#### SVR-24: Add Site Visit
**As a** Surveyor **I want to** log a site visit **so that** visit history is tracked.

**Acceptance Criteria:**
- "Add Visit" action available on survey form
- Records visit timestamp automatically
- Entry/no-entry toggle
- On status = on_going, adding visit → auto-transition to `visited`
- 3+ "No entry" visits → auto-transition to `final_no_entry`

#### SVR-25: Delete Site Visit
**As a** Surveyor **I want to** remove an incorrectly logged visit.

**Acceptance Criteria:**
- Delete button on each visit record
- Confirmation dialog before deletion
- Status does not revert on deletion

#### SVR-26: Add Appointment
**As a** Surveyor **I want to** schedule an appointment with the building owner/syndic.

**Acceptance Criteria:**
- Date and time picker
- Auto-transition status to `appointment`
- Appointment visible on dashboard

#### SVR-27: Delete Appointment
**As a** Surveyor **I want to** cancel a scheduled appointment.

**Acceptance Criteria:**
- Delete button with confirmation
- Status does not revert

---

### Epic: Survey Submission & Rework

#### SVR-28: Submit Completed Survey
**As a** Surveyor **I want to** submit my completed survey **so that** it goes to validation.

**Acceptance Criteria:**
- "Complete Survey" button visible on final section
- Pre-submission validation: all required fields + photos present
- If validation fails: show list of missing items, block submission
- On success: status → `visited` (enters validation queue)
- Survey becomes read-only for surveyor

#### SVR-29: Handle Rework from Validator
**As a** Surveyor **when** my survey is sent back for rework **I want to** see the rejection reasons and fix issues.

**Acceptance Criteria:**
- Rework status visible on dashboard (Issues category)
- Open survey shows rework banner with:
  - Rejection reason code (e.g., MISSING_PHOTOS, POOR_PHOTO_QUALITY)
  - Free-text remarks from validator
- Survey re-opens for editing
- Status = `rework` (behaves like `on_going` for section visibility)
- After fixing, surveyor can re-submit → status back to `validation_f49`

#### SVR-30: View Completed Survey (Read-Only)
**As a** Surveyor **I want to** review my completed/approved surveys **so that** I can reference past work.

**Acceptance Criteria:**
- Completed surveys accessible from History screen
- All sections visible but read-only
- No edit controls rendered

---

### Epic: Surveyor Navigation

#### SVR-31: Map View of Assigned Surveys
**As a** Surveyor **I want to** see my surveys on a map **so that** I can plan my route.

**Acceptance Criteria:**
- Leaflet map with survey location markers
- Markers color-coded by status
- Click marker → opens survey detail/card
- Filter by status
- 450m radius nearby building search (Lambert 72 coordinates)

#### SVR-32: Survey History Timeline
**As a** Surveyor **I want to** see a timeline of all my completed surveys.

**Acceptance Criteria:**
- Chronological list of completed surveys
- Shows completion date, tsg_id, address
- Click to open read-only view

#### SVR-33: Surveyor Profile
**As a** Surveyor **I want to** view/edit my profile.

**Acceptance Criteria:**
- Personal details display
- Regional assignment info
- Statistics (total completed, average time, etc.)

---

### Epic: Signature

#### SVR-34: Dual-Party Signature
**As a** Surveyor **I want** the owner and I to sign the survey statement **so that** there's formal agreement.

**Acceptance Criteria:**
- Statement/agreement section at end of survey
- Two signature pads: owner + surveyor
- Timestamp recorded for each signature
- "Refuse to sign" option available
- Visible in later statuses (post on_going)

---

## 3. Validator Flows

### Epic: Validator Dashboard

#### VAL-01: View Validation Queue with KPIs
**As a** Validator **I want to** see my queue and metrics **so that** I know my review workload.

**Acceptance Criteria:**
- KPI cards: Queue Depth (validation_f49 count), Approved (completed + sent + validation_client), Rejected (rework + rejected), Approval Rate %
- KPIs update on each action

#### VAL-02: Filter Queue by Status
**As a** Validator **I want to** filter the queue **so that** I can focus on specific items.

**Acceptance Criteria:**
- Filters: All, Pending Review (validation_f49), Approved (completed, sent, validation_client), Rejected (rework, rejected)
- Project filter dropdown
- Active filter highlighted

#### VAL-03: Toggle Queue View (List / Table / Map)
**As a** Validator **I want to** switch between list, table, and map views.

**Acceptance Criteria:**
- List: card-based view
- Table: sortable columns (tsg_id, address, status, date)
- Map: Leaflet map with markers
- View preference persisted

---

### Epic: Validation Workspace

#### VAL-04: Open Validation Workspace
**As a** Validator **I want to** open a survey for review **so that** I can assess quality.

**Acceptance Criteria:**
- Click survey from queue → workspace opens
- Full survey displayed in read-only mode
- Previous/Next buttons for queue traversal
- Queue position indicator (e.g., "3 of 15")

#### VAL-05: View Pre-Validation Flags
**As a** Validator **I want to** see automatic quality flags **so that** I know what to focus on.

**Acceptance Criteria:**
- Bottom panel lists all missing required fields per section
- Alerts if owner signature is missing
- Shows rework history if previously rejected
- Color-coded severity (error = red, warning = amber)

#### VAL-06: Approve Survey
**As a** Validator **I want to** approve a survey **so that** it moves to client review.

**Acceptance Criteria:**
- "Approve" button (green) in action bar
- Confirmation dialog
- Status transition: `validation_f49` → `validation_client`
- Success banner shown
- Auto-advance to next survey in queue (or return to queue if last)

#### VAL-07: Reject Survey (Send Back for Rework)
**As a** Validator **I want to** reject a survey with reasons **so that** the surveyor knows what to fix.

**Acceptance Criteria:**
- "Reject" button (red) in action bar
- Rejection dialog opens with:
  - Reason code dropdown (required): MISSING_PHOTOS, MISSING_SIGNATURE, INCORRECT_UNIT_COUNT, INCORRECT_FLOOR_COUNT, MISSING_QUANTITIES, POOR_PHOTO_QUALITY, INCOMPLETE_SECTIONS, DATA_INCONSISTENCY, OTHER
  - Free-text notes field for detailed remarks
- On submit: status → `rework`, rework_remarks saved
- Surveyor sees rejection reason + notes
- Survey returns to queue as rejected

#### VAL-08: Navigate Queue (Previous/Next)
**As a** Validator **I want to** quickly move between surveys in my queue.

**Acceptance Criteria:**
- Previous/Next buttons in workspace header
- Queue position updates
- Keyboard shortcuts (← →) for power users
- Loops back to start/end of queue

---

## 4. PM/Admin Flows

### Epic: Executive Dashboard

#### ADM-01: View Executive Dashboard
**As a** PM/Admin **I want to** see system-wide metrics **so that** I have full operational visibility.

**Acceptance Criteria:**
- KPI cards: Total Addresses, Completed (count + %), In Progress (%), Pending (%), In Review (%), Issues (%)
- Status distribution bar chart (all 15 statuses)
- Weekly completion trend line chart (completed vs started per week)
- Funnel/Pie chart breakdown
- Quick-link: "Create Survey" button

---

### Epic: Survey Creation

#### ADM-02: Create Survey Manually
**As a** PM/Admin **I want to** manually create a new survey **so that** I can add buildings not in bulk import.

**Acceptance Criteria:**
- Form fields: TSG ID (unique), Street, Number, Postal Code, City, Building Type dropdown (single_family, terraced, semi_detached, apartment), Priority checkbox, Assigned Surveyor dropdown
- On submit: creates survey with status = `to_do`
- Auto-generates building_id = `BLD-{tsg_id}`
- Pre-fills empty structures for all 22 form sections
- Validation: TSG ID must be unique
- Returns to Executive Dashboard on success

---

### Epic: Project Management

#### ADM-03: View Project Dashboard
**As a** PM/Admin **I want to** see project-level survey groupings and KPIs.

**Acceptance Criteria:**
- List of projects
- Per-project: total surveys, status breakdown, progress %
- Click project → filtered survey list

---

### Epic: Performance Tracking

#### ADM-04: View Surveyor Performance
**As a** PM/Admin **I want to** track surveyor performance **so that** I can manage team productivity.

**Acceptance Criteria:**
- Per-surveyor: surveys completed, average time per survey, photo quality metrics
- Regional performance breakdown
- Sortable/filterable table
- Export to CSV

#### ADM-05: View Subcontractor Performance
**As a** PM/Admin **I want to** track subcontractor build performance.

**Acceptance Criteria:**
- Per-subco: build progress, dispute frequency, phase completion rates
- Sortable table
- Export to CSV

---

### Epic: Map & Table View

#### ADM-06: GIS Map + Data Table View
**As a** PM/Admin **I want to** see all surveys on a map and in a table **so that** I can manage geographically.

**Acceptance Criteria:**
- Leaflet map with all survey markers (color-coded by status)
- Table view alongside/below map
- Filter by status, project, surveyor, city
- Click marker or row → opens survey detail
- Search by tsg_id or address

---

### Epic: Approval Flow

#### ADM-07: View 9-Step Approval Pipeline
**As a** PM/Admin **I want to** track each survey's journey through the full approval pipeline.

**Acceptance Criteria:**
- Left panel: list of all surveys in approval pipeline
- Center panel: selected survey's 9-step journey:
  1. Survey Completed
  2. SSV Created
  3. TSA Created
  4. Engineering Inputs
  5. Ready for Construction
  6. Build Status
  7. Build Approved (branches: Approved / Dispute)
  8. Finances Generated
  9. Build Complete
- Each step shows: status (pending/current/completed), actor, timestamp, action link
- Filter: by step, by status (validation_f49, validation_client, completed, sent)

#### ADM-08: Generate & Send Client PDF (SSV)
**As a** PM/Admin **I want to** generate the SSV PDF and send it to the client **so that** they can review/approve.

**Acceptance Criteria:**
- Available when survey status = validation_f49 or higher
- "Generate PDF" button creates SSV document
- "Send to Client" action with email/transmission
- Status updates to reflect PDF sent
- Audit log: who sent, when, to whom

#### ADM-09: Generate & Send Syndic/Owner PDF (TSA)
**As a** PM/Admin **I want to** generate and send the syndic/owner PDF **so that** they can sign off.

**Acceptance Criteria:**
- **Hard Gate**: Only available after Client Approved (status = validation_client or higher)
- "Generate Syndic PDF" creates TSA document
- "Send to Syndic/Owner" action
- Tracks transmission in audit log

#### ADM-10: Record Client Approval
**As a** PM/Admin **I want to** record client approval **so that** the workflow advances.

**Acceptance Criteria:**
- "Mark Client Approved" action available on validation_client surveys
- Transitions status appropriately
- Enables Syndic PDF generation (unlocks gate)

#### ADM-11: Record Syndic/Owner Approval
**As a** PM/Admin **I want to** record syndic/owner approval **so that** engineering can begin.

**Acceptance Criteria:**
- "Mark Syndic Approved" action
- **Unlocks gate**: Engineering inputs now allowed
- Status update reflected in pipeline

---

### Epic: Engineering Gate

#### ADM-12: View Engineering Gate Dashboard
**As a** PM/Admin **I want to** see which surveys need engineering inputs **so that** I can prepare them for construction.

**Acceptance Criteria:**
- List of surveys eligible for engineering (status = completed, sent, validation_client)
- Shows gate completion status per survey
- Filter by completion state

#### ADM-13: Fill Engineering Gate — Build Type Selection
**As a** PM/Admin **I want to** select the build type **so that** the correct construction plan applies.

**Acceptance Criteria:**
- Dropdown: SDU Standard, SDU Complex, Small MDU (9-16 units), Large MDU (17-48 units), Extra Large MDU (49+ units)
- Selection saved immediately
- Required for gate completion

#### ADM-14: Fill Engineering Gate — DB7 & Subduct Color
**As a** PM/Admin **I want to** configure DB7 settings and subduct color.

**Acceptance Criteria:**
- DB7 option dropdown
- Subduct color selection
- Required for gate completion

#### ADM-15: Upload Splicing Plans
**As a** PM/Admin **I want to** upload splicing plan files **so that** the subcontractor has construction documents.

**Acceptance Criteria:**
- 5 upload slots:
  1. PDP – Primary Distribution Point
  2. DP – Distribution Point
  3. POC – Point of Connection
  4. BUDI – Building Distribution
  5. Floorboxes
- File upload per slot (PDF, images)
- At least one file required for gate completion

#### ADM-16: Upload Blowing/Jetting Plan (Optional)
**As a** PM/Admin **I want to** optionally upload a blowing plan.

**Acceptance Criteria:**
- Single file upload slot
- Optional (not required for gate completion)

#### ADM-17: Fill Build Type Label & Address
**As a** PM/Admin **I want to** add label and address metadata for the build.

**Acceptance Criteria:**
- Label text field (description)
- Address text field
- Required for gate completion

#### ADM-18: Complete Engineering Gate & Assign Subcontractor
**As a** PM/Admin **I want to** finalize engineering inputs and assign a subcontractor.

**Acceptance Criteria:**
- Gate completion validation:
  - Build type selected ✓
  - DB7 + subduct color set ✓
  - At least one splicing file uploaded ✓
  - Label + address filled ✓
- "Assign Subcontractor" button enabled only when gate complete
- Assignment modal: select subcontractor from dropdown, confirm
- Updates survey.assigned_subcontractor
- Status → ready for build phase

---

### Epic: Subcontractor Monitoring

#### ADM-19: View Subco Monitor Dashboard
**As a** PM/Admin **I want to** see all subcontractor assignments and their progress.

**Acceptance Criteria:**
- List of all assignments as cards
- Each card: tsg_id, address, subcontractor name, current phase (pre_build/during_build/post_build), progress % bar, status badge (pending_acceptance, accepted, in_progress, disputed, completed)
- Filter by subcontractor, phase, status
- Click card → admin view of subco's work

#### ADM-20: View Subcontractor Execution Detail (Admin View)
**As a** PM/Admin **I want to** inspect a subcontractor's uploaded work **so that** I can verify quality.

**Acceptance Criteria:**
- View uploaded photos/forms per phase (pre, during, post)
- View build status updates
- View meetstaat if uploaded
- "Raise Dispute" action available

---

### Epic: Dispute Management

#### ADM-21: View Active Disputes
**As a** PM/Admin **I want to** see all open disputes **so that** I can manage build quality issues.

**Acceptance Criteria:**
- List: Dispute ID, tsg_id, subcontractor name, status (open/resolved), raised by, date
- Filter: open, resolved, all
- Click to view dispute detail

#### ADM-22: Raise New Dispute
**As a** PM/Admin **I want to** raise a dispute against a subcontractor's work.

**Acceptance Criteria:**
- Select survey (dropdown of surveys with assigned subcos only)
- Comment field (issue description)
- Instructions field (what subco must fix)
- On submit: dispute created with status = open
- Dispute flagged on subco's assignment

#### ADM-23: Resolve Dispute
**As a** PM/Admin **I want to** resolve a dispute after the subcontractor addresses the issue.

**Acceptance Criteria:**
- View subco's response/re-uploaded evidence
- "Resolve" button → status = resolved
- Resolution timestamp + admin notes logged

---

### Epic: Financials

#### ADM-24: Review Meetstaat
**As a** PM/Admin **I want to** review meetstaat documents **so that** costs are reconciled.

**Acceptance Criteria:**
- List of uploaded meetstaat files per survey/subco
- View/download meetstaat PDF
- Mark as reviewed/approved
- Payment status tracking per subcontractor

---

### Epic: Admin — Import & Grouping

#### ADM-25: Bulk Import Addresses (CSV)
**As a** PM/Admin **I want to** bulk import building addresses **so that** surveys are created at scale.

**Acceptance Criteria:**
- CSV upload with required columns: tsg_id, street, number, postal_code, city
- Optional columns: building_type, priority, assigned_surveyor
- Validation: duplicate tsg_id check, required fields
- Preview imported rows before confirmation
- Surveys created with status = `to_do`
- Import result summary: created, skipped (duplicates), errors

#### ADM-26: MDU Grouping — Link Buildings
**As a** PM/Admin **I want to** group multiple buildings into one survey **so that** nearby MDUs share a single assessment.

**Acceptance Criteria:**
- Select main building → ID suffix = {baseID}-A
- Add child buildings → IDs assigned -B, -C, etc.
- Nearby search: 450m radius using Lambert 72 coordinates
- Child building URLs redirect to main survey (cannot edit from child URL)
- Status changes on main propagate to all children

#### ADM-27: MDU Grouping — Unlink Buildings
**As a** PM/Admin **I want to** remove a building from a group.

**Acceptance Criteria:**
- Select grouped building → "Unlink" action
- Child gets its own independent survey
- ID suffix removed or reassigned

#### ADM-28: RBAC — Manage User Roles
**As a** PM/Admin **I want to** assign and manage user roles **so that** access is controlled.

**Acceptance Criteria:**
- User list with current roles
- Assign/change role per user (PM, Surveyor, Validator, Subcontractor)
- Role change effective immediately
- Audit log of role changes

---

## 5. Subcontractor Flows

### Epic: Subcontractor Dashboard

#### SUB-01: View Assignment List
**As a** Subcontractor **I want to** see all my assigned builds **so that** I know my workload.

**Acceptance Criteria:**
- Card list of all assignments
- Each card: tsg_id, address, city, build type badge, progress % bar, status badge
- Filter by status: pending_acceptance, accepted, in_progress, completed
- Dispute indicator visible if applicable

#### SUB-02: Accept Assignment Package
**As a** Subcontractor **I want to** accept a new build assignment **so that** I can begin work.

**Acceptance Criteria:**
- "New Assignment" card for pending_acceptance status
- Message: "Accept this package to begin build execution"
- "Accept Package" button → status transitions to accepted
- "Request Reassignment" button → sends notification to admin

---

### Epic: Build Execution Hub

#### SUB-03: View Execution Hub Header
**As a** Subcontractor **I want to** see build summary info when working on an assignment.

**Acceptance Criteria:**
- Header shows: full address, tsg_id, building_id, build type badge, postal code, city
- Construction status dropdown: Start Construction, VC Done, INTRO Done, Dispute/On Hold
- Dispute banner shown if dispute is active (with comment + remediation instructions)

#### SUB-04: View Available Documents (SSV + Engineering Files)
**As a** Subcontractor **I want to** access the survey report and engineering plans **so that** I can execute the build.

**Acceptance Criteria:**
- SSV document always available (downloadable)
- Engineering files available per type: PDP, DP, POC, BUDI, Floorboxes, Blowing plan
- File viewer or download for each document

#### SUB-05: View Key Building Information Panel
**As a** Subcontractor **I want to** reference building details while working.

**Acceptance Criteria:**
- Collapsible info section with: Address, MRO Zone, POP Zone, Building ID, Building Group ID, Building Type, Number of Units, Layers, Distribution type, Remarks

---

### Epic: Pre-Build Phase

#### SUB-06: Upload Intro Images
**As a** Subcontractor **I want to** upload cable entry and site access photos **so that** pre-build evidence is recorded.

**Acceptance Criteria:**
- Photo upload (camera on mobile, file select on desktop)
- Minimum 1 photo required
- Quadrant selection for location context
- Optional remarks

#### SUB-07: Upload Virtual Site Completion (VC) Images
**As a** Subcontractor **I want to** upload VC images **so that** virtual completion is documented.

**Acceptance Criteria:**
- Minimum 1 photo required
- Photo upload + metadata
- Pre-build phase complete when both intro + VC images uploaded and submitted

#### SUB-08: Submit Pre-Build Phase
**As a** Subcontractor **I want to** submit pre-build deliverables **so that** I can move to the during-build phase.

**Acceptance Criteria:**
- Validation: intro images ≥ 1 + VC images ≥ 1
- Submit button → phase transitions to during_build
- Cannot go back to pre_build after submission

---

### Epic: During-Build Phase

#### SUB-09: Fill During-Build Form
**As a** Subcontractor **I want to** record cable routing and riser progress.

**Acceptance Criteria:**
- Cable routing detail fields
- Riser progress tracking (for MDUs)
- Floor-by-floor progress (for large MDUs)

#### SUB-10: Upload During-Build Photos
**As a** Subcontractor **I want to** upload progress photos **so that** build quality is evidenced.

**Acceptance Criteria:**
- Multiple photo upload slots
- Evidence of cable placement
- Safety/compliance documentation photos
- Required count varies by build type (SDU Standard = 4, Large MDU = 12)

#### SUB-11: Submit During-Build Phase
**As a** Subcontractor **I want to** complete the during-build phase.

**Acceptance Criteria:**
- Validation: required form fields + minimum photo count met
- Submit → phase transitions to post_build

---

### Epic: Post-Build Phase

#### SUB-12: Upload Post-Build Completion Photos
**As a** Subcontractor **I want to** upload final completion photos.

**Acceptance Criteria:**
- Post-build completion photos (multiple)
- Final testing results upload (for large MDU)
- Handover report upload (for XL MDU)

#### SUB-13: Upload Meetstaat
**As a** Subcontractor **I want to** upload the meetstaat (cost reconciliation) document **so that** financials can be processed.

**Acceptance Criteria:**
- Meetstaat file upload (PDF)
- Upload timestamp recorded
- Triggers admin review
- Cannot re-upload once admin has approved (lock after approval)

#### SUB-14: Submit Post-Build Phase & Complete Build
**As a** Subcontractor **I want to** finalize the build execution.

**Acceptance Criteria:**
- Validation: all post-build photos + meetstaat uploaded
- Submit → status = completed
- Build becomes read-only

---

### Epic: Subcontractor Dispute Handling

#### SUB-15: View Dispute & Remediation Instructions
**As a** Subcontractor **when** a dispute is raised against me **I want to** see what needs fixing.

**Acceptance Criteria:**
- Dispute banner on execution hub
- Shows PM's comment (what's wrong)
- Shows remediation instructions (what to do)
- Assignment status = disputed

#### SUB-16: Respond to Dispute
**As a** Subcontractor **I want to** respond to a dispute with new evidence.

**Acceptance Criteria:**
- Re-upload corrected photos
- Add notes explaining changes
- "Mark as Responded" action
- Awaits admin resolution (cannot self-resolve)

---

## 6. Cross-Functional Flows

### Epic: Auto Status Transitions

#### SYS-01: Implement Auto Status Transitions
**As the** System **I want to** auto-transition survey statuses **so that** the workflow progresses correctly.

**Rules:**
1. First save on `to_do` → `on_going`
2. Add visit on `on_going` → `visited`
3. 3+ "No entry" visits → `final_no_entry`
4. Add appointment → `appointment`
5. All status changes propagate to grouped MDU children

#### SYS-02: Enforce Hard Gate Rules
**As the** System **I want to** block actions that violate workflow gates.

**Rules:**
1. No Syndic/Owner PDF generation until Client Approved
2. No engineering input access until Syndic/Owner Approved
3. No subcontractor assignment until Engineering Gate complete

---

### Epic: MDU Grouping Behavior

#### SYS-03: Grouped MDU Redirects
**As the** System **when** a user accesses a child MDU URL **then** redirect to the main survey.

**Acceptance Criteria:**
- Child building URL → redirect to main building's survey
- Edit only happens on main survey
- All child buildings display main survey data

#### SYS-04: Status Propagation to Grouped MDUs
**As the** System **when** the main survey status changes **then** update all children.

**Acceptance Criteria:**
- Any status change on main → same status set on all children
- Works for both manual and auto-transitions

---

### Epic: Offline Capability (Surveyor)

#### SYS-05: Offline Data Entry
**As a** Surveyor **I want to** fill surveys offline **so that** I can work in buildings with poor connectivity.

**Acceptance Criteria:**
- Survey data cached locally
- Edits queued when offline
- Auto-sync when connection restored
- Conflict resolution: last-write-wins with user notification

#### SYS-06: Offline Photo Capture
**As a** Surveyor **I want to** take photos offline **so that** I can work without interruption.

**Acceptance Criteria:**
- Photos stored locally
- Queued for upload when online
- Upload progress indicator on sync

---

### Epic: Bilingual Support (EN/NL)

#### SYS-07: Language Toggle
**As a** User **I want to** switch between English and Dutch **so that** I can work in my preferred language.

**Acceptance Criteria:**
- Language toggle in profile/settings
- All UI labels and messages available in EN and NL
- Survey form labels default to Dutch (NL)
- Persisted preference per user

---

### Epic: Responsive / Mobile-First

#### SYS-08: Mobile Layout — Surveyor
**Acceptance Criteria:**
- Bottom navigation bar (5 items: Dashboard, Map, History, Profile)
- Bottom nav hides when survey form is open (back button instead)
- Full-width survey sections, vertical scroll
- Camera integration for photo capture

#### SYS-09: Mobile Layout — Validator
**Acceptance Criteria:**
- List view dominant (not table)
- Filters collapse to dropdown
- Full-screen workspace for review

#### SYS-10: Mobile Layout — Admin
**Acceptance Criteria:**
- Bottom navigation with "More" dropdown for overflow tabs
- Charts stack vertically
- Tables become scrollable cards

#### SYS-11: Mobile Layout — Subcontractor
**Acceptance Criteria:**
- Vertical card stack for assignments
- Full-screen execution hub with document viewer

---

## Appendix: Permission Matrix

| Permission | Surveyor | Validator | Admin | Subco |
|---|:---:|:---:|:---:|:---:|
| survey.view_assigned | ✓ | | | |
| survey.view_all | | ✓ | ✓ | |
| survey.edit | ✓ | | ✓ | |
| survey.submit | ✓ | | | |
| survey.validate | | ✓ | ✓ | |
| survey.approve | | ✓ | ✓ | |
| survey.reject | | ✓ | ✓ | |
| visit.add/delete | ✓ | | | |
| appointment.add/delete | ✓ | | | |
| photo.upload | ✓ | | | ✓ |
| photo.delete | ✓ | | | |
| agreement.sign | ✓ | | | ✓ |
| validation.add_notes | | ✓ | | |
| workflow.manage | | | ✓ | |
| pdf.generate/send | | | ✓ | |
| engineering.upload | | | ✓ | |
| engineering.define_build_type | | | ✓ | |
| subcontractor.assign | | | ✓ | |
| subcontractor.dispute | | | ✓ | |
| assignment.view_own | | | | ✓ |
| assignment.accept | | | | ✓ |
| build.upload_photos | | | | ✓ |
| build.fill_forms | | | | ✓ |
| build.submit_phase | | | | ✓ |
| meetstaat.upload | | | | ✓ |
| dispute.view/respond | | | ✓ | ✓ |

---

## Ticket ID Summary

| Prefix | Role | Count |
|---|---|---|
| AUTH | All | 3 |
| SVR | Surveyor | 34 |
| VAL | Validator | 8 |
| ADM | PM/Admin | 28 |
| SUB | Subcontractor | 16 |
| SYS | Cross-functional | 11 |
| **Total** | | **100** |
