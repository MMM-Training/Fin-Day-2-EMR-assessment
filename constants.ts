
import { Module, VerificationStatus, PlanType, RecordType, RecordStatus, ProviderSchedule } from './types';

export const MODULES: Module[] = [
  Module.Dashboard,
  Module.AppointmentBook,
  Module.FamilyFile,
  Module.Ledger,
  Module.OfficeManager,
  Module.Chart,
  Module.TreatmentPlanner,
  Module.DocumentCenter,
  Module.InsuranceVerifications,
  Module.MedicalRecords,
  Module.Portal,
  Module.InsurancePortal
];

export const PROVIDERS = [
  'Dr. Smith',
  'Dr. Jones',
  'Dr. Taylor',
  'Dr. Ortho',
  'Dr. Pedo',
  'Dr. Peri',
  'Hygienist A',
  'Hygienist B',
  'Dr. Lee',
  'Dr. Cruz',
  'Dr. Dizon'
];

export const PROVIDER_COLORS: Record<string, string> = {
    'Dr. Smith': 'bg-blue-300',
    'Dr. Jones': 'bg-green-300',
    'Dr. Taylor': 'bg-amber-300',
    'Dr. Ortho': 'bg-purple-300',
    'Dr. Pedo': 'bg-pink-300',
    'Dr. Peri': 'bg-teal-300',
    'Hygienist A': 'bg-indigo-300',
    'Hygienist B': 'bg-rose-300',
    'Dr. Lee': 'bg-cyan-300',
    'Dr. Cruz': 'bg-lime-300',
    'Dr. Dizon': 'bg-orange-300',
    'default': 'bg-gray-300'
};

export const APPOINTMENT_TYPES = [
    'General',
    'New Patient',
    'Emergency',
    'Follow-up',
    'Continuing Care',
    'Consultation',
    'Surgery',
    'Orthodontics'
];

export const APPOINTMENT_STATUSES = [
  { code: 'FIRM', label: 'Appointment Confirmed' },
  { code: 'NC', label: 'Not Confirmed' },
  { code: 'FIRM-E', label: 'Appt Confirmed by Email' },
  { code: 'EMER', label: 'Emergency Patient' },
  { code: 'HERE', label: 'Patient has Arrived' },
  { code: 'READY', label: 'Ready for Operatory' },
  { code: 'LMM', label: 'Left Message Machine' },
  { code: 'LMP', label: 'Left Message Person' },
  { code: 'MULTI', label: 'Multi-Appointment' },
  { code: 'NOFLEX', label: 'Not Flexible' }
];

// Provider Schedule Rules
export const PROVIDER_SCHEDULES: Record<string, ProviderSchedule> = {
    'Dr. Smith': {
        workStart: '08:00',
        workEnd: '17:00',
        breaks: [],
        maxAppointmentsPerDay: 12
    },
    'Dr. Jones': {
        workStart: '08:00',
        workEnd: '16:00',
        breaks: [],
        maxAppointmentsPerDay: 10
    },
    'Dr. Taylor': {
        workStart: '07:00',
        workEnd: '15:00',
        breaks: [],
        maxAppointmentsPerDay: 15
    },
    'Hygienist A': {
        workStart: '08:00',
        workEnd: '17:00',
        breaks: [],
        maxAppointmentsPerDay: 8
    },
    'Hygienist B': {
        workStart: '09:00',
        workEnd: '18:00',
        breaks: [],
        maxAppointmentsPerDay: 9
    },
    // Defaults for others
    'default': {
        workStart: '08:00',
        workEnd: '17:00',
        breaks: [],
        maxAppointmentsPerDay: 20
    }
};

export const TREATMENTS: { name: string; code: string; fee: number }[] = [
  { name: 'Prophy & Exam', code: 'D1110', fee: 150 },
  { name: '2 Surf Composite', code: 'D2331', fee: 250 },
  { name: 'Crown Prep', code: 'D2740', fee: 1200 },
  { name: 'RCT', code: 'D3310', fee: 900 },
  { name: 'Extraction', code: 'D7140', fee: 300 },
  { name: 'New Patient Exam', code: 'D0150', fee: 180 },
  { name: 'Follow-up Exam', code: 'D0170', fee: 75 },
  { name: 'Emergency Exam', code: 'D0140', fee: 120 },
  { name: 'Perio Maint.', code: 'D4910', fee: 200 },
  { name: 'Sealant Check', code: 'D1351', fee: 50 },
  { name: 'Invisalign Check', code: 'D8670', fee: 100 },
  { name: 'Bridge Consult', code: 'D9310', fee: 120 },
  { name: 'Child Prophy', code: 'D1120', fee: 95 },
  { name: 'Composite Filling', code: 'D2330', fee: 200 },
  { name: 'Amalgam Filling', code: 'D2140', fee: 150 },
  { name: 'Crown', code: 'D2740', fee: 1200 },
  { name: 'Bridge Abutment', code: 'D6750', fee: 1100 },
  { name: 'Perio Eval', code: 'D0180', fee: 220 },
  { name: 'Nitrous Oxide', code: 'D9230', fee: 50 },
];

