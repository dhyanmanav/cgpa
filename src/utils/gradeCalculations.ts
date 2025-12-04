import { Subject } from '../types';

// Calculate grade point based on total marks (0-10 scale)
export function calculateGradePoint(totalMarks: number): number {
  if (totalMarks >= 90) return 10;
  if (totalMarks >= 80) return 9;
  if (totalMarks >= 70) return 8;
  if (totalMarks >= 60) return 7;
  if (totalMarks >= 50) return 6;
  if (totalMarks >= 40) return 5;
  return 0;
}

// Get grade letter
export function getGradeLetter(gradePoint: number): string {
  if (gradePoint === 10) return 'S';
  if (gradePoint === 9) return 'A+';
  if (gradePoint === 8) return 'A';
  if (gradePoint === 7) return 'B+';
  if (gradePoint === 6) return 'B';
  if (gradePoint === 5) return 'C';
  return 'F';
}

// Calculate SEE contribution (out of 50)
export function calculateSEEContribution(seeScore: number): number {
  return (seeScore / 100) * 50;
}

// Calculate final marks
export function calculateFinalMarks(iaMarks: number, seeScore: number): number {
  return iaMarks + calculateSEEContribution(seeScore);
}

// Calculate SGPA for a list of subjects
export function calculateSGPA(subjects: Subject[]): number {
  const validSubjects = subjects.filter(s => s.seeScore !== undefined && s.seeScore !== null);
  
  if (validSubjects.length === 0) return 0;
  
  let totalCredits = 0;
  let totalGradePoints = 0;
  
  validSubjects.forEach(subject => {
    const finalMarks = calculateFinalMarks(subject.iaMarks, subject.seeScore!);
    const gradePoint = calculateGradePoint(finalMarks);
    totalCredits += subject.credits;
    totalGradePoints += gradePoint * subject.credits;
  });
  
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
}

// Calculate predicted SGPA using predicted SEE scores
export function calculatePredictedSGPA(
  subjects: Subject[],
  predictedSEEScores: Map<string, number | null>
): number {
  if (subjects.length === 0) return 0;
  
  let totalCredits = 0;
  let totalGradePoints = 0;
  
  subjects.forEach(subject => {
    const seeScore = predictedSEEScores.get(subject.id);
    if (seeScore !== null && seeScore !== undefined) {
      const finalMarks = calculateFinalMarks(subject.iaMarks, seeScore);
      const gradePoint = calculateGradePoint(finalMarks);
      totalCredits += subject.credits;
      totalGradePoints += gradePoint * subject.credits;
    }
  });
  
  return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
}

// Calculate required SEE score to achieve target grade point
export function calculateRequiredSEE(iaMarks: number, targetGradePoint: number): number | null {
  // Find minimum marks needed for target grade point
  let minMarksNeeded = 0;
  if (targetGradePoint >= 10) minMarksNeeded = 90;
  else if (targetGradePoint >= 9) minMarksNeeded = 80;
  else if (targetGradePoint >= 8) minMarksNeeded = 70;
  else if (targetGradePoint >= 7) minMarksNeeded = 60;
  else if (targetGradePoint >= 6) minMarksNeeded = 50;
  else if (targetGradePoint >= 5) minMarksNeeded = 40;
  else minMarksNeeded = 0;
  
  // Calculate required SEE contribution
  const requiredSEEContribution = minMarksNeeded - iaMarks;
  
  if (requiredSEEContribution < 0) return 0; // Already achieved with IA
  if (requiredSEEContribution > 50) return null; // Impossible
  
  // Convert SEE contribution to SEE score
  const requiredSEE = (requiredSEEContribution / 50) * 100;
  return Math.min(100, Math.max(0, requiredSEE));
}

// Calculate required SEE scores for target SGPA
export function calculateRequiredSEEForSGPA(
  subjects: Subject[],
  targetSGPA: number,
  lockedSubjectIds: string[]
): Map<string, number | null> {
  const result = new Map<string, number | null>();
  
  const lockedSubjects = subjects.filter(s => lockedSubjectIds.includes(s.id));
  const flexibleSubjects = subjects.filter(s => !lockedSubjectIds.includes(s.id));
  
  if (flexibleSubjects.length === 0) {
    // All locked, can't calculate
    subjects.forEach(s => result.set(s.id, s.seeScore || null));
    return result;
  }
  
  // Calculate contribution from locked subjects
  let lockedGradePoints = 0;
  let lockedCredits = 0;
  
  lockedSubjects.forEach(subject => {
    const seeScore = subject.seeScore || 0;
    const finalMarks = calculateFinalMarks(subject.iaMarks, seeScore);
    const gradePoint = calculateGradePoint(finalMarks);
    lockedGradePoints += gradePoint * subject.credits;
    lockedCredits += subject.credits;
    result.set(subject.id, seeScore);
  });
  
  // Calculate required grade points from flexible subjects
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const requiredTotalGradePoints = targetSGPA * totalCredits;
  const requiredFlexibleGradePoints = requiredTotalGradePoints - lockedGradePoints;
  const flexibleCredits = totalCredits - lockedCredits;
  
  const avgRequiredGradePoint = flexibleCredits > 0 
    ? requiredFlexibleGradePoints / flexibleCredits 
    : 0;
  
  // Distribute required grade points across flexible subjects
  flexibleSubjects.forEach(subject => {
    const requiredSEE = calculateRequiredSEE(subject.iaMarks, avgRequiredGradePoint);
    result.set(subject.id, requiredSEE);
  });
  
  return result;
}

// Get difficulty level for required SEE score
export function getDifficultyLevel(requiredSEE: number | null, iaMarks: number): {
  level: 'easy' | 'moderate' | 'hard' | 'impossible';
  color: string;
  label: string;
} {
  if (requiredSEE === null) {
    return { level: 'impossible', color: 'text-red-500', label: 'Impossible' };
  }
  
  if (requiredSEE <= 30) {
    return { level: 'easy', color: 'text-green-500', label: 'Easy' };
  }
  
  if (requiredSEE <= 60) {
    return { level: 'moderate', color: 'text-yellow-500', label: 'Moderate' };
  }
  
  return { level: 'hard', color: 'text-orange-500', label: 'Hard' };
}

// Calculate subject impact on CGPA
export function calculateSubjectImpact(subject: Subject, allSubjects: Subject[]): number {
  const totalCredits = allSubjects.reduce((sum, s) => sum + s.credits, 0);
  return totalCredits > 0 ? (subject.credits / totalCredits) * 100 : 0;
}