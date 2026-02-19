
import React, { createContext, useReducer, useContext, Dispatch, PropsWithChildren } from 'react';
import { Patient, Appointment, LoggedAction, LedgerEntry, ToothState, ToothStatus, PatientDocument, SimulationState, InsuranceVerification, AuditEntry, MedicalRecord, ToastMessage, Task, PortalMessage, PreAuthorization, InsuranceClaim, RecallType } from '../types';
import { PATIENTS_DATA, APPOINTMENTS_DATA } from '../data/patients';
import { VERIFICATIONS_DATA } from '../data/verifications';
import { MEDICAL_RECORDS_DATA } from '../data/medicalRecords';
import { SANDBOX_TASKS } from '../constants';

type Action =
  | { type: 'SELECT_PATIENT'; payload: number | null }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: number }
  | { type: 'SCHEDULE_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string } 
  | { type: 'CANCEL_APPOINTMENT'; payload: string } 
  | { type: 'ADD_LEDGER_ENTRY'; payload: { patientId: number; entry: Omit<LedgerEntry, 'id' | 'balance'> } }
  | { type: 'UPDATE_CHART'; payload: { patientId: number; toothState: ToothState } }
  | { type: 'BULK_UPDATE_CHART'; payload: { patientId: number; updates: ToothState[] } }
  | { type: 'LOG_ACTION'; payload: { type: string; details: any } }
  | { type: 'ADD_FAMILY_MEMBER'; payload: { patientData: Patient; familyLinkToId: number } }
  | { type: 'ADD_DOCUMENT'; payload: { patientId: number; document: Omit<PatientDocument, 'id'> } }
  | { type: 'ADD_UNASSIGNED_DOCUMENT'; payload: Omit<PatientDocument, 'id'> }
  | { type: 'UPDATE_UNASSIGNED_DOCUMENT'; payload: PatientDocument }
  | { type: 'DELETE_UNASSIGNED_DOCUMENT'; payload: string }
  | { type: 'ASSIGN_DOCUMENT_TO_PATIENT'; payload: { documentId: string; patientId: number; finalDocument: PatientDocument } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'PIN_APPOINTMENT'; payload: string } 
  | { type: 'WAITLIST_APPOINTMENT'; payload: string } 
  | { type: 'MOVE_APPOINTMENT'; payload: { appointmentId: string; newStartTime: Date; newOperatory: number; source: 'calendar' | 'pinboard' | 'waitlist' } }
  | { type: 'UPDATE_DAY_NOTE'; payload: { date: string; note: string } }
  | { type: 'ADD_VERIFICATION'; payload: InsuranceVerification }
  | { type: 'UPDATE_VERIFICATION'; payload: InsuranceVerification }
  | { type: 'BULK_UPDATE_VERIFICATIONS'; payload: { ids: string[]; changes: Partial<InsuranceVerification> } }
  | { type: 'ADD_MEDICAL_RECORD'; payload: MedicalRecord }
  | { type: 'UPDATE_MEDICAL_RECORD'; payload: MedicalRecord }
  | { type: 'ADD_TOAST'; payload: Omit<ToastMessage, 'id'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'MOVE_PLANNED_TREATMENT'; payload: { patientId: number; sourceToothNumber: number; targetToothNumber: number } }
  | { type: 'TOGGLE_SANDBOX_STEP'; payload: { taskIndex: number; stepIndex: number } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'TOGGLE_TASK_COMPLETE'; payload: string }
  | { type: 'MARK_TASK_REMINDED'; payload: string }
  | { type: 'MARK_MESSAGE_READ'; payload: string }
  | { type: 'SEND_PORTAL_REPLY'; payload: { messageId: string; content: string } }
  | { type: 'ADD_PREAUTH'; payload: PreAuthorization }
  | { type: 'ADD_CLAIM'; payload: InsuranceClaim }
  | { type: 'UPDATE_CLAIM'; payload: InsuranceClaim }
  | { type: 'ADD_RECALL_TYPE'; payload: RecallType }
  | { type: 'UPDATE_RECALL_TYPE'; payload: RecallType }
  | { type: 'START_ASSESSMENT' }
  | { type: 'END_ASSESSMENT' }
  | { type: 'RESTART_ALL' };

const getPastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};

