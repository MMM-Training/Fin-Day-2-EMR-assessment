
import React from 'react';

interface IntroductionScreenProps {
  onStartSimulation: () => void;
  onGoToAssessment: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onStartSimulation, onGoToAssessment }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl p-10 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase">EMR Training Center</h1>
            <p className="mt-3 text-lg text-gray-500 font-medium">Day 2 Proficiency Certification</p>
        </div>

        <div className="p-8 border-2 border-indigo-500 bg-indigo-50/30 rounded-2xl space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Graded Assessment</h2>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    This is the formal proficiency check for the Day 2 Curriculum. You must complete the verified navigation tasks spanning Insurance Verification, Treatment Planning, Medical Records, and the Patient/Insurance Portals.
                </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                <ul className="text-xs space-y-2 text-gray-500 font-bold">
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span> 35 core workflow tasks
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span> Real-time action verification
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span> Limited to 2 attempts
                    </li>
                </ul>
            </div>

            <button 
                onClick={onGoToAssessment} 
                className="w-full py-4 bg-indigo-600 text-white font-black uppercase text-sm tracking-widest rounded-xl hover:bg-indigo-700 shadow-lg transition-all active:scale-95"
            >
                Enter Graded Assessment
            </button>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Module: DVAE-DAY2-GRADED
        </p>
      </div>
    </div>
  );
};

export default IntroductionScreen;
