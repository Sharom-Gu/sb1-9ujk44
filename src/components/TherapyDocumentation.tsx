import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Edit2, Mail, AlertCircle } from 'lucide-react';
import UserCreation from './UserCreation';
import TherapyEntry from './TherapyEntry';
import PatientLogin from './PatientLogin';
import AuthSelection from './AuthSelection';
import DoctorSelection from './DoctorSelection';
import { generatePDF } from '@/lib/generatePDF';
import { sendEmailWithPDF } from '@/lib/emailService';
import { useToast } from '@/hooks/use-toast';

const REQUIRED_ENTRIES = 15;

type Step = 'auth' | 'login' | 'register' | 'entry' | 'review' | 'thanks';

export default function TherapyDocumentation() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('auth');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
  });

  const [loginInfo, setLoginInfo] = useState({
    lastName: '',
    birthDate: '',
  });

  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    einnahmezeit: '',
    wirkungszeit: '',
    wirkung: '',
    nebenwirkungen: 'keine',
    fazit: '🙂',
  });

  const [entries, setEntries] = useState<typeof currentEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePatientInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!patientInfo.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }
    if (!patientInfo.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }
    if (!patientInfo.birthDate) {
      newErrors.birthDate = 'Geburtsdatum ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLoginInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!loginInfo.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }
    if (!loginInfo.birthDate) {
      newErrors.birthDate = 'Geburtsdatum ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEntry = () => {
    const newErrors: Record<string, string> = {};

    if (!currentEntry.date) {
      newErrors.date = 'Datum ist erforderlich';
    }
    if (!currentEntry.einnahmezeit) {
      newErrors.einnahmezeit = 'Einnahmezeit ist erforderlich';
    }
    if (!currentEntry.wirkungszeit) {
      newErrors.wirkungszeit = 'Wirkungszeit ist erforderlich';
    }
    if (!currentEntry.wirkung.trim()) {
      newErrors.wirkung = 'Wirkungsbeschreibung ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDoctor = () => {
    if (!selectedDoctor) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie einen Arzt aus",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleAuthSelection = (type: 'login' | 'register') => {
    setStep(type);
    setErrors({});
  };

  const handlePatientSubmit = () => {
    if (validatePatientInfo()) {
      setStep('entry');
    }
  };

  const handleLoginSubmit = () => {
    if (validateLoginInfo()) {
      setPatientInfo({
        ...patientInfo,
        lastName: loginInfo.lastName,
        birthDate: loginInfo.birthDate,
      });
      setStep('entry');
    }
  };

  const handleEntrySubmit = () => {
    if (validateEntry()) {
      if (isEditing) {
        const updatedEntries = [...entries];
        updatedEntries[editIndex] = currentEntry;
        setEntries(updatedEntries);
        setIsEditing(false);
        setEditIndex(-1);
      } else {
        setEntries([...entries, currentEntry]);
      }
      
      setCurrentEntry({
        date: new Date().toISOString().split('T')[0],
        einnahmezeit: '',
        wirkungszeit: '',
        wirkung: '',
        nebenwirkungen: 'keine',
        fazit: '🙂',
      });
      setErrors({});
    }
  };

  const handleEditEntry = (index: number) => {
    setCurrentEntry(entries[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const submitForm = async () => {
    if (!validateDoctor()) return;
    
    if (entries.length < REQUIRED_ENTRIES) {
      toast({
        title: "Nicht genügend Einträge",
        description: `Bitte fügen Sie mindestens ${REQUIRED_ENTRIES} Tageseinträge hinzu. Aktuell haben Sie ${entries.length} Einträge.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const pdf = await generatePDF(patientInfo, entries);
      
      await sendEmailWithPDF({
        doctorEmail: selectedDoctor,
        patientName: `${patientInfo.firstName} ${patientInfo.lastName}`,
        pdf,
        subject: `ADHS-Therapie Dokumentation - ${patientInfo.firstName} ${patientInfo.lastName}`,
        message: `Sehr geehrte(r) Arzt/Ärztin,\n\nanbei finden Sie die Therapie-Dokumentation von ${patientInfo.firstName} ${patientInfo.lastName}.\n\nMit freundlichen Grüßen`
      });
      
      setStep('thanks');
    } catch (error) {
      console.error('Fehler beim Versenden:', error);
      toast({
        title: "Fehler",
        description: "Beim Versenden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {step === 'auth' && (
        <AuthSelection onSelect={handleAuthSelection} />
      )}

      {step === 'register' && (
        <UserCreation
          patientInfo={patientInfo}
          errors={errors}
          onPatientInfoChange={setPatientInfo}
          onSubmit={handlePatientSubmit}
        />
      )}

      {step === 'login' && (
        <PatientLogin
          loginInfo={loginInfo}
          errors={errors}
          onLoginInfoChange={setLoginInfo}
          onSubmit={handleLoginSubmit}
          onBack={() => setStep('auth')}
        />
      )}

      {step === 'entry' && (
        <div className="space-y-6">
          {entries.length >= REQUIRED_ENTRIES && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <DoctorSelection
                  selectedDoctor={selectedDoctor}
                  onDoctorChange={setSelectedDoctor}
                />
                <Button
                  onClick={submitForm}
                  disabled={isSubmitting}
                  className="w-full mt-4"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Wird gesendet...' : 'An Arzt senden'}
                </Button>
              </CardContent>
            </Card>
          )}

          <TherapyEntry
            currentEntry={currentEntry}
            errors={errors}
            onEntryChange={setCurrentEntry}
            onSubmit={handleEntrySubmit}
            isEditing={isEditing}
            showForm={entries.length < REQUIRED_ENTRIES || isEditing}
          />

          {entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  Bisherige Einträge ({entries.length}/{REQUIRED_ENTRIES})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {new Date(entry.date).toLocaleDateString('de-DE')}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEntry(index)}
                          disabled={entries.length >= REQUIRED_ENTRIES && !isEditing}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Einnahme: {entry.einnahmezeit} | Wirkung: {entry.wirkungszeit}</p>
                        <p>Nebenwirkungen: {entry.nebenwirkungen}</p>
                        <p className="font-medium">Wirkung: {entry.wirkung}</p>
                        <p>Fazit: {entry.fazit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === 'thanks' && (
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Vielen Dank!</h2>
            <p className="text-gray-600 mb-4">
              Ihre Therapie-Dokumentation wurde erfolgreich an Ihren Arzt gesendet.
            </p>
            <Button onClick={() => window.location.reload()}>
              Neue Dokumentation starten
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}