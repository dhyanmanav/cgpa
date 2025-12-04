import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subject, Page } from '../types';

interface AppContextType {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem('cgpa-subjects');
    const savedDarkMode = localStorage.getItem('cgpa-darkMode');
    
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (e) {
        console.error('Failed to load subjects from localStorage');
      }
    }
    
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cgpa-subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('cgpa-darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = {
      ...subject,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const exportData = (): string => {
    return JSON.stringify({ subjects, version: '1.0' }, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const resetData = () => {
    setSubjects([]);
    localStorage.removeItem('cgpa-subjects');
  };

  return (
    <AppContext.Provider value={{
      subjects,
      addSubject,
      updateSubject,
      deleteSubject,
      currentPage,
      setCurrentPage,
      darkMode,
      toggleDarkMode,
      exportData,
      importData,
      resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
