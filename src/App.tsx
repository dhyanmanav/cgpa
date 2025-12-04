import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { IAMarksEntry } from './components/IAMarksEntry';
import { SEEEstimator } from './components/SEEEstimator';
import { ThresholdPlanner } from './components/ThresholdPlanner';
import { StrategyAssistant } from './components/StrategyAssistant';
import { Settings } from './components/Settings';
import './styles/globals.css';

function AppContent() {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      <main className="animate-fade-in">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'ia-marks' && <IAMarksEntry />}
        {currentPage === 'see-estimator' && <SEEEstimator />}
        {currentPage === 'threshold-planner' && <ThresholdPlanner />}
        {currentPage === 'strategy-assistant' && <StrategyAssistant />}
        {currentPage === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}