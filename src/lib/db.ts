import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { z } from 'zod';

// Schema Definitionen
const PatientSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string(),
  createdAt: z.instanceof(Timestamp),
});

const TherapyEntrySchema = z.object({
  id: z.string(),
  patientId: z.string(),
  date: z.string(),
  einnahmezeit: z.string(),
  wirkungszeit: z.string(),
  wirkung: z.string(),
  nebenwirkungen: z.string(),
  fazit: z.string(),
  createdAt: z.instanceof(Timestamp),
});

type Patient = z.infer<typeof PatientSchema>;
type TherapyEntry = z.infer<typeof TherapyEntrySchema>;

export class DatabaseManager {
  // Patienten-Methoden
  async createPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
    const docRef = await addDoc(collection(db, 'patients'), {
      ...patient,
      createdAt: Timestamp.now(),
    });
    
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Patient;
  }

  async getPatientById(id: string): Promise<Patient | null> {
    const docRef = doc(db, 'patients', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Patient;
  }

  async getPatientByLastNameAndBirthDate(lastName: string, birthDate: string): Promise<Patient | null> {
    const q = query(
      collection(db, 'patients'),
      where('lastName', '==', lastName),
      where('birthDate', '==', birthDate)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Patient;
  }

  // Therapie-Einträge-Methoden
  async createTherapyEntry(entry: Omit<TherapyEntry, 'id' | 'createdAt'>): Promise<TherapyEntry> {
    const docRef = await addDoc(collection(db, 'therapy_entries'), {
      ...entry,
      createdAt: Timestamp.now(),
    });
    
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as TherapyEntry;
  }

  async getTherapyEntryById(id: string): Promise<TherapyEntry | null> {
    const docRef = doc(db, 'therapy_entries', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as TherapyEntry;
  }

  async getTherapyEntriesByPatientId(patientId: string): Promise<TherapyEntry[]> {
    const q = query(
      collection(db, 'therapy_entries'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as TherapyEntry[];
  }

  async getLatestTherapyEntries(patientId: string, entriesLimit: number = 15): Promise<TherapyEntry[]> {
    const q = query(
      collection(db, 'therapy_entries'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc'),
      limit(entriesLimit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as TherapyEntry[];
  }
}

// Singleton-Instanz
export const db = new DatabaseManager();