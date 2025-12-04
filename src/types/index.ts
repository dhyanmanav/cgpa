export interface Subject {
  id: string;
  name: string;
  iaMarks: number;
  credits: number;
  seeScore?: number;
  isLocked?: boolean;
}

export interface ThresholdSettings {
  desiredSGPA: number;
  lockedSubjects: string[];
}

export type Page = 'dashboard' | 'ia-marks' | 'see-estimator' | 'threshold-planner' | 'strategy-assistant' | 'settings';
