import React from 'react';
import { FileText, TrendingUp, Target, Lightbulb, BookOpen, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSGPA } from '../utils/gradeCalculations';

export function Dashboard() {
  const { setCurrentPage, subjects, darkMode } = useApp();


  const completedSubjects = subjects.filter(s => s.seeScore !== undefined && s.seeScore !== null);
  const currentSGPA = calculateSGPA(subjects);





  const navigationCards = [
    {
      title: 'Enter IA Marks',
      description: 'Add and manage your Internal Assessment marks for all subjects',
      icon: <FileText className="w-8 h-8" />,
      page: 'ia-marks' as const,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Enter SEE Predictions',
      description: 'Estimate your Semester End Exam scores and calculate final grades',
      icon: <TrendingUp className="w-8 h-8" />,
      page: 'see-estimator' as const,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'CGPA Threshold Planner',
      description: 'Set target SGPA and find out what scores you need to achieve it',
      icon: <Target className="w-8 h-8" />,
      page: 'threshold-planner' as const,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Subject Strategy Assistant',
      description: 'Get personalized recommendations to optimize your study efforts',
      icon: <Lightbulb className="w-8 h-8" />,
      page: 'strategy-assistant' as const,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Welcome Card */}
      <div className={`rounded-2xl p-8 mb-8 relative ${darkMode
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
        : 'bg-gradient-to-br from-blue-50 to-white border border-blue-100'
        } shadow-lg`}>


        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              CGPA Planner & Predictor
            </h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              A comprehensive tool to calculate needed SEE marks.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Subjects
                  </span>
                </div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {subjects.length}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Completed
                  </span>
                </div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {completedSubjects.length}/{subjects.length}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Award className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current SGPA
                  </span>
                </div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  {currentSGPA > 0 ? currentSGPA.toFixed(2) : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {navigationCards.map((card) => (
          <button
            key={card.page}
            onClick={() => setCurrentPage(card.page)}
            className={`p-6 rounded-2xl text-left transition-all hover:scale-105 ${darkMode
              ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
              : 'bg-white border border-gray-200 hover:border-gray-300'
              } shadow-lg hover:shadow-xl`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                <div className="text-white">{card.icon}</div>
              </div>
              <div className="flex-1">
                <h3 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {card.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Getting Started */}
      {subjects.length === 0 && (
        <div className={`mt-8 p-6 rounded-2xl ${darkMode
          ? 'bg-blue-900/20 border border-blue-800'
          : 'bg-blue-50 border border-blue-200'
          }`}>
          <h3 className={`mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            Getting Started
          </h3>
          <p className={`mb-4 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            Start by entering your IA marks for each subject. This data will be saved locally in your browser.
          </p>
          <button
            onClick={() => setCurrentPage('ia-marks')}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Enter IA Marks
          </button>
        </div>
      )}

      {/* Watermark - Made by Manav */}
      <div className={`mt-8 text-center pb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="text-sm">
          Made by: <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manav</span>
        </p>
      </div>
    </div>
  );
}