import React, { useState } from 'react';
import { Target, Lock, Unlock, AlertTriangle, CheckCircle, TrendingUp, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculateRequiredSEEForSGPA, 
  getDifficultyLevel,
  calculateSGPA,
  calculateFinalMarks,
  calculateGradePoint,
  calculatePredictedSGPA
} from '../utils/gradeCalculations';

export function ThresholdPlanner() {
  const { subjects, updateSubject, darkMode, setCurrentPage } = useApp();
  const [targetSGPA, setTargetSGPA] = useState(8.0);
  const [lockedSubjects, setLockedSubjects] = useState<Set<string>>(new Set());

  const toggleLock = (subjectId: string) => {
    setLockedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const requiredSEEScores = calculateRequiredSEEForSGPA(
    subjects,
    targetSGPA,
    Array.from(lockedSubjects)
  );

  const currentSGPA = calculateSGPA(subjects);
  
  // Calculate achievability
  const flexibleSubjects = subjects.filter(s => !lockedSubjects.has(s.id));
  const allFlexiblePossible = flexibleSubjects.every(s => {
    const required = requiredSEEScores.get(s.id);
    return required !== null && required !== undefined && required <= 100;
  });

  const getRiskStatus = () => {
    if (!allFlexiblePossible) return { label: 'High Risk', color: 'red' };
    
    const avgRequired = flexibleSubjects.reduce((sum, s) => {
      const req = requiredSEEScores.get(s.id) || 0;
      return sum + req;
    }, 0) / (flexibleSubjects.length || 1);

    if (avgRequired <= 40) return { label: 'Low Risk', color: 'green' };
    if (avgRequired <= 70) return { label: 'Moderate Risk', color: 'yellow' };
    return { label: 'High Risk', color: 'orange' };
  };

  const riskStatus = getRiskStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          CGPA Threshold Planner
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Set your target SGPA and find out what SEE scores you need to achieve it.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className={`p-12 rounded-2xl text-center ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <AlertTriangle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No subjects found. Please add IA marks first.
          </p>
        </div>
      ) : (
        <>
          {/* Target SGPA Input */}
          <div className={`p-6 rounded-2xl mb-8 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <label className={`block mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Desired SGPA Threshold
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={targetSGPA}
                onChange={(e) => setTargetSGPA(parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className={`w-24 px-4 py-2 rounded-lg text-center ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}>
                {targetSGPA.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-xl ${
              darkMode
                ? 'bg-gradient-to-br from-blue-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Current SGPA
              </div>
              <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                {currentSGPA > 0 ? currentSGPA.toFixed(2) : '--'}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              darkMode
                ? 'bg-gradient-to-br from-purple-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-purple-50 to-white border border-purple-200'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                Target SGPA
              </div>
              <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                {targetSGPA.toFixed(2)}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              darkMode
                ? 'bg-gradient-to-br from-green-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-green-50 to-white border border-green-200'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                Locked Subjects
              </div>
              <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                {lockedSubjects.size}/{subjects.length}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${
              riskStatus.color === 'green'
                ? darkMode
                  ? 'bg-gradient-to-br from-green-900 to-gray-800 border border-gray-700'
                  : 'bg-gradient-to-br from-green-50 to-white border border-green-200'
                : riskStatus.color === 'yellow'
                ? darkMode
                  ? 'bg-gradient-to-br from-yellow-900 to-gray-800 border border-gray-700'
                  : 'bg-gradient-to-br from-yellow-50 to-white border border-yellow-200'
                : darkMode
                  ? 'bg-gradient-to-br from-red-900 to-gray-800 border border-gray-700'
                  : 'bg-gradient-to-br from-red-50 to-white border border-red-200'
            }`}>
              <div className={`text-sm mb-1 ${
                riskStatus.color === 'green'
                  ? darkMode ? 'text-green-300' : 'text-green-600'
                  : riskStatus.color === 'yellow'
                  ? darkMode ? 'text-yellow-300' : 'text-yellow-600'
                  : darkMode ? 'text-red-300' : 'text-red-600'
              }`}>
                Risk Status
              </div>
              <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                {riskStatus.label}
              </div>
            </div>
          </div>

          {/* Subjects Table */}
          <div className={`rounded-2xl overflow-hidden ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      IA Marks
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current SEE
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Required SEE
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Difficulty
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Lock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {subjects.map((subject) => {
                    const isLocked = lockedSubjects.has(subject.id);
                    const requiredSEE = requiredSEEScores.get(subject.id);
                    const difficulty = requiredSEE !== undefined
                      ? getDifficultyLevel(requiredSEE, subject.iaMarks)
                      : { level: 'easy' as const, color: 'text-gray-500', label: '--' };

                    return (
                      <tr key={subject.id} className={`${
                        darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                      } ${isLocked ? (darkMode ? 'bg-gray-700/30' : 'bg-gray-50') : ''}`}>
                        <td className={`px-4 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subject.name}
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {subject.iaMarks}/50
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {subject.seeScore !== undefined ? `${subject.seeScore}/100` : '--'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {isLocked ? (
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              Locked
                            </span>
                          ) : requiredSEE !== null && requiredSEE !== undefined ? (
                            <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {requiredSEE.toFixed(0)}/100
                            </span>
                          ) : (
                            <span className="text-red-500">Impossible</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {!isLocked && (
                            <span className={`px-3 py-1 rounded-lg text-sm ${
                              difficulty.level === 'easy'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : difficulty.level === 'moderate'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : difficulty.level === 'hard'
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {difficulty.label}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {isLocked ? (
                            <Lock className={`w-5 h-5 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          ) : requiredSEE !== null && requiredSEE !== undefined && requiredSEE <= 100 ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 mx-auto text-red-500" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => toggleLock(subject.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isLocked
                                ? darkMode
                                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                                : darkMode
                                  ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warnings & Tips */}
          {!allFlexiblePossible && (
            <div className={`mt-8 p-6 rounded-2xl ${
              darkMode
                ? 'bg-red-900/20 border border-red-800'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`mb-2 ${darkMode ? 'text-red-300' : 'text-red-900'}`}>
                    Threshold Not Achievable
                  </h3>
                  <p className={darkMode ? 'text-red-200' : 'text-red-800'}>
                    The target SGPA is not possible with current IA marks unless you improve your IA scores 
                    or unlock more subjects to redistribute the required performance.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className={`mt-8 p-6 rounded-2xl ${
            darkMode
              ? 'bg-blue-900/20 border border-blue-800'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className={`mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  How It Works
                </h3>
                <ul className={`space-y-1 text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  <li>🔒 <strong>Lock subjects</strong> where you've already estimated your SEE score</li>
                  <li>🔓 <strong>Flexible subjects</strong> will show the required SEE score to reach your target</li>
                  <li>🎯 Green = Easy to achieve, Yellow = Moderate, Orange = Hard, Red = Impossible</li>
                  <li>⚡ Adjust your target SGPA to see different scenarios</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}