export const PROCEDURE_CODES: { category: string; adaCode: string; description: string; fee: number }[] = [
    // Diagnostic
    { category: 'Diagnostic', adaCode: 'CE001', description: 'Exam, Primary', fee: 95 },
    { category: 'Diagnostic', adaCode: 'CE002', description: 'Exam Permanent', fee: 95 },
    { category: 'Diagnostic', adaCode: 'CE003', description: 'Exam, Recall', fee: 75 },
    { category: 'Diagnostic', adaCode: 'CE004', description: 'Exam, Specific', fee: 110 },
    { category: 'Diagnostic', adaCode: 'CE005', description: 'Exam, Emergency', fee: 120 },
    { category: 'Diagnostic', adaCode: 'CX001', description: '1 PA (Periapical)', fee: 40 },
    { category: 'Diagnostic', adaCode: 'CX002', description: '2 PA (Periapical)', fee: 65 },
    { category: 'Diagnostic', adaCode: 'CX003', description: '2 B.W. X-Ray', fee: 55 },
    { category: 'Diagnostic', adaCode: 'CX004', description: '4 B.W. X-Ray', fee: 85 },
    { category: 'Diagnostic', adaCode: 'X1407', description: 'Periodic oral eval', fee: 95 },
    { category: 'Diagnostic', adaCode: 'X1427', description: 'Limited oral eval', fee: 120 },
    { category: 'Diagnostic', adaCode: 'X1437', description: 'Comprehensive oral eval', fee: 180 },
    { category: 'Diagnostic', adaCode: 'X1497', description: 'Intraoral Full Mouth', fee: 150 },
    { category: 'Diagnostic', adaCode: 'X1617', description: 'Panoramic Image', fee: 100 },
    { category: 'Diagnostic', adaCode: 'X1747', description: 'Pulp vitality tests', fee: 45 },
    
    // Preventive
    { category: 'Preventive', adaCode: 'CC001', description: 'Polishing 1U', fee: 45 },
    { category: 'Preventive', adaCode: 'CC002', description: 'Polishing 2U', fee: 75 },
    { category: 'Preventive', adaCode: 'CC004', description: 'Scaling 1U', fee: 65 },
    { category: 'Preventive', adaCode: 'CC005', description: 'Scaling 2U', fee: 110 },
    { category: 'Preventive', adaCode: 'CC008', description: 'Fluoride, Topical', fee: 40 },
    { category: 'Preventive', adaCode: 'CC009', description: 'Sealants-1st tooth', fee: 50 },
    { category: 'Preventive', adaCode: 'X2397', description: 'Prophylaxis-adult', fee: 125 },
    { category: 'Preventive', adaCode: 'X2407', description: 'Prophylaxis-child', fee: 95 },
    { category: 'Preventive', adaCode: 'X2638', description: 'Sealant-per tooth', fee: 45 },
    { category: 'Preventive', adaCode: 'X2797', description: 'Space maint-fixed', fee: 250 },
    
    // Restorative
    { category: 'Restorative', adaCode: 'CR001', description: 'Comp perm mol', fee: 280 },
    { category: 'Restorative', adaCode: 'CR006', description: 'Cr Porc Jacket', fee: 1100 },
    { category: 'Restorative', adaCode: 'CR008', description: 'Cr Full Cast', fee: 1200 },
    { category: 'Restorative', adaCode: 'X3427', description: 'Amalgam-1 surf. p', fee: 150 },
    { category: 'Restorative', adaCode: 'X3617', description: 'Resin-one surface', fee: 200 },
    { category: 'Restorative', adaCode: 'X3678', description: 'Resin composite-3', fee: 350 },
    { category: 'Restorative', adaCode: 'X4037', description: 'Crown-porc/fuse h', fee: 1200 },
    { category: 'Restorative', adaCode: 'X4217', description: 'Prefab stain steel', fee: 300 },
    { category: 'Restorative', adaCode: 'X4237', description: 'Core buildup, incl', fee: 250 },
    
    // Endodontics
    { category: 'Endodontics', adaCode: 'CP001', description: 'One canal Perm/R', fee: 850 },
    { category: 'Endodontics', adaCode: 'CP002', description: '2 Canal Perm/R', fee: 950 },
    { category: 'Endodontics', adaCode: 'CP003', description: '3 Canal Perm/R', fee: 1050 },
    { category: 'Endodontics', adaCode: 'X4397', description: 'Pulp cap-direct, (e', fee: 60 },
    { category: 'Endodontics', adaCode: 'X4597', description: 'Endodontic therapy', fee: 900 },
    { category: 'Endodontics', adaCode: 'X4697', description: 'Apicoectomy/Peri', fee: 550 },
    { category: 'Endodontics', adaCode: 'X4714', description: 'Periradicular surg', fee: 400 },
    
    // Periodontics
    { category: 'Periodontics', adaCode: 'X5497', description: 'Gingivectomy-4+', fee: 600 },
    { category: 'Periodontics', adaCode: 'X5498', description: 'Gingivectomy-1-3', fee: 400 },
    { category: 'Periodontics', adaCode: 'X5527', description: 'Ging flap,root pln', fee: 800 },
    { category: 'Periodontics', adaCode: 'X5628', description: 'Perio scale/root p', fee: 300 },
    { category: 'Periodontics', adaCode: 'X6197', description: 'Periodontal maint', fee: 180 },
    { category: 'Periodontics', adaCode: 'X6208', description: 'Gingival Irrigation', fee: 50 },

    // Others
    { category: 'Oral Surgery', adaCode: 'X7140', description: 'Extraction, erupted tooth', fee: 300 },
    { category: 'Orthodontics', adaCode: 'D8080', description: 'Comp orthodontic treat', fee: 5000 },
    { category: 'Sleep Apnea', adaCode: 'SA001', description: 'Appliance Delivery', fee: 1800 },
];

