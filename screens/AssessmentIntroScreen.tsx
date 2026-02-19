
import React from 'react';

interface Props {
  onStart: () => void;
  onBack: () => void;
  attempts: number;
}

const AssessmentIntroScreen: React.FC<Props> = ({ onStart, onBack, attempts }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
             <button onClick={onBack} className="text-sm text-gray-500 font-bold hover:text-gray-800">← Back</button>
             <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Attempts: {attempts} / 2</span>
        </div>
        
        <div className="p-10 text-center space-y-8">
            <div>
                <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase mb-4">Core Proficiency Assessment</h1>
                <p className="text-lg text-gray-500 font-medium">Final Graded Simulation for Day 2 Curriculum</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-600 text-left space-y-4">
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Assessment Overview</h2>
                <p className="text-sm text-blue-800 leading-relaxed">
                    This formal proficiency check evaluates your ability to handle advanced dental office workflows. You must verify 35 core tasks spanning:
                </p>
                <div className="grid grid-cols-1 gap-2">
                    <ul className="text-[11px] text-blue-700 space-y-1 font-bold ml-4 list-disc grid grid-cols-2">
                        <li>Module 6: Insurance Verification</li>
                        <li>Module 7: Treatment Planner</li>
                        <li>Module 8: Medical Records</li>
                        <li>Module 9: Patient Portal</li>
                        <li className="col-span-2">Module 10: Payer Connect Portal</li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-blue-500">ℹ️</span> Instructions
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Complete all tasks listed in the Sidebar Guide. Actions are tracked and verified automatically as you navigate the specialized Day 2 modules.</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-green-500">✅</span> Submission
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Submit your final score screenshot to Talent LMS for course credit.</p>
                </div>
            </div>

            <div className="pt-6">
                <button 
                    onClick={onStart}
                    className="w-full py-4 bg-[#004b8d] text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-blue-900 transition-all active:scale-95"
                >
                    Start Day 2 Assessment
                </button>
                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Passing Threshold: 80% (28/35 Tasks)</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentIntroScreen;
