import React, { useRef, useState } from 'react';
import { Moon, Sun, Download, Upload, Trash2, FileJson, AlertCircle, FileDown, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToPDF } from '../utils/pdfExport';
import { calculateRequiredSEEForSGPA } from '../utils/gradeCalculations';

export function Settings() {
  const { darkMode, toggleDarkMode, exportData, importData, resetData, subjects } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPDFOptions, setShowPDFOptions] = useState(false);
  const [pdfTargetSGPA, setPdfTargetSGPA] = useState(8.0);

  const handleExport = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cgpa-planner-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = (withPredictions: boolean = false) => {
    if (subjects.length === 0) {
      alert('Please add some subjects before exporting PDF');
      return;
    }
    
    if (withPredictions) {
      // Export with predictions
      const lockedSubjectIds = subjects
        .filter(s => s.seeScore !== undefined && s.seeScore !== null)
        .map(s => s.id);
      
      exportToPDF(subjects, {
        includePredictions: true,
        targetSGPA: pdfTargetSGPA,
        lockedSubjectIds: lockedSubjectIds,
      });
    } else {
      // Export simple report
      exportToPDF(subjects, { includePredictions: false });
    }
    
    setShowPDFOptions(false);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importData(content);
      if (success) {
        alert('Data imported successfully!');
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      resetData();
      alert('All data has been reset.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Manage your preferences and data.
        </p>
      </div>

      {/* Appearance */}
      <div className={`p-6 rounded-2xl mb-6 ${
        darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      } shadow-lg`}>
        <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="w-5 h-5 text-blue-400" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
            <div>
              <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                Dark Mode
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              </div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              darkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className={`p-6 rounded-2xl mb-6 ${
        darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      } shadow-lg`}>
        <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Management
        </h2>
        
        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-green-500" />
              <div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Export Data
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Download your data as JSON file
                </div>
              </div>
            </div>
            <button
              onClick={handleExport}
              disabled={subjects.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                subjects.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Export
            </button>
          </div>

          {/* Export PDF */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileDown className="w-5 h-5 text-blue-500" />
              <div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Export PDF
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Download your data as PDF file
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPDFOptions(true)}
              disabled={subjects.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                subjects.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Export PDF
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-blue-500" />
              <div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Import Data
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Load data from JSON file
                </div>
              </div>
            </div>
            <label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <span className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                Import
              </span>
            </label>
          </div>

          {/* Reset */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Reset All Data
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Delete all subjects and settings
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              disabled={subjects.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                subjects.length > 0
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className={`p-6 rounded-2xl ${
        darkMode
          ? 'bg-blue-900/20 border border-blue-800'
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-start gap-3">
          <FileJson className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className={`mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              Local Storage
            </h3>
            <p className={`text-sm mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              All your data is stored locally in your browser. No data is sent to any server. 
              You currently have <strong>{subjects.length} subject(s)</strong> stored.
            </p>
            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              💡 Export your data regularly to prevent loss if you clear browser data.
            </p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className={`mt-6 p-6 rounded-2xl ${
        darkMode
          ? 'bg-yellow-900/20 border border-yellow-800'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className={`mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
              Important Notice
            </h3>
            <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
              Clearing your browser data or using incognito/private mode will erase all stored information. 
              Make sure to export your data before clearing browser storage.
            </p>
          </div>
        </div>
      </div>

      {/* PDF Options Modal */}
      {showPDFOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          } shadow-2xl`}>
            <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              PDF Export Options
            </h2>
            
            <div className="mb-6">
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Target SGPA for Predictions
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={pdfTargetSGPA}
                onChange={(e) => setPdfTargetSGPA(parseFloat(e.target.value))}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleExportPDF(false)}
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                📄 Simple Report (Current Scores)
              </button>
              <button
                onClick={() => handleExportPDF(true)}
                className="w-full px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                🎯 With Predicted SEE Scores
              </button>
              <button
                onClick={() => setShowPDFOptions(false)}
                className={`w-full px-4 py-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}