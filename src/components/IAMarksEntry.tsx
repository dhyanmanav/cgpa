import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function IAMarksEntry() {
  const { subjects, addSubject, updateSubject, deleteSubject, darkMode } = useApp();
  const [subjectName, setSubjectName] = useState('');
  const [iaMarks, setIAMarks] = useState('');
  const [credits, setCredits] = useState('3');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIA, setEditIA] = useState('');
  const [editCredits, setEditCredits] = useState('3');

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ia = parseFloat(iaMarks);
    if (!subjectName.trim() || isNaN(ia) || ia < 0 || ia > 50) {
      alert('Please enter valid subject name and IA marks (0-50)');
      return;
    }

    addSubject({
      name: subjectName.trim(),
      iaMarks: ia,
      credits: parseInt(credits),
    });

    setSubjectName('');
    setIAMarks('');
    setCredits('3');
  };

  const startEdit = (subject: typeof subjects[0]) => {
    setEditingId(subject.id);
    setEditName(subject.name);
    setEditIA(subject.iaMarks.toString());
    setEditCredits(subject.credits.toString());
  };

  const saveEdit = (id: string) => {
    const ia = parseFloat(editIA);
    if (!editName.trim() || isNaN(ia) || ia < 0 || ia > 50) {
      alert('Please enter valid values');
      return;
    }

    updateSubject(id, {
      name: editName.trim(),
      iaMarks: ia,
      credits: parseInt(editCredits),
    });

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          IA Marks Entry
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Enter your Internal Assessment marks for each subject. Data is saved locally.
        </p>
      </div>

      {/* Add Subject Form */}
      <form onSubmit={handleAddSubject} className={`p-6 rounded-2xl mb-8 ${
        darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      } shadow-lg`}>
        <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add New Subject
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., Data Structures"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              IA Marks (out of 50)
            </label>
            <input
              type="number"
              value={iaMarks}
              onChange={(e) => setIAMarks(e.target.value)}
              placeholder="0-50"
              min="0"
              max="50"
              step="0.5"
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Credits
            </label>
            <select
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Subject
        </button>
      </form>

      {/* Local Storage Indicator */}
      <div className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-lg w-fit ${
        darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700'
      }`}>
        <Database className="w-4 h-4" />
        <span className="text-sm">Saved locally in your browser</span>
      </div>

      {/* Subjects Table */}
      {subjects.length > 0 ? (
        <div className={`rounded-2xl overflow-hidden ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subject Name
                  </th>
                  <th className={`px-6 py-3 text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    IA Marks
                  </th>
                  <th className={`px-6 py-3 text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Credits
                  </th>
                  <th className={`px-6 py-3 text-right text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {subjects.map((subject) => (
                  <tr key={subject.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                    {editingId === subject.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className={`w-full px-3 py-1 rounded border ${
                              darkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editIA}
                            onChange={(e) => setEditIA(e.target.value)}
                            min="0"
                            max="50"
                            step="0.5"
                            className={`w-24 px-3 py-1 rounded border ${
                              darkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editCredits}
                            onChange={(e) => setEditCredits(e.target.value)}
                            className={`w-20 px-3 py-1 rounded border ${
                              darkMode
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveEdit(subject.id)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? 'text-green-400 hover:bg-gray-600'
                                  : 'text-green-600 hover:bg-gray-100'
                              } transition-colors`}
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? 'text-gray-400 hover:bg-gray-600'
                                  : 'text-gray-600 hover:bg-gray-100'
                              } transition-colors`}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subject.name}
                        </td>
                        <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subject.iaMarks}/50
                        </td>
                        <td className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {subject.credits}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(subject)}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? 'text-blue-400 hover:bg-gray-700'
                                  : 'text-blue-600 hover:bg-gray-100'
                              } transition-colors`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this subject?')) {
                                  deleteSubject(subject.id);
                                }
                              }}
                              className={`p-2 rounded-lg ${
                                darkMode
                                  ? 'text-red-400 hover:bg-gray-700'
                                  : 'text-red-600 hover:bg-gray-100'
                              } transition-colors`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`p-12 rounded-2xl text-center ${
          darkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <Plus className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            No subjects added yet. Add your first subject to get started.
          </p>
        </div>
      )}
    </div>
  );
}