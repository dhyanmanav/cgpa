import jsPDF from 'jspdf';
import { Subject } from '../types';
import { calculateFinalMarks, calculateGradePoint, getGradeLetter, calculateSGPA, calculatePredictedSGPA, calculateRequiredSEEForSGPA } from './gradeCalculations';

interface PDFExportOptions {
  includePredictions?: boolean;
  targetSGPA?: number;
  lockedSubjectIds?: string[];
}

export function exportToPDF(subjects: Subject[], options: PDFExportOptions = {}) {
  const doc = new jsPDF();
  
  const { includePredictions = true, targetSGPA = 8.0, lockedSubjectIds = [] } = options;
  
  // Calculate predicted SEE scores if requested
  const predictedSEEScores = includePredictions 
    ? calculateRequiredSEEForSGPA(subjects, targetSGPA, lockedSubjectIds)
    : new Map<string, number | null>();
  
  const predictedSGPA = includePredictions && subjects.length > 0
    ? calculatePredictedSGPA(subjects, predictedSEEScores)
    : 0;
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CGPA Planner Report', 105, 20, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated on: ${date}`, 105, 28, { align: 'center' });
  
  // SGPA Summary
  const currentSGPA = calculateSGPA(subjects);
  let yPos = 45;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SGPA Summary', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Current SGPA (from entered SEE scores): ${currentSGPA > 0 ? currentSGPA.toFixed(2) : 'N/A'}`, 20, yPos);
  yPos += 6;
  
  if (includePredictions && predictedSGPA > 0) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Target SGPA: ${targetSGPA.toFixed(2)}`, 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Predicted SGPA (with required SEE scores): ${predictedSGPA.toFixed(2)}`, 20, yPos);
    yPos += 2;
  }
  
  yPos += 8;
  
  // Table Header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Subject Details', 20, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  doc.text('Subject', 20, yPos);
  doc.text('IA', 80, yPos);
  doc.text('SEE', 100, yPos);
  if (includePredictions) {
    doc.text('Req. SEE', 120, yPos);
    doc.text('Grade', 145, yPos);
    doc.text('Credits', 170, yPos);
  } else {
    doc.text('Total', 120, yPos);
    doc.text('Grade', 145, yPos);
    doc.text('Credits', 170, yPos);
  }
  
  // Line under header
  doc.setLineWidth(0.5);
  doc.line(20, yPos + 2, 190, yPos + 2);
  
  yPos += 10;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  subjects.forEach((subject, index) => {
    // Check if we need a new page
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
      
      // Repeat header on new page
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Subject', 20, yPos);
      doc.text('IA', 80, yPos);
      doc.text('SEE', 100, yPos);
      if (includePredictions) {
        doc.text('Req. SEE', 120, yPos);
        doc.text('Grade', 145, yPos);
        doc.text('Credits', 170, yPos);
      } else {
        doc.text('Total', 120, yPos);
        doc.text('Grade', 145, yPos);
        doc.text('Credits', 170, yPos);
      }
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
    }
    
    const seeScore = subject.seeScore !== undefined ? subject.seeScore : null;
    const predictedSEE = predictedSEEScores.get(subject.id);
    const finalMarks = seeScore !== null ? calculateFinalMarks(subject.iaMarks, seeScore) : null;
    const gradePoint = finalMarks !== null ? calculateGradePoint(finalMarks) : null;
    const gradeLetter = gradePoint !== null ? getGradeLetter(gradePoint) : null;
    
    // For predicted grade
    const predictedFinalMarks = predictedSEE !== null && predictedSEE !== undefined 
      ? calculateFinalMarks(subject.iaMarks, predictedSEE) 
      : null;
    const predictedGradePoint = predictedFinalMarks !== null ? calculateGradePoint(predictedFinalMarks) : null;
    const predictedGradeLetter = predictedGradePoint !== null ? getGradeLetter(predictedGradePoint) : null;
    
    // Subject name (truncate if too long)
    const subjectName = subject.name.length > 25 ? subject.name.substring(0, 22) + '...' : subject.name;
    doc.text(subjectName, 20, yPos);
    doc.text(subject.iaMarks.toString(), 80, yPos);
    doc.text(seeScore !== null ? seeScore.toString() : '-', 100, yPos);
    
    if (includePredictions) {
      const isLocked = lockedSubjectIds.includes(subject.id);
      if (isLocked) {
        doc.text('(Locked)', 120, yPos);
      } else {
        doc.text(predictedSEE !== null && predictedSEE !== undefined ? predictedSEE.toFixed(0) : 'N/A', 120, yPos);
      }
      doc.text(predictedGradeLetter || '-', 145, yPos);
    } else {
      doc.text(finalMarks !== null ? finalMarks.toFixed(1) : '-', 120, yPos);
      doc.text(gradeLetter || '-', 145, yPos);
    }
    
    doc.text(subject.credits.toString(), 170, yPos);
    
    yPos += 7;
  });
  
  // Add spacing before grade scale
  yPos += 10;
  
  // Grade Scale
  if (yPos > 210) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Grade Scale Reference', 20, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const gradeScale = [
    { grade: 'S', gp: '10', marks: '90-100' },
    { grade: 'A+', gp: '9', marks: '80-89' },
    { grade: 'A', gp: '8', marks: '70-79' },
    { grade: 'B+', gp: '7', marks: '60-69' },
    { grade: 'B', gp: '6', marks: '50-59' },
    { grade: 'C', gp: '5', marks: '40-49' },
    { grade: 'F', gp: '0', marks: '<40' },
  ];
  
  gradeScale.forEach((item) => {
    doc.text(`${item.grade} (${item.gp} points): ${item.marks} marks`, 20, yPos);
    yPos += 6;
  });
  
  // Add note if predictions included
  if (includePredictions && predictedSGPA > 0) {
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Note:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`This report includes predicted SEE scores required to achieve target SGPA of ${targetSGPA.toFixed(2)}.`, 20, yPos);
    yPos += 5;
    doc.text('Locked subjects maintain their current SEE scores. Flexible subjects show required scores.', 20, yPos);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    doc.text('Generated by CGPA Planner', 105, 285, { align: 'center' });
  }
  
  // Save the PDF
  const filename = includePredictions 
    ? `CGPA-Prediction-Report-${new Date().toISOString().split('T')[0]}.pdf`
    : `CGPA-Report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
