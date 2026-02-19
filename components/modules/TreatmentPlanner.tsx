
import React, { useState, useMemo, useEffect } from 'react';
import { useSimulationContext } from '../../context/SimulationContext';
import { ToothStatus, Patient, Module, ToothState } from '../../types';
import { TREATMENTS } from '../../constants';

// --- Sub-components for Pre-Auth Workflow ---

const ItemizePreAuthModal: React.FC<{
    procedure: { tooth: number; description: string; fee: number };
    onCancel: () => void;
    onOk: (data: { status: 'Accepted' | 'Rejected'; amountPaid: number; allowedAmount: number }) => void;
    insPercentage: number;
}> = ({ procedure, onCancel, onOk, insPercentage }) => {
    const [status, setStatus] = useState<'Accepted' | 'Rejected'>('Accepted');
    const [amountPaid, setAmountPaid] = useState((procedure.fee * (insPercentage / 100)).toFixed(2));
    const [paymentTable, setPaymentTable] = useState(procedure.fee.toFixed(2));
    const [allowedAmount, setAllowedAmount] = useState(procedure.fee.toFixed(2));

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] font-sans">
            <div className="bg-[#D4D0C8] border-2 border-[#808080] shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] w-80 overflow-hidden">
                <div className="bg-[#000080] px-2 py-1 flex justify-between items-center text-white font-bold text-xs">
                    <span>Itemize PreAuth</span>
                    <button onClick={onCancel} className="bg-[#D4D0C8] text-black px-1 border border-[#808080] text-[10px] leading-none h-4 w-4">X</button>
                </div>
                <div className="p-4 space-y-4">
                    <fieldset className="border border-white border-b-[#808080] border-r-[#808080] p-2 pt-1">
                        <legend className="text-[11px] px-1">Procedure Status</legend>
                        <div className="flex gap-4 text-[11px]">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="radio" checked={status === 'Accepted'} onChange={() => setStatus('Accepted')} />
                                Accepted
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="radio" checked={status === 'Rejected'} onChange={() => setStatus('Rejected')} />
                                Rejected
                            </label>
                        </div>
                    </fieldset>

                    <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-1">Amount Paid: <span className="cursor-help" title="Estimated insurance portion">❔</span></label>
                            <input type="text" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="w-24 bg-white border border-inset border-[#808080] px-1 text-right outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                            <label>Payment Table:</label>
                            <input type="text" value={paymentTable} onChange={e => setPaymentTable(e.target.value)} className="w-24 bg-white border border-inset border-[#808080] px-1 text-right outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                            <label>Allowed Amount:</label>
                            <input type="text" value={allowedAmount} onChange={e => setAllowedAmount(e.target.value)} className="w-24 bg-white border border-inset border-[#808080] px-1 text-right outline-none" />
                        </div>
                    </div>

                    <div className="flex justify-center gap-2 pt-2">
                        <button onClick={() => onOk({ status, amountPaid: Number(amountPaid), allowedAmount: Number(allowedAmount) })} className="bg-[#D4D0C8] border-2 border-white border-b-[#808080] border-r-[#808080] px-6 py-0.5 text-xs font-medium active:border-inset active:translate-y-0.5">OK</button>
                        <button onClick={onCancel} className="bg-[#D4D0C8] border-2 border-white border-b-[#808080] border-r-[#808080] px-6 py-0.5 text-xs font-medium active:border-inset active:translate-y-0.5">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TotalInsurancePreauthorizationModal: React.FC<{
    totalBilled: number;
    itemizedTotal: number;
    onClose: () => void;
    onPost: (preAuthNum: string, totalEstimate: number) => void;
}> = ({ totalBilled, itemizedTotal, onClose, onPost }) => {
    const [preAuthNum, setPreAuthNum] = useState('');
    const [totalEstimate, setTotalEstimate] = useState(itemizedTotal.toFixed(2));
    const [authorizeDate] = useState(new Date().toLocaleDateString('en-US'));

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[110] font-sans">
            <div className="bg-[#D4D0C8] border-2 border-[#808080] shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] w-80 overflow-hidden">
                <div className="bg-[#000080] px-2 py-1 flex justify-between items-center text-white font-bold text-xs">
                    <span>Total Insurance Preauthorization</span>
                    <button onClick={onClose} className="bg-[#D4D0C8] text-black px-1 border border-[#808080] text-[10px] leading-none h-4 w-4">X</button>
                </div>
                <div className="p-4 space-y-3 flex flex-col items-end">
                    <div className="flex items-center gap-2 text-[11px] w-full justify-end">
                        <label>Authorize Date:</label>
                        <input type="text" value={authorizeDate} readOnly className="w-28 bg-[#D4D0C8] border border-transparent px-1 outline-none text-right" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] w-full justify-end">
                        <label>PreAuth Number:</label>
                        <input type="text" value={preAuthNum} onChange={e => setPreAuthNum(e.target.value)} className="w-28 bg-white border border-inset border-[#808080] px-1 outline-none" autoFocus />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] w-full justify-end">
                        <label>Coverage Amount:</label>
                        <input type="text" value={totalEstimate} readOnly className="w-28 bg-[#D4D0C8] border border-transparent px-1 outline-none text-right" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] w-full justify-end">
                        <label>Total Amount Billed:</label>
                        <input type="text" value={totalBilled.toFixed(2)} readOnly className="w-28 bg-[#D4D0C8] border border-transparent px-1 outline-none text-right" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] w-full justify-end">
                        <label>Itemized Total:</label>
                        <input type="text" value={itemizedTotal.toFixed(2)} readOnly className="w-28 bg-[#D4D0C8] border border-transparent px-1 outline-none text-right" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] w-full justify-end">
                        <label>Total Estimate:</label>
                        <input type="text" value={totalEstimate} onChange={e => setTotalEstimate(e.target.value)} className="w-28 bg-white border border-inset border-[#808080] px-1 outline-none text-right" />
                    </div>

                    <div className="w-full flex flex-col gap-2 pt-2 pl-24">
                        <button disabled className="bg-[#D4D0C8] border-2 border-white border-b-[#808080] border-r-[#808080] px-2 py-0.5 text-xs font-medium opacity-50 cursor-not-allowed">Delete</button>
                        <button onClick={() => onPost(preAuthNum, Number(totalEstimate))} className="bg-[#D4D0C8] border-2 border-white border-b-[#808080] border-r-[#808080] px-2 py-0.5 text-xs font-black uppercase tracking-widest active:border-inset active:translate-y-0.5">OK/Post</button>
                        <button onClick={onClose} className="bg-[#D4D0C8] border-2 border-white border-b-[#808080] border-r-[#808080] px-2 py-0.5 text-xs font-medium active:border-inset active:translate-y-0.5">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Estimate Document Modal ---

