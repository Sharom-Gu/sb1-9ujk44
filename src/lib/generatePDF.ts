import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface TherapyEntry {
  date: string;
  einnahmezeit: string;
  wirkungszeit: string;
  wirkung: string;
  nebenwirkungen: string;
  fazit: string;
}

interface PatientInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export const generatePDF = async (
  patientInfo: PatientInfo,
  entries: TherapyEntry[]
): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('ADHS-Therapie Dokumentation', 15, 20);
  
  // Add patient info
  doc.setFontSize(12);
  doc.text(`Patient: ${patientInfo.firstName} ${patientInfo.lastName}`, 15, 35);
  doc.text(`Geburtsdatum: ${format(new Date(patientInfo.birthDate), 'dd.MM.yyyy')}`, 15, 42);
  doc.text(`Erstellt am: ${format(new Date(), 'dd.MM.yyyy', { locale: de })}`, 15, 49);
  
  // Create table with entries
  const tableData = entries.map(entry => [
    format(new Date(entry.date), 'dd.MM.yyyy'),
    entry.einnahmezeit,
    entry.wirkungszeit,
    entry.wirkung,
    entry.nebenwirkungen,
    entry.fazit
  ]);

  (doc as any).autoTable({
    startY: 60,
    head: [['Datum', 'Einnahme', 'Wirkung', 'Beschreibung', 'Nebenwirkungen', 'Fazit']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 60 },
      4: { cellWidth: 35 },
      5: { cellWidth: 15 }
    }
  });
  
  return doc.output('blob');
};