export const VERIFICATION_STATUSES: VerificationStatus[] = [
  'To Verify', 'In Progress', 'Approved', 'Denied', 'Needs Follow-up', 'Awaiting Docs'
];

export const PLAN_TYPES: PlanType[] = [
  'PPO', 'HMO', 'EPO', 'Indemnity', 'Medicaid', 'Medicare', 'Other'
];

export const ASSIGNED_USERS = ['J. Cruz', 'L. Santos', 'A. Dizon', 'M. Garcia', 'R. Lim', 'Unassigned'];

export const RECORD_TYPES: RecordType[] = [
  'Progress Note', 'Lab Result', 'Imaging Report', 'Referral', 'Discharge Summary', 'Insurance Form', 'Miscellaneous'
];

export const RECORD_STATUSES: RecordStatus[] = [
  'Draft', 'Finalized', 'Signed', 'Archived'
];

export const DEPARTMENTS = ['General Dentistry', 'Pediatrics', 'Orthodontics', 'Endodontics', 'Periodontics', 'Oral Surgery'];

export const SANDBOX_TASKS = [
    {
        title: "Module 6: Insurance Verification",
        steps: [
            "**Search Hub:** Use the verification hub search bar or status filter.",
            "**Record Review:** Select and open a specific verification record from the table.",
            "**Log Attempt:** Record a manual attempt using the 'Save Attempt' button.",
            "**Update Status:** Change a record status (e.g., 'In Progress') and save.",
            "**Log Method:** Select at least one verification method (e.g., 'Portal').",
            "**Attach File:** Simulate a document attachment using the 'browse' link.",
            "**Bulk Update:** Use multi-select to update the status of several records."
        ]
    },
    {
        title: "Module 7: Treatment Planner",
        steps: [
            "**Worklist:** Access the global Treatment Planner clinical backlog.",
            "**Select Case:** Open a specific patient's treatment plan details.",
            "**Estimate:** Generate a simulated 'Treatment Estimate' PDF/document.",
            "**Filter Backlog:** Use the search tool to filter the clinical worklist.",
            "**Switch Context:** Use the back button to return to the global summary.",
            "**Review Items:** Select a pending clinical item to view its fee details.",
            "**Export Data:** Export the current worklist backlog to a CSV file."
        ]
    },
    {
        title: "Module 8: Medical Records",
        steps: [
            "**Global Filter:** Filter the master medical records list by 'Record Type'.",
            "**Confidentiality:** Mark a medical record as 'Confidential' and save the change.",
            "**Save Draft:** Create or edit a record and click 'Save Draft'.",
            "**Finalize:** Change a record status to 'Finalized' and save.",
            "**Sign Note:** Officially 'Sign' a finalized record to lock the clinical entry.",
            "**Archive Record:** Successfully change a record status to 'Archived' and save.",
            "**Link Verification:** Link a record to an active insurance verification ID."
        ]
    },
    {
        title: "Module 9: Patient Portal",
        steps: [
            "**Search Inbox:** Locate a specific message using the inbox search bar.",
            "**Review Unread:** Select an 'Unread' message from the sidebar list.",
            "**Patient File:** Use the 'View Patient File' button within a message thread.",
            "**Draft Reply:** Type a response into the secure reply text area.",
            "**Send Response:** Successfully transmit a portal reply to the patient.",
            "**Categorize:** Select a message and identify its 'Category' tag.",
            "**Thread History:** Review both the patient message and office reply together."
        ]
    },
    {
        title: "Module 10: Insurance Portal",
        steps: [
            "**Eligibility:** Manually enter a Member ID and DOB for a coverage inquiry.",
            "**Claim Entry:** Open the submission form and successfully transmit an EDI claim.",
            "**Network Audit**: Review specific Out-of-Network percentages in the procedural table.",
            "**Authorization:** Navigate to the 'Prior-Auths' tab and view case details.",
            "**Sort Auth:** Sort the authorizations table by 'Submitted' date or 'Status'.",
            "**Sync Hub:** Execute a 'Sync with Payer' command in the Settings tab.",
            "**Tab Navigation:** Successfully navigate between 'Claims', 'Inquiry', and 'Auths'."
        ]
    }
];
