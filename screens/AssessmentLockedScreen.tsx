
import React from 'react';

interface Props {
  attempts: number;
  onBack: () => void;
}

const AssessmentLockedScreen: React.FC<Props> = ({ attempts, onBack }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
             <button onClick={onBack} className="text-sm text-gray-500 font-bold hover:text-gray-800">← Exit</button>
             <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">ATTEMPTS: {attempts} / 2</span>
        </div>
        
        <div className="p-12 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-2">
                 <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Maximum Attempts Reached</h1>
            <p className="text-gray-500 font-bold leading-relaxed max-w-sm">
                You have used your 2 permitted attempts for this assessment. Please contact your instructor or supervisor for further assistance.
            </p>
            
            <button disabled className="mt-8 w-full py-4 bg-slate-400 text-white rounded-xl font-black uppercase text-sm tracking-widest cursor-not-allowed">
                Locked
            </button>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Module Code: DAY2-EMR-ASSESS</p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentLockedScreen;
