
import React from 'react';
import { useSimulationContext } from '../../context/SimulationContext';
import { SANDBOX_TASKS } from '../../constants';

interface SummaryProps {
    onRestart: () => void;
}

const SimulationSummary: React.FC<SummaryProps> = ({ onRestart }) => {
    const { state } = useSimulationContext();
    
    const taskResults = SANDBOX_TASKS.map((task, taskIdx) => {
        const completed = state.completedSandboxTasks[taskIdx] || [];
        const count = completed.filter(Boolean).length;
        return {
            title: task.title,
            count,
            total: task.steps.length,
            percentage: (count / task.steps.length) * 100
        };
    });

    const totalCompleted = taskResults.reduce((acc, r) => acc + r.count, 0);
    const totalPossible = taskResults.reduce((acc, r) => acc + r.total, 0);
    const totalPercentage = Math.round((totalCompleted / totalPossible) * 100);
    const passed = totalPercentage >= 80;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
            <div className="bg-white rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden max-w-4xl w-full border border-gray-100 animate-scale-in">
                {/* Header matching screenshot color */}
                <div className={`p-10 text-center ${passed ? 'bg-[#2563eb]' : 'bg-[#2563eb]'} text-white`}>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Day 2 Assessment Results</h1>
                    <p className="text-lg font-bold opacity-90 uppercase tracking-widest text-[13px]">
                        {passed ? 'Proficiency Confirmed' : 'Assessment incomplete. You did not meet the passing threshold (80%).'}
                    </p>
                </div>

                <div className="p-12 flex flex-col md:flex-row gap-16 items-center">
                    {/* Circle Score - Left Column */}
                    <div className="flex flex-col items-center shrink-0">
                        <div className="relative w-56 h-56 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                                <circle cx="112" cy="112" r="100" fill="none" stroke="#2563eb" strokeWidth="16" strokeDasharray="628" strokeDashoffset={628 - (628 * totalPercentage / 100)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-7xl font-black text-[#1e293b]">{totalPercentage}%</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Total Score</span>
                            </div>
                        </div>
                        <p className="mt-8 text-sm font-black text-slate-500 uppercase tracking-widest">{totalCompleted} / {totalPossible} Steps Verified</p>
                    </div>

                    {/* Module Breakdown - Right Column */}
                    <div className="flex-grow space-y-10 w-full">
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] border-b pb-4">Section Breakdown</h2>
                        <div className="space-y-8">
                            {taskResults.map((result, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{result.title.split(':')[0]}</span>
                                        <span className="text-xs font-black text-slate-900">{result.count}/{result.total}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#2563eb] rounded-full transition-all duration-1000 delay-500" style={{ width: `${result.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notice Box matching screenshot */}
                <div className="px-12 pb-6">
                    <div className="bg-[#fff9e6] border-2 border-dashed border-[#e6c200] p-6 rounded-2xl flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                             <span className="text-xl">📸</span>
                             <h3 className="text-sm font-black text-[#856404] uppercase tracking-widest">Assessment Submission Required</h3>
                        </div>
                        <p className="text-xs text-center font-bold text-[#856404] leading-relaxed max-w-xl">
                            Please take a screenshot of this screen (including your score and badges) and upload it to <strong className="font-black">Talent LMS</strong> to receive credit for Day 2.
                        </p>
                    </div>
                </div>

                {/* Footer and Button */}
                <div className="p-12 pt-6 border-t bg-gray-50/50 flex flex-col items-center gap-8">
                    <div className="w-full bg-blue-50 border-l-4 border-blue-600 p-4">
                        <p className="text-[10px] font-black text-blue-800 uppercase mb-1">Scoring Note:</p>
                        <p className="text-xs text-blue-700 font-medium">This score was generated automatically by verifying your actions within the system. Incomplete or incorrect tasks resulted in zero points for that step.</p>
                    </div>
                    <button onClick={onRestart} className="w-full max-w-sm py-4 bg-[#1e293b] text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95">
                        Restart Assessment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimulationSummary;
