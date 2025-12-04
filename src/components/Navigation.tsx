import React from 'react';
import { Home, FileText, TrendingUp, Target, Lightbulb, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';

export function Navigation() {
  const { currentPage, setCurrentPage, darkMode } = useApp();

  const navItems: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { page: 'ia-marks', icon: <FileText className="w-5 h-5" />, label: 'IA Marks' },
    { page: 'see-estimator', icon: <TrendingUp className="w-5 h-5" />, label: 'SEE' },
    { page: 'threshold-planner', icon: <Target className="w-5 h-5" />, label: 'Planner' },
    { page: 'strategy-assistant', icon: <Lightbulb className="w-5 h-5" />, label: 'Strategy' },
    { page: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <>
      {/* Top Header - Logo only */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b ${
        darkMode 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                CGPA Planner
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation - All screens */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 border-t ${
        darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
      } backdrop-blur-lg`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-6 gap-1 py-2">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                  currentPage === item.page
                    ? darkMode
                      ? 'text-blue-400 bg-blue-900/30'
                      : 'text-blue-600 bg-blue-50'
                    : darkMode
                      ? 'text-gray-500 hover:text-gray-300'
                      : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium truncate max-w-full">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