const initialState: SimulationState = {
  patients: PATIENTS_DATA,
  appointments: APPOINTMENTS_DATA,
  verifications: VERIFICATIONS_DATA,
  medicalRecords: MEDICAL_RECORDS_DATA,
  tasks: [
      { id: 't1', title: 'Verify benefits for J. Smith', dueDate: new Date(Date.now() + 1000 * 60 * 60).toISOString(), completed: false, reminded: false, priority: 'High' },
      { id: 't2', title: 'Call Lab regarding case #4422', dueDate: new Date(Date.now() + 1000 * 60 * 120).toISOString(), completed: false, reminded: false, priority: 'Medium' },
      { id: 't3', title: "Follow up on patient X's lab results", dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), completed: false, reminded: false, priority: 'High' },
  ],
  portalMessages: [
    { id: 'm1', patientId: 13, subject: 'Pain after SRP', content: 'Hi Dr. Jones, I am still having some lingering sensitivity after my scaling last week. Is this normal?', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), status: 'Unread', category: 'Medical Question' },
    { id: 'm2', patientId: 41, subject: 'Insurance question', content: 'I received a statement but thought my insurance covered 100%. Can you double check?', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: 'Unread', category: 'Billing' },
    { id: 'm3', patientId: 4, subject: 'Reschedule my extraction', content: 'Something came up for Thursday. Do you have anything next Monday morning instead?', timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), status: 'Unread', category: 'Appointment Request' },
    { id: 'm4', patientId: 6, subject: 'Antibiotic refill', content: 'My pharmacy says the prescription is out of refills. Can you send a new one?', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), status: 'Unread', category: 'Refill' },
    { id: 'm5', patientId: 1, subject: 'Thank you!', content: 'Just wanted to say the crown feels great. Thanks for the quick work!', timestamp: new Date(Date.now() - 1000 * 3600 * 24).toISOString(), status: 'Read', category: 'Other' },
  ],
  preAuthorizations: [
      { id: 'PA-1001', patientId: 1, dateSubmitted: getPastDate(15), status: 'Pending', payer: 'MetLife PPO', totalValue: 2100, items: [{ tooth: 13, procedure: 'RCT', fee: 900 }, { tooth: 14, procedure: 'Crown', fee: 1200 }] },
      { id: 'PA-1002', patientId: 4, dateSubmitted: getPastDate(45), status: 'More Info Required', payer: 'Cigna', totalValue: 300, items: [{ tooth: 30, procedure: 'Extraction', fee: 300 }] },
      { id: 'PA-1003', patientId: 6, dateSubmitted: getPastDate(5), status: 'Pending', payer: 'Aetna', totalValue: 900, items: [{ tooth: 18, procedure: 'RCT', fee: 900 }] },
      { id: 'PA-1004', patientId: 2, dateSubmitted: getPastDate(2), status: 'Approved', payer: 'Delta Dental', totalValue: 1200, items: [{ tooth: 2, procedure: 'Crown', fee: 1200 }] },
  ],
  recallTypes: [
    { id: 'r1', shortName: 'PRO', description: 'Adult Prophylaxis', intervalDays: 180, procedureCode: 'D1110' },
    { id: 'r2', shortName: 'PERIO', description: 'Periodontal Maintenance', intervalDays: 90, procedureCode: 'D4910' },
    { id: 'r3', shortName: 'BWX', description: 'Bite-Wings X-Ray', intervalDays: 365, procedureCode: 'D0274' },
    { id: 'r4', shortName: 'EXAM', description: 'Periodic Oral Exam', intervalDays: 180, procedureCode: 'D0120' },
  ],
  claims: [
      { 
        id: 'CLM-001', 
        patientId: 6, 
        dateCreated: getPastDate(5), 
        status: 'Sent', 
        carrier: 'Aetna', 
        totalAmount: 1200, 
        procedureIds: ['l6-1'], 
        diagnosticCodes: [],
        statusHistory: [{ date: getPastDate(5), status: 'Sent' }],
        attachments: { 
          images: [], 
          perioChartAttached: false, 
          photoAttached: false, 
          txPlanAttached: false 
        } 
      }
  ],
  selectedPatientId: 1,
  actions: [],
  history: { past: [], future: [] },
  pinboardAppointments: [],
  waitlistAppointments: [],
  unassignedDocuments: [],
  dayNotes: {},
  toasts: [],
  completedSandboxTasks: SANDBOX_TASKS.reduce((acc, task, index) => {
    acc[index] = Array(task.steps.length).fill(false);
    return acc;
  }, {} as Record<number, boolean[]>),
  assessmentMode: false,
  assessmentAttempts: 0,
};

function simulationReducer(state: SimulationState, action: Action): SimulationState {
  const verifyStep = (taskIdx: number, stepIdx: number, newState: SimulationState) => {
    const newCompleted = { ...newState.completedSandboxTasks };
    const steps = [...(newCompleted[taskIdx] || [])];
    if (!steps[stepIdx]) {
      steps[stepIdx] = true;
      newCompleted[taskIdx] = steps;
      return { ...newState, completedSandboxTasks: newCompleted };
    }
    return newState;
  };

  let nextState = state;

  switch (action.type) {
    case 'START_ASSESSMENT':
      return { ...initialState, assessmentMode: true, assessmentAttempts: state.assessmentAttempts + 1 };
    case 'END_ASSESSMENT':
      return { ...state, assessmentMode: false };
    case 'RESTART_ALL':
      return { ...initialState, assessmentAttempts: state.assessmentAttempts };
    case 'SELECT_PATIENT':
      nextState = { ...state, selectedPatientId: action.payload };
      break;
    case 'ADD_PATIENT': {
      const nextId = Math.max(...state.patients.map(p => p.id), 0) + 1;
      const newPatient = { ...action.payload, id: nextId };
      nextState = { ...state, patients: [...state.patients, newPatient], selectedPatientId: newPatient.id };
      break;
    }
    case 'UPDATE_PATIENT': {
      nextState = { ...state, patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p) };
      break;
    }
    case 'ADD_VERIFICATION':
        nextState = { ...state, verifications: [...state.verifications, action.payload] };
        nextState = verifyStep(0, 3, nextState);
        break;
    case 'UPDATE_VERIFICATION': {
        const oldVer = state.verifications.find(v => v.id === action.payload.id);
        nextState = { ...state, verifications: state.verifications.map(v => v.id === action.payload.id ? action.payload : v) };
        if (action.payload.status !== oldVer?.status) nextState = verifyStep(0, 3, nextState);
        if ((action.payload.verificationMethod?.length || 0) > 0) nextState = verifyStep(0, 4, nextState);
        if ((action.payload.attachments?.length || 0) > (oldVer?.attachments?.length || 0)) nextState = verifyStep(0, 5, nextState);
        break;
    }
    case 'BULK_UPDATE_VERIFICATIONS':
        nextState = { ...state, verifications: state.verifications.map(v => action.payload.ids.includes(v.id) ? { ...v, ...action.payload.changes } : v) };
        nextState = verifyStep(0, 6, nextState);
        break;
    case 'ADD_MEDICAL_RECORD': {
        nextState = { ...state, medicalRecords: [...state.medicalRecords, action.payload] };
        
        let priorityTriggered = false;
        if (action.payload.isConfidential && !state.completedSandboxTasks[2][1]) {
            nextState = verifyStep(2, 1, nextState);
            priorityTriggered = true;
        }

        if (!priorityTriggered) {
            if (action.payload.status === 'Draft') nextState = verifyStep(2, 2, nextState);
            else if (action.payload.status === 'Finalized') nextState = verifyStep(2, 3, nextState);
            else if (action.payload.status === 'Archived') nextState = verifyStep(2, 5, nextState);
        }

        if (action.payload.signature) nextState = verifyStep(2, 4, nextState);
        if (action.payload.relatedInsuranceVerificationId) nextState = verifyStep(2, 6, nextState);
        break;
    }
    case 'UPDATE_MEDICAL_RECORD': {
        const oldRec = state.medicalRecords.find(r => r.id === action.payload.id);
        nextState = { ...state, medicalRecords: state.medicalRecords.map(r => r.id === action.payload.id ? action.payload : r) };
        
        let priorityTriggered = false;
        if (action.payload.isConfidential && !oldRec?.isConfidential && !state.completedSandboxTasks[2][1]) {
            nextState = verifyStep(2, 1, nextState);
            priorityTriggered = true;
        }

        if (!priorityTriggered) {
            if (action.payload.status === 'Draft' && oldRec?.status !== 'Draft') nextState = verifyStep(2, 2, nextState);
            else if (action.payload.status === 'Finalized' && oldRec?.status !== 'Finalized') nextState = verifyStep(2, 3, nextState);
            else if (action.payload.status === 'Archived' && oldRec?.status !== 'Archived') nextState = verifyStep(2, 5, nextState);
        }

        if (action.payload.signature && !oldRec?.signature) nextState = verifyStep(2, 4, nextState);
        if (action.payload.relatedInsuranceVerificationId && !oldRec?.relatedInsuranceVerificationId) nextState = verifyStep(2, 6, nextState);
        break;
    }
    case 'SEND_PORTAL_REPLY':
        nextState = { ...state, portalMessages: state.portalMessages.map(m => m.id === action.payload.messageId ? { ...m, status: 'Processed', replyContent: action.payload.content, replyTimestamp: new Date().toISOString() } : m) };
        nextState = verifyStep(3, 4, nextState); 
        break;
    case 'MARK_MESSAGE_READ':
        nextState = { ...state, portalMessages: state.portalMessages.map(m => m.id === action.payload ? { ...m, status: 'Read' } : m) };
        nextState = verifyStep(3, 1, nextState); 
        break;
    case 'LOG_ACTION':
        nextState = { ...state, actions: [...state.actions, { ...action.payload, timestamp: new Date() }] };
        const { type, details } = action.payload;

        if (type === 'navigate_module') {
            if (details.module === 'Treatment Planner') nextState = verifyStep(1, 0, nextState); 
        }
        
        if (type === 'filter_verifications') nextState = verifyStep(0, 0, nextState);
        if (type === 'view_verification_details') nextState = verifyStep(0, 1, nextState);
        if (type === 'save_verification_attempt') nextState = verifyStep(0, 2, nextState);

        if (type === 'view_planner_details') nextState = verifyStep(1, 1, nextState);
        if (type === 'generate_estimate') nextState = verifyStep(1, 2, nextState);
        if (type === 'search_worklist') nextState = verifyStep(1, 3, nextState);
        if (type === 'planner_switch_context') nextState = verifyStep(1, 4, nextState);
        if (type === 'review_planner_item') nextState = verifyStep(1, 5, nextState);

        if (type === 'filter_medical_records') nextState = verifyStep(2, 0, nextState);

        if (type === 'search_portal_inbox') nextState = verifyStep(3, 0, nextState);
        if (type === 'navigate_to_patient_file') nextState = verifyStep(3, 2, nextState);
        if (type === 'save_portal_draft') nextState = verifyStep(3, 3, nextState);
        if (type === 'portal_view_category') nextState = verifyStep(3, 5, nextState);
        if (type === 'view_portal_thread' && details.hasReply) nextState = verifyStep(3, 6, nextState);
        
        if (type === 'portal_eligibility_inquiry') nextState = verifyStep(4, 0, nextState);
        if (type === 'transmit_edi_claim') nextState = verifyStep(4, 1, nextState);
        if (type === 'portal_network_audit') nextState = verifyStep(4, 2, nextState);
        if (type === 'portal_view_auth_details') nextState = verifyStep(4, 3, nextState);
        if (type === 'portal_sort_auth') nextState = verifyStep(4, 4, nextState);
        if (type === 'portal_sync_settings') nextState = verifyStep(4, 5, nextState);
        if (type === 'portal_tab_switch') nextState = verifyStep(4, 6, nextState);
        break;
    case 'ADD_TOAST':
        nextState = { ...state, toasts: [...state.toasts, { ...action.payload, id: `toast-${Date.now()}` }] };
        if (action.payload.message.toLowerCase().includes('export')) {
            nextState = verifyStep(1, 6, nextState);
        }
        break;
    case 'TOGGLE_SANDBOX_STEP': {
        const { taskIndex, stepIndex } = action.payload;
        const newCompletedTasks = { ...state.completedSandboxTasks };
        const taskSteps = [...(newCompletedTasks[taskIndex] || [])];
        taskSteps[stepIndex] = !taskSteps[stepIndex];
        newCompletedTasks[taskIndex] = taskSteps;
        nextState = { ...state, completedSandboxTasks: newCompletedTasks };
        break;
    }
    case 'DELETE_PATIENT':
        nextState = { ...state, patients: state.patients.filter(p => p.id !== action.payload), selectedPatientId: null };
        break;
    case 'REMOVE_TOAST':
        nextState = { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        break;
    default:
        return state;
  }
  return nextState;
}

export const SimulationContext = createContext<{ state: SimulationState; dispatch: Dispatch<Action> } | undefined>(undefined);

export const SimulationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  return <SimulationContext.Provider value={{ state, dispatch }}>{children}</SimulationContext.Provider>;
};

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) throw new Error('useSimulationContext must be used within a SimulationProvider');
  return context;
};
