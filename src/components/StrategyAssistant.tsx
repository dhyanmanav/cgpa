import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, Star, Target, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  calculateSubjectImpact,
  calculateFinalMarks,
  calculateGradePoint,
  calculateRequiredSEE,
  calculateSGPA
} from '../utils/gradeCalculations';

export function StrategyAssistant() {
  const { subjects, darkMode } = useApp();

  const currentSGPA = calculateSGPA(subjects);

  // Generate recommendations
  const recommendations: {
    type: 'success' | 'warning' | 'info';
    icon: React.ReactNode;
    title: string;
    description: string;
  }[] = [];

  // Analyze each subject
  subjects.forEach(subject => {
    const impact = calculateSubjectImpact(subject, subjects);
    
    if (impact > 20) {
      recommendations.push({
        type: 'info',
        icon: <Star className="w-5 h-5" />,
        title: `High Impact: ${subject.name}`,
        description: `This subject carries ${subject.credits} credits (${impact.toFixed(0)}% impact on SGPA). Performance here significantly affects your overall grade.`,
      });
    }

    if (subject.seeScore !== undefined) {
      const finalMarks = calculateFinalMarks(subject.iaMarks, subject.seeScore);
      const gradePoint = calculateGradePoint(finalMarks);
      
      if (subject.iaMarks >= 40 && subject.seeScore < 50) {
        const requiredForNext = calculateRequiredSEE(subject.iaMarks, gradePoint + 1);
        if (requiredForNext !== null && requiredForNext <= 80) {
          recommendations.push({
            type: 'success',
            icon: <TrendingUp className="w-5 h-5" />,
            title: `Easy Upgrade: ${subject.name}`,
            description: `Strong IA marks (${subject.iaMarks}/50)! You need only ${requiredForNext.toFixed(0)}/100 in SEE to improve to the next grade level.`,
          });
        }
      }

      if (subject.iaMarks < 30 && subject.seeScore > 70) {
        recommendations.push({
          type: 'warning',
          icon: <AlertCircle className="w-5 h-5" />,
          title: `Compensating: ${subject.name}`,
          description: `Low IA marks (${subject.iaMarks}/50) require high SEE performance. Current estimate: ${subject.seeScore}/100.`,
        });
      }
    }
  });

  // Add general recommendations
  const completedSubjects = subjects.filter(s => s.seeScore !== undefined);
  if (completedSubjects.length < subjects.length) {
    recommendations.push({
      type: 'info',
      icon: <Target className="w-5 h-5" />,
      title: 'Complete Your Estimates',
      description: `You have ${subjects.length - completedSubjects.length} subject(s) without SEE estimates. Complete them for accurate SGPA prediction.`,
    });
  }

  if (currentSGPA >= 9) {
    recommendations.push({
      type: 'success',
      icon: <Award className="w-5 h-5" />,
      title: 'Excellent Performance!',
      description: `Your current SGPA of ${currentSGPA.toFixed(2)} is outstanding. Keep up the great work!`,
    });
  } else if (currentSGPA >= 7) {
    recommendations.push({
      type: 'info',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Good Standing',
      description: `Your SGPA of ${currentSGPA.toFixed(2)} is solid. Focus on high-credit subjects to boost it further.`,
    });
  } else if (currentSGPA > 0) {
    recommendations.push({
      type: 'warning',
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'Room for Improvement',
      description: `Current SGPA: ${currentSGPA.toFixed(2)}. Prioritize subjects with high credits and review weak areas.`,
    });
  }

  // Sort by type priority
  const sortedRecommendations = recommendations.sort((a, b) => {
    const order = { success: 0, info: 1, warning: 2 };
    return order[a.type] - order[b.type];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Subject Strategy Assistant
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Personalized recommendations to optimize your study efforts and maximize your SGPA.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className={`p-12 rounded-2xl text-center ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <Lightbulb className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            No subjects found. Add IA marks and SEE estimates to get personalized recommendations.
          </p>
        </div>
      ) : (
        <>
          {/* Recommendations */}
          <div className="space-y-4 mb-8">
            {sortedRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl ${
                  rec.type === 'success'
                    ? darkMode
                      ? 'bg-green-900/20 border border-green-800'
                      : 'bg-green-50 border border-green-200'
                    : rec.type === 'warning'
                    ? darkMode
                      ? 'bg-yellow-900/20 border border-yellow-800'
                      : 'bg-yellow-50 border border-yellow-200'
                    : darkMode
                      ? 'bg-blue-900/20 border border-blue-800'
                      : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 ${
                    rec.type === 'success'
                      ? 'text-green-500'
                      : rec.type === 'warning'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`}>
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-1 ${
                      rec.type === 'success'
                        ? darkMode ? 'text-green-300' : 'text-green-900'
                        : rec.type === 'warning'
                        ? darkMode ? 'text-yellow-300' : 'text-yellow-900'
                        : darkMode ? 'text-blue-300' : 'text-blue-900'
                    }`}>
                      {rec.title}
                    </h3>
                    <p className={`text-sm ${
                      rec.type === 'success'
                        ? darkMode ? 'text-green-200' : 'text-green-800'
                        : rec.type === 'warning'
                        ? darkMode ? 'text-yellow-200' : 'text-yellow-800'
                        : darkMode ? 'text-blue-200' : 'text-blue-800'
                    }`}>
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subject Impact Analysis */}
          <div className={`p-6 rounded-2xl mb-8 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          } shadow-lg`}>
            <h2 className={`mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Subject Impact on CGPA
            </h2>
            <div className="space-y-4">
              {subjects.map(subject => {
                const impact = calculateSubjectImpact(subject, subjects);
                return (
                  <div key={subject.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                        {subject.name}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {impact.toFixed(1)}% ({subject.credits} credits)
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full overflow-hidden ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className={`h-full rounded-full transition-all ${
                          impact > 20
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                            : impact > 15
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: `${impact}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl ${
              darkMode
                ? 'bg-gradient-to-br from-blue-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200'
            } shadow-lg`}>
              <div className={`text-sm mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Highest IA Subject
              </div>
              {subjects.length > 0 && (
                <>
                  <div className={`mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {[...subjects].sort((a, b) => b.iaMarks - a.iaMarks)[0].name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {[...subjects].sort((a, b) => b.iaMarks - a.iaMarks)[0].iaMarks}/50 IA marks
                  </div>
                </>
              )}
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode
                ? 'bg-gradient-to-br from-purple-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-purple-50 to-white border border-purple-200'
            } shadow-lg`}>
              <div className={`text-sm mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                Highest Credit Subject
              </div>
              {subjects.length > 0 && (
                <>
                  <div className={`mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {[...subjects].sort((a, b) => b.credits - a.credits)[0].name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {[...subjects].sort((a, b) => b.credits - a.credits)[0].credits} credits
                  </div>
                </>
              )}
            </div>

            <div className={`p-6 rounded-2xl ${
              darkMode
                ? 'bg-gradient-to-br from-green-900 to-gray-800 border border-gray-700'
                : 'bg-gradient-to-br from-green-50 to-white border border-green-200'
            } shadow-lg`}>
              <div className={`text-sm mb-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                Average IA Marks
              </div>
              {subjects.length > 0 && (
                <>
                  <div className={`mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {(subjects.reduce((sum, s) => sum + s.iaMarks, 0) / subjects.length).toFixed(1)}/50
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Across {subjects.length} subjects
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Study Tips */}
          <div className={`mt-8 p-6 rounded-2xl ${
            darkMode
              ? 'bg-gradient-to-br from-orange-900/20 to-gray-800 border border-orange-800'
              : 'bg-gradient-to-br from-orange-50 to-white border border-orange-200'
          }`}>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className={`mb-3 ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                  General Study Tips
                </h3>
                <ul className={`space-y-2 text-sm ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                  <li>📚 Prioritize subjects with high credits - they have more impact on your SGPA</li>
                  <li>💪 Focus extra effort on subjects where small improvements yield better grades</li>
                  <li>⚖️ Balance your study time based on credit weightage, not just difficulty</li>
                  <li>🎯 Set realistic SEE targets - use the Threshold Planner to see what's achievable</li>
                  <li>📊 Review your progress regularly and adjust your strategy accordingly</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}