
import React, { useState, useMemo } from 'react';
import { useSimulationContext } from '../../context/SimulationContext';
import { PatientDocument, Patient } from '../../types';

// --- Sub-components & Helpers ---

const DOC_CATEGORIES = ['Consent Forms', 'X-Rays', 'Insurance', 'Identification', 'Referral', 'Miscellaneous'] as const;

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'X-Rays': return '🩻';
        case 'Consent Forms': return '✍️';
        case 'Insurance': return '🛡️';
        case 'Identification': return '🪪';
        case 'Referral': return '📨';
        default: return '📄';
    }
};

const getSourceIcon = (source?: string) => {
    if (source === 'Fax') return '📠';
    if (source === 'Scan') return '🖨️';
    return '📁';
};

// --- Modals ---

const DocumentPropertiesModal: React.FC<{
    document: PatientDocument;
    onClose: () => void;
    onSave: (doc: PatientDocument) => void;
    title: string;
}> = ({ document, onClose, onSave, title }) => {
    const [name, setName] = useState(document.name);
    const [category, setCategory] = useState(document.category);
    const [notes, setNotes] = useState(document.notes || '');

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up">
                <div className="bg-[#1e293b] p-5 text-white flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest">{title}</h3>
                    <button onClick={onClose} className="hover:opacity-70">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Document Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-blue-200" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-bold outline-none focus:border-blue-200">
                            {DOC_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Clinical / Admin Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 font-medium outline-none focus:border-blue-200 h-28 resize-none" placeholder="Add specific details or findings..." />
                    </div>
                </div>
                <div className="p-5 border-t bg-gray-50 flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 uppercase tracking-widest">Cancel</button>
                    <button onClick={() => onSave({ ...document, name, category, notes })} className="px-8 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const AssignDocumentModal: React.FC<{
    document: PatientDocument;
    onClose: () => void;
}> = ({ document, onClose }) => {
    const { state, dispatch } = useSimulationContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [docData, setDocData] = useState<PatientDocument>(document);

    const filteredPatients = useMemo(() => {
        if (!searchTerm) return [];
        const term = searchTerm.toLowerCase();
        return state.patients.filter(p => 
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(term) || 
            p.id.toString().includes(term) ||
            p.chartNumber?.toLowerCase().includes(term)
        ).slice(0, 5);
    }, [searchTerm, state.patients]);

    const handleAssign = () => {
        if (!selectedPatient) return;
        dispatch({
            type: 'ASSIGN_DOCUMENT_TO_PATIENT',
            payload: {
                documentId: document.id,
                patientId: selectedPatient.id,
                finalDocument: { ...docData, uploadDate: new Date().toISOString().split('T')[0] }
            }
        });
        dispatch({ type: 'ADD_TOAST', payload: { message: `Document filed to ${selectedPatient.lastName}'s record.`, type: 'success' } });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[200] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
                <div className="md:w-2/5 bg-slate-900 flex flex-col p-8 relative">
                    <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Original File Preview</h3>
                    <div className="flex-grow rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl relative group">
                        <img src={document.previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white font-black uppercase text-[10px] tracking-widest border border-white/30">View High-Res</span>
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4 text-slate-400">
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500">Source</p>
                            <p className="text-xs font-bold text-white flex items-center gap-2">
                                <span>{getSourceIcon(document.source)}</span>
                                {document.source || 'Direct Upload'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase text-slate-500">Transmitted</p>
                            <p className="text-xs font-bold text-white">{document.uploadDate}</p>
                        </div>
                    </div>
                </div>

                <div className="md:w-3/5 p-10 space-y-8 flex flex-col">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">Process Incoming</h2>
                        <p className="text-sm text-slate-400 font-medium mt-2">File this document into a specific patient record and assign a category.</p>
                    </div>

                    <div className="space-y-6 flex-grow">
                        {/* Patient Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Target Patient Record</label>
                            {selectedPatient ? (
                                <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-600 rounded-2xl animate-fade-in-fast">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">{selectedPatient.lastName[0]}</div>
                                        <div>
                                            <p className="font-black text-slate-800 uppercase tracking-tight">{selectedPatient.lastName}, {selectedPatient.firstName}</p>
                                            <p className="text-[10px] text-blue-600 font-bold uppercase">Chart #: {selectedPatient.chartNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPatient(null)} className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-tighter">Change</button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search by Name, Chart #, or ID..." 
                                        className="w-full p-4 pl-12 border-2 border-slate-100 rounded-2xl text-sm focus:border-blue-400 outline-none transition-all font-bold shadow-sm"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                    <span className="absolute left-4 top-4 text-slate-400">🔍</span>
                                    {filteredPatients.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-down">
                                            {filteredPatients.map(p => (
                                                <button 
                                                    key={p.id} 
                                                    onClick={() => setSelectedPatient(p)}
                                                    className="w-full text-left p-4 hover:bg-slate-50 border-b last:border-b-0 flex justify-between items-center group"
                                                >
                                                    <div>
                                                        <p className="font-black text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.lastName}, {p.firstName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">DOB: {p.dob}</p>
                                                    </div>
                                                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-black text-slate-400 uppercase">Select</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest pl-1">New Filename</label>
                                <input type="text" value={docData.name} onChange={e => setDocData({...docData, name: e.target.value})} className="w-full p-3 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-200 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest pl-1">Assign Category</label>
                                <select value={docData.category} onChange={e => setDocData({...docData, category: e.target.value as any})} className="w-full p-3 border-2 border-slate-100 rounded-xl text-sm font-bold focus:border-blue-200 outline-none bg-white">
                                    {DOC_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest pl-1">Internal Records Narrative</label>
                            <textarea value={docData.notes || ''} onChange={e => setDocData({...docData, notes: e.target.value})} className="w-full p-4 border-2 border-slate-100 rounded-2xl text-sm font-medium focus:border-blue-200 outline-none h-24 resize-none" placeholder="Describe clinical relevance or scan quality..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button onClick={onClose} className="px-6 py-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Discard Task</button>
                        <button 
                            onClick={handleAssign} 
                            disabled={!selectedPatient}
                            className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all active:scale-95"
                        >
                            Finalize Filing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Module ---

const DocumentCenter: React.FC = () => {
    const { state, dispatch } = useSimulationContext();
    const { patients, selectedPatientId, unassignedDocuments } = state;
    const patient = patients.find(p => p.id === selectedPatientId);
    
    const [view, setView] = useState<'patient' | 'inbox' | 'archive'>('patient');
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<'date' | 'name'>('date');
    const [selectedDoc, setSelectedDoc] = useState<PatientDocument | null>(null);
    const [editingDoc, setEditingDoc] = useState<PatientDocument | null>(null);

    const handleUpload = () => {
        const isInbox = view === 'inbox' || view === 'archive';
        const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, '');
        const name = `${isInbox ? 'Incoming_EOB' : 'Patient_Doc'}_${timestamp}.pdf`;
        
        const newDoc: Omit<PatientDocument, 'id'> = {
            name,
            category: 'Miscellaneous',
            uploadDate: new Date().toISOString().split('T')[0],
            previewUrl: `https://picsum.photos/seed/${Date.now()}/400/500`,
            source: 'Scan',
        };

        if (isInbox) {
            dispatch({ type: 'ADD_UNASSIGNED_DOCUMENT', payload: newDoc });
            dispatch({ type: 'ADD_TOAST', payload: { message: 'New scan received in Incoming Inbox.', type: 'info' } });
        } else if (patient) {
            dispatch({ type: 'ADD_DOCUMENT', payload: { patientId: patient.id, document: newDoc } });
            dispatch({ type: 'ADD_TOAST', payload: { message: 'File uploaded to patient chart.', type: 'success' } });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this digital record?')) {
            if (view === 'inbox') dispatch({ type: 'DELETE_UNASSIGNED_DOCUMENT', payload: id });
            // Add global delete logic if needed, otherwise this is sufficient for sandbox
        }
    };

    const handleUpdateDocument = (updatedDoc: PatientDocument) => {
        if (patient) {
            // Re-use UPDATE_PATIENT for document metadata edits by updating the whole patient
            const updatedDocs = patient.documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
            dispatch({ type: 'UPDATE_PATIENT', payload: { ...patient, documents: updatedDocs } });
            dispatch({ type: 'ADD_TOAST', payload: { message: 'Document metadata updated successfully.', type: 'success' } });
        }
        setEditingDoc(null);
    };

    const masterDocs = useMemo(() => {
        if (view === 'patient') return patient?.documents || [];
        if (view === 'inbox') return unassignedDocuments;
        // Archive view: combined for office-wide visibility
        return [...unassignedDocuments, ...patients.flatMap(p => p.documents.map(d => ({ ...d, patientName: `${p.lastName}, ${p.firstName}` })))];
    }, [view, patient, unassignedDocuments, patients]);

    const filteredDocs = useMemo(() => {
        let docs = [...masterDocs];
        if (categoryFilter !== 'All') docs = docs.filter(d => d.category === categoryFilter);
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            docs = docs.filter(d => d.name.toLowerCase().includes(lower) || d.notes?.toLowerCase().includes(lower));
        }
        return docs.sort((a, b) => {
            if (sortKey === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            return a.name.localeCompare(b.name);
        });
    }, [masterDocs, categoryFilter, searchTerm, sortKey]);

    return (
        <div className="bg-[#f8fafc] h-full shadow-lg rounded-md overflow-hidden flex animate-slide-in-from-right">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r bg-[#1e293b] text-white flex flex-col p-4">
                <div className="mb-10 px-2">
                    <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">📁</span>
                        DocCenter
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Management v2.5</p>
                </div>

                <nav className="flex-grow space-y-1">
                    <NavButton active={view === 'patient'} onClick={() => setView('patient')} icon="👤" label="Patient Files" count={patient?.documents.length} />
                    <NavButton active={view === 'inbox'} onClick={() => setView('inbox')} icon="📬" label="Office Inbox" count={unassignedDocuments.length} isUrgent={unassignedDocuments.length > 0} />
                    <NavButton active={view === 'archive'} onClick={() => setView('archive')} icon="🏛️" label="Master Archive" />
                </nav>

                <div className="mt-auto p-4 bg-slate-800 rounded-2xl border border-slate-700">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Storage Analytics</p>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
                        <div className="bg-blue-400 h-full w-[42%]"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>4.2 GB used</span>
                        <span>42%</span>
                    </div>
                </div>
            </aside>

            {/* Main Workspace */}
            <main className="flex-grow flex flex-col min-w-0">
                {/* Unified Toolbar */}
                <header className="p-6 bg-white border-b flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">
                                {view === 'patient' ? `Patient: ${patient?.lastName || 'None'}` : view === 'inbox' ? 'Office Intake' : 'Archived Records'}
                            </h2>
                            <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-widest">
                                {view === 'patient' ? 'Secure repository of patient-specific digital assets.' : 'Incoming faxes and scans awaiting identification.'}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleUpload} className="px-6 py-3 bg-[#1e293b] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg transition-all active:scale-95 flex items-center gap-3">
                                <span className="text-lg">+</span> {view === 'inbox' ? 'Manual Fax Simulation' : 'Upload to Record'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setCategoryFilter('All')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${categoryFilter === 'All' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>All Docs</button>
                            {DOC_CATEGORIES.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${categoryFilter === cat ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-300">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search by name or note..." 
                                    className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none w-64 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                             </div>
                             <select value={sortKey} onChange={e => setSortKey(e.target.value as any)} className="bg-transparent text-xs font-black uppercase text-slate-400 focus:ring-0 outline-none cursor-pointer hover:text-slate-600">
                                <option value="date">Newest Files</option>
                                <option value="name">A-Z Name</option>
                             </select>
                        </div>
                    </div>
                </header>

                {/* Document Grid */}
                <div className="flex-grow overflow-y-auto p-8">
                    {view === 'patient' && !patient ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 max-w-sm mx-auto text-center space-y-4">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-5xl">👤</div>
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Context Selected</h3>
                            <p className="text-sm font-medium">Please select a patient from the Family File to access their private clinical document vault.</p>
                        </div>
                    ) : filteredDocs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                            {filteredDocs.map(doc => (
                                <div key={doc.id} className="group bg-white rounded-3xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full">
                                    <div className="relative h-44 overflow-hidden bg-slate-200">
                                        <img src={doc.previewUrl} alt={doc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                             <div className="flex gap-2 w-full">
                                                 <button onClick={() => window.open(doc.previewUrl)} className="flex-grow py-2 bg-white/20 backdrop-blur-md rounded-lg text-white font-black uppercase text-[9px] tracking-widest border border-white/30 hover:bg-white/40">View</button>
                                                 {view === 'patient' && (
                                                     <button onClick={() => setEditingDoc(doc)} className="px-3 py-2 bg-white rounded-lg text-slate-800 font-black text-xs hover:bg-slate-50 transition-colors">✎</button>
                                                 )}
                                             </div>
                                        </div>
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase shadow-sm flex items-center gap-1.5 border border-slate-100">
                                                <span>{getSourceIcon(doc.source)}</span>
                                                {doc.source || 'Upload'}
                                            </span>
                                        </div>
                                        {view === 'archive' && (doc as any).patientName && (
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2 py-1 bg-blue-600/90 text-white rounded text-[8px] font-black uppercase shadow-lg">ARCHIVED</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-5 flex-grow space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="text-sm font-black text-slate-800 leading-tight truncate group-hover:text-blue-600 transition-colors" title={doc.name}>{doc.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getCategoryIcon(doc.category)}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.category}</span>
                                        </div>
                                        {view === 'archive' && (doc as any).patientName && (
                                            <p className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-lg truncate">Account: {(doc as any).patientName}</p>
                                        )}
                                        {doc.notes && <p className="text-[11px] text-slate-500 font-medium line-clamp-2 italic leading-relaxed border-l-2 border-slate-100 pl-3">"{doc.notes}"</p>}
                                    </div>

                                    <div className="px-5 pb-5 mt-auto flex items-center justify-between text-[10px] font-bold text-slate-400 border-t pt-4 border-slate-50">
                                        <span>Uploaded: {doc.uploadDate}</span>
                                        <div className="flex items-center gap-2">
                                            {view === 'inbox' ? (
                                                <button onClick={() => setSelectedDoc(doc)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-black uppercase tracking-tighter hover:bg-blue-700 transition-all">Process File</button>
                                            ) : (
                                                <button className="p-1 hover:text-red-500 transition-colors" title="Remove Record" onClick={() => handleDelete(doc.id)}>🗑️</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center py-20 animate-fade-in-fast">
                            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] shadow-inner flex items-center justify-center text-5xl mb-8">🕳️</div>
                            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Vault Empty</h3>
                            <p className="max-w-md font-medium text-slate-500 leading-relaxed">No digital assets matching your criteria were found in the current view. Try adjusting your filters or simulate an intake scan.</p>
                            {view === 'inbox' && (
                                <button onClick={handleUpload} className="mt-10 px-8 py-3 border-2 border-slate-200 rounded-2xl text-xs font-black uppercase text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all">Trigger Demo Scan</button>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            {/* Context Modals */}
            {selectedDoc && <AssignDocumentModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />}
            {editingDoc && <DocumentPropertiesModal document={editingDoc} onClose={() => setEditingDoc(null)} onSave={handleUpdateDocument} title="Clinical Record Properties" />}
        </div>
    );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string; count?: number; isUrgent?: boolean }> = ({ active, onClick, icon, label, count, isUrgent }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center justify-between transition-all group ${active ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
        <div className="flex items-center gap-4">
            <span className={`text-lg transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
            <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {count !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isUrgent ? 'bg-red-500 text-white animate-pulse' : active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {count}
            </span>
        )}
    </button>
);

export default DocumentCenter;