const EstimateDocumentModal: React.FC<{
    patient: Patient;
    procedures: any[];
    onClose: () => void;
}> = ({ patient, procedures, onClose }) => {
    const total = procedures.reduce((sum, p) => sum + (p.fee || 0), 0);
    const insPercentage = patient.primaryInsurance?.coveragePercentage || 0;
    const insEst = total * (insPercentage / 100);
    const patientEst = total - insEst;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4">
            <div className="bg-white w-full max-w-4xl max-h-full overflow-y-auto rounded-sm shadow-2xl flex flex-col border border-gray-400">
                <div className="p-8 space-y-10">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-black text-blue-900 tracking-tighter uppercase">Treatment Estimate</h1>
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Office ID: SIM-DENT-001</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-gray-800 uppercase">Prepared For:</p>
                            <p className="text-sm font-bold text-gray-600">{patient.lastName}, {patient.firstName}</p>
                            <p className="text-[10px] text-gray-400">Chart: {patient.chartNumber}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border border-gray-200">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                    <th className="px-4 py-3 text-left">Tooth</th>
                                    <th className="px-4 py-3 text-left">ADA Code</th>
                                    <th className="px-4 py-3 text-left">Description</th>
                                    <th className="px-4 py-3 text-right">Fee</th>
                                    <th className="px-4 py-3 text-right">Insurance Est.</th>
                                    <th className="px-4 py-3 text-right">Patient Portion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {procedures.map((p, i) => {
                                    const pIns = (p.fee || 0) * (insPercentage / 100);
                                    const pPt = (p.fee || 0) - pIns;
                                    return (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold">#{p.toothNumber}</td>
                                            <td className="px-4 py-3 font-mono text-blue-600">D{Math.floor(Math.random() * 9000) + 1000}</td>
                                            <td className="px-4 py-3 font-medium text-gray-700">{p.procedure}</td>
                                            <td className="px-4 py-3 text-right">${(p.fee || 0).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right text-green-600">${pIns.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-black text-gray-900">${pPt.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-gray-900 text-white font-black">
                                <tr>
                                    <td colSpan={3} className="px-4 py-4 text-right uppercase text-[10px] tracking-widest text-gray-400">Total Project Value</td>
                                    <td className="px-4 py-4 text-right">${total.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right text-green-400">${insEst.toFixed(2)}</td>
                                    <td className="px-4 py-4 text-right text-lg">${patientEst.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Insurance Notes</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                This is an estimate only based on your current insurance plan ({patient.primaryInsurance?.company}). 
                                Actual coverage may vary once the claim is adjudicated by the payer. Pre-authorization is recommended for all major services.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Patient Signature</h4>
                            <div className="h-16 border-b-2 border-dashed border-gray-300"></div>
                            <p className="text-[10px] text-gray-400 text-center">I authorize the proposed treatment plan as outlined above.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-xs font-black uppercase text-gray-500 hover:text-gray-700">Close</button>
                    <button onClick={() => window.print()} className="px-8 py-2 bg-blue-600 text-white rounded shadow-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700">Print Form</button>
                </div>
            </div>
        </div>
    );
};

// --- Main Components ---

const KPICard: React.FC<{ title: string; value: string | number; icon: string; color: 'blue' | 'green' | 'orange' | 'purple' | 'indigo' }> = ({ title, value, icon, color }) => {
    const variants = {
        blue: 'border-blue-500 text-blue-700 bg-blue-50',
        green: 'border-green-500 text-green-700 bg-green-50',
        orange: 'border-orange-500 text-orange-700 bg-orange-50',
        purple: 'border-purple-500 text-purple-700 bg-purple-50',
        indigo: 'border-indigo-500 text-indigo-700 bg-indigo-50',
    };
    return (
        <div className={`p-5 rounded-2xl border-l-8 shadow-sm bg-white ${variants[color]} transition-all hover:shadow-md`}>
            <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider opacity-60">{title}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <div className="text-3xl font-black">{value}</div>
        </div>
    );
};

const PriorityBadge: React.FC<{ value: number }> = ({ value }) => {
    if (value >= 2000) return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase border border-red-200">High Priority</span>;
    if (value >= 1000) return <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase border border-orange-200">Medium</span>;
    return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase border border-blue-200">General</span>;
};

// --- Summary View ---

const TreatmentPlannerSummary: React.FC<{ onSelectPatient: (id: number) => void }> = ({ onSelectPatient }) => {
    const { state, dispatch } = useSimulationContext();
    const [searchTerm, setSearchTerm] = useState('');

    const worklist = useMemo(() => {
        const list = state.patients.map(p => {
            const planned = p.chart.filter(t => t.status === ToothStatus.TreatmentPlanned);
            const totalValue = planned.reduce((sum, t) => sum + (t.fee || 0), 0);
            const insCoverage = p.primaryInsurance?.coveragePercentage || 0;
            const insEst = totalValue * (insCoverage / 100);
            const aging = Math.floor(Math.random() * 60) + 1;

            return {
                id: p.id,
                name: `${p.lastName}, ${p.firstName}`,
                chartNumber: p.chartNumber || 'N/A',
                procedureCount: planned.length,
                totalValue,
                insEst,
                patientPortion: totalValue - insEst,
                lastVisit: p.lastVisitDate || 'N/A',
                aging,
                procedures: planned.map(t => t.procedure).join(', ')
            };
        }).filter(item => item.procedureCount > 0);

        return list.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.chartNumber.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => b.totalValue - a.totalValue);
    }, [state.patients, searchTerm]);

    const metrics = useMemo(() => {
        const totalBacklog = worklist.reduce((sum, p) => sum + p.totalValue, 0);
        const totalProcs = worklist.reduce((sum, p) => sum + p.procedureCount, 0);
        const highValueCases = worklist.filter(p => p.totalValue > 1500).length;
        const totalAwaitingPreAuth = Math.floor(worklist.length * 0.4);
        
        return { totalBacklog, totalProcs, highValueCases, totalAwaitingPreAuth };
    }, [worklist]);

    const handleExportWorklist = () => {
        dispatch({ type: 'ADD_TOAST', payload: { message: `Exporting worklist of ${worklist.length} cases to CSV...`, type: 'success' } });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            dispatch({ type: 'LOG_ACTION', payload: { type: 'search_worklist', details: { query: e.target.value } } });
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 p-4 space-y-6 overflow-auto animate-slide-in-from-right">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Production Dashboard</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Global Treatment Plan Backlog • {state.patients.length} Active Patients Evaluated</p>
                </div>
                <div className="flex gap-3">
                    <div className="text-right mr-4 border-r pr-4">
                        <div className="text-[10px] font-black text-gray-400 uppercase">Case Acceptance</div>
                        <div className="flex items-center gap-2">
                             <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-green-500 h-full" style={{ width: '68%' }}></div>
                             </div>
                             <span className="text-sm font-black text-green-600">68%</span>
                        </div>
                    </div>
                    <button onClick={handleExportWorklist} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase hover:bg-slate-700 shadow-md transition-all active:scale-95 flex items-center gap-2">
                        <span>📥</span> Export Worklist
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-700 shadow-md transition-all active:scale-95 flex items-center gap-2">
                        <span>📞</span> Bulk Call List
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Proposed Revenue" value={`$${metrics.totalBacklog.toLocaleString()}`} icon="🏛️" color="indigo" />
                <KPICard title="High-Value Plans" value={metrics.highValueCases} icon="💎" color="blue" />
                <KPICard title="Total Procedures" value={metrics.totalProcs} icon="⚙️" color="purple" />
                <KPICard title="Awaiting Pre-Auth" value={metrics.totalAwaitingPreAuth} icon="📡" color="orange" />
            </div>

            <div className="bg-white rounded-2xl shadow-xl border flex flex-col flex-grow min-h-0 overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Find unscheduled cases..." 
                            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-medium"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="overflow-auto flex-grow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-tighter">Priority</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-tighter">Patient Account</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-tighter">Plan Overview</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-tighter">Value</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-tighter">Aging</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {worklist.map(p => (
                                <tr key={p.id} className="hover:bg-indigo-50 transition-colors group">
                                    <td className="px-6 py-4"><PriorityBadge value={p.totalValue} /></td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-slate-800 text-sm">{p.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">Chart: {p.chartNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-slate-600 truncate max-w-md font-medium">{p.procedures}</div>
                                        <div className="text-[10px] text-indigo-500 font-bold">{p.procedureCount} Procedures Total</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-black text-slate-900">${p.totalValue.toLocaleString()}</div>
                                        <div className="text-[10px] text-green-600 font-bold">Est Ins: ${p.insEst.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`text-xs font-bold ${p.aging > 30 ? 'text-red-500' : 'text-slate-500'}`}>{p.aging} Days</div>
                                        <div className="text-[9px] text-slate-400 uppercase font-black">Since Proposed</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => onSelectPatient(p.id)}
                                            className="text-[10px] bg-slate-800 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-900 font-black uppercase transition-all transform group-hover:scale-105 active:scale-95"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Main TreatmentPlanner component
const TreatmentPlanner: React.FC = () => {
    const { state, dispatch } = useSimulationContext();
    const { patients, selectedPatientId } = state;
    const patient = patients.find(p => p.id === selectedPatientId);
    
    const [localView, setLocalView] = useState<'summary' | 'detail'>(selectedPatientId ? 'detail' : 'summary');
    const [showEstimate, setShowEstimate] = useState(false);

    const handleSelectPatient = (id: number) => {
        dispatch({ type: 'SELECT_PATIENT', payload: id });
        dispatch({ type: 'LOG_ACTION', payload: { type: 'view_planner_details', details: { patientId: id } } });
        setLocalView('detail');
    };

    const handleGenerateEstimate = () => {
        setShowEstimate(true);
        dispatch({ type: 'LOG_ACTION', payload: { type: 'generate_estimate', details: { patientId: patient?.id } } });
    };

    const handleSwitchContext = () => {
        dispatch({ type: 'LOG_ACTION', payload: { type: 'planner_switch_context' } });
        setLocalView('summary');
        dispatch({ type: 'SELECT_PATIENT', payload: null });
    };

    const handleReviewItem = (p: ToothState) => {
        dispatch({ type: 'LOG_ACTION', payload: { type: 'review_planner_item', details: { tooth: p.toothNumber } } });
    };

    if (localView === 'summary' || !patient) {
        return <TreatmentPlannerSummary onSelectPatient={handleSelectPatient} />;
    }

    const plannedProcedures = patient.chart.filter(t => t.status === ToothStatus.TreatmentPlanned);

    return (
        <div className="bg-white h-full shadow-lg rounded-md overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={handleSwitchContext} className="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Treatment Plan Manager</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{patient.lastName}, {patient.firstName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleGenerateEstimate} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg">Generate Estimate</button>
                </div>
            </div>
            
            <div className="flex-grow p-8 bg-gray-50 overflow-y-auto">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border overflow-hidden">
                    <div className="bg-slate-800 px-6 py-3 text-white text-[10px] font-black uppercase tracking-[0.2em]">Pending Clinical Items</div>
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b">
                            <tr className="text-[10px] font-black text-slate-400 uppercase">
                                <th className="px-6 py-4 text-left">Tooth</th>
                                <th className="px-6 py-4 text-left">Proposed Service</th>
                                <th className="px-6 py-4 text-right">Estimated Fee</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {plannedProcedures.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50 group cursor-pointer" onClick={() => handleReviewItem(p)}>
                                    <td className="px-6 py-4 font-black text-blue-600">#{p.toothNumber}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{p.procedure}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-900">${(p.fee || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                            {plannedProcedures.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-20 text-center text-gray-400 italic">No treatment planned for this patient.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t-2">
                            <tr>
                                <td colSpan={2} className="px-6 py-4 text-right font-black text-slate-400 uppercase text-[10px]">Total Plan Value</td>
                                <td className="px-6 py-4 text-right font-black text-slate-900 text-lg">${plannedProcedures.reduce((s, p) => s + (p.fee || 0), 0).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {showEstimate && (
                <EstimateDocumentModal 
                    patient={patient} 
                    procedures={plannedProcedures} 
                    onClose={() => setShowEstimate(false)} 
                />
            )}
        </div>
    );
};

export default TreatmentPlanner;
