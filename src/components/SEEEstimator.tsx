import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculateSEEContribution, 
  calculateFinalMarks, 
  calculateGradePoint, 
  getGradeLetter,
  calculateSGPA 
} from '../utils/gradeCalculations';

export function SEEEstimator() {
  const { subjects, updateSubject, darkMode } = useApp();

  const handleSEEChange = (id: string, value: string) => {
    const seeScore = parseFloat(value);
    if (!isNaN(seeScore) && seeScore >= 0 && seeScore <= 100) {
      updateSubject(id, { seeScore });
    } else if (value === '') {
      updateSubject(id, { seeScore: undefined });
    }
  };

  const overallSGPA = calculateSGPA(subjects);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          SEE Score Estimator
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Estimate your Semester End Exam scores and see predicted final grades and SGPA.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className={`p-12 rounded-2xl text-center ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No subjects found. Please add IA marks first.
          </p>
          <button
            onClick={() => window.location.hash = '#ia-marks'}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Go to IA Marks Entry
          </button>
        </div>
      ) : (
        <>
          {/* Overall SGPA Card */}
          {overallSGPA > 0 && (
            <div className={`p-6 rounded-2xl mb-8 ${
              darkMode
                ? 'bg-gradient-to-br from-blue-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200'
            } shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Predicted SGPA
                  </p>
                  <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {overallSGPA.toFixed(2)}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Based on current SEE estimates
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          )}

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
                      SEE Score (0-100)
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      SEE Contribution
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Final Marks
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Grade
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Grade Point
                    </th>
                    <th className={`px-4 py-3 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Credits
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {subjects.map((subject) => {
                    const seeContribution = subject.seeScore !== undefined 
                      ? calculateSEEContribution(subject.seeScore)
                      : null;
                    const finalMarks = subject.seeScore !== undefined
                      ? calculateFinalMarks(subject.iaMarks, subject.seeScore)
                      : null;
                    const gradePoint = finalMarks !== null
                      ? calculateGradePoint(finalMarks)
                      : null;
                    const gradeLetter = gradePoint !== null
                      ? getGradeLetter(gradePoint)
                      : null;

                    return (
                      <tr key={subject.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subject.name}
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {subject.iaMarks}/50
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="number"
                            value={subject.seeScore !== undefined ? subject.seeScore : ''}
                            onChange={(e) => handleSEEChange(subject.id, e.target.value)}
                            placeholder="0-100"
                            min="0"
                            max="100"
                            step="1"
                            className={`w-24 px-3 py-2 rounded-lg border text-center ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {seeContribution !== null ? `${seeContribution.toFixed(1)}/50` : '--'}
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {finalMarks !== null ? `${finalMarks.toFixed(1)}/100` : '--'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {gradeLetter !== null && (
                            <span className={`px-3 py-1 rounded-lg text-sm ${
                              gradePoint! >= 9 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : gradePoint! >= 7
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : gradePoint! >= 5
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {gradeLetter}
                            </span>
                          )}
                          {gradeLetter === null && <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>--</span>}
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {gradePoint !== null ? gradePoint : '--'}
                        </td>
                        <td className={`px-4 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {subject.credits}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grade Scale Reference */}
          <div className={`mt-8 p-6 rounded-2xl ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Grade Scale Reference
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { grade: 'S', gp: '10', marks: '90-100', color: 'green' },
                { grade: 'A+', gp: '9', marks: '80-89', color: 'green' },
                { grade: 'A', gp: '8', marks: '70-79', color: 'blue' },
                { grade: 'B+', gp: '7', marks: '60-69', color: 'blue' },
                { grade: 'B', gp: '6', marks: '50-59', color: 'yellow' },
                { grade: 'C', gp: '5', marks: '40-49', color: 'yellow' },
                { grade: 'F', gp: '0', marks: '<40', color: 'red' },
              ].map((item) => (
                <div key={item.grade} className={`p-3 rounded-lg text-center ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <div className={`mb-1 ${
                    item.color === 'green' ? 'text-green-500' :
                    item.color === 'blue' ? 'text-blue-500' :
                    item.color === 'yellow' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {item.grade}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    GP: {item.gp}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.marks}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}