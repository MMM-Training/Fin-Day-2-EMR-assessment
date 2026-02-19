
import React, { useState } from 'react';
import { SimulationProvider, useSimulationContext } from './context/SimulationContext';
import MainLayout from './components/layout/MainLayout';
import LoginScreen from './screens/LoginScreen';
import IntroductionScreen from './screens/IntroductionScreen';
import AssessmentIntroScreen from './screens/AssessmentIntroScreen';
import AssessmentLockedScreen from './screens/AssessmentLockedScreen';
import SimulationSummary from './components/dashboard/SimulationSummary';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'assessment_intro' | 'simulation' | 'summary' | 'locked'>('intro');
  const { state, dispatch } = useSimulationContext();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleStartSandbox = () => {
    dispatch({ type: 'RESTART_ALL' });
    setCurrentScreen('simulation');
  };

  const handleGoToAssessment = () => {
    if (state.assessmentAttempts >= 2) {
      setCurrentScreen('locked');
    } else {
      setCurrentScreen('assessment_intro');
    }
  };

  const handleStartAssessment = () => {
    dispatch({ type: 'START_ASSESSMENT' });
    setCurrentScreen('simulation');
  };

  const handleEndSimulation = () => {
    setCurrentScreen('summary');
  };

  const handleRestart = () => {
    setCurrentScreen('intro');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  switch (currentScreen) {
    case 'intro':
      return <IntroductionScreen onStartSimulation={handleStartSandbox} onGoToAssessment={handleGoToAssessment} />;
    case 'assessment_intro':
      return <AssessmentIntroScreen onStart={handleStartAssessment} onBack={() => setCurrentScreen('intro')} attempts={state.assessmentAttempts} />;
    case 'locked':
      return <AssessmentLockedScreen attempts={state.assessmentAttempts} onBack={() => setCurrentScreen('intro')} />;
    case 'summary':
      return <SimulationSummary onRestart={handleRestart} />;
    case 'simulation':
      return <MainLayout onEndSimulation={handleEndSimulation} />;
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
