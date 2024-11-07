import { toast } from '@/hooks/use-toast';

interface EmailData {
  doctorEmail: string;
  patientName: string;
  pdf: Blob;
  subject?: string;
  message?: string;
}

export const sendEmailWithPDF = async ({
  doctorEmail,
  patientName,
  pdf,
  subject = 'ADHS-Therapie Dokumentation',
  message = 'Anbei finden Sie die aktuelle Therapie-Dokumentation.'
}: EmailData): Promise<void> => {
  const formData = new FormData();
  formData.append('to', doctorEmail);
  formData.append('subject', subject);
  formData.append('message', message);
  formData.append('pdf', pdf, `${patientName.replace(/\s+/g, '_')}_dokumentation.pdf`);

  try {
    // In einer echten Implementierung würde hier der API-Aufruf erfolgen
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   body: formData
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to send email');
    // }

    // Simulierte Verzögerung für Demo-Zwecke
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Email erfolgreich versendet",
      description: `Die Dokumentation wurde an ${doctorEmail} gesendet.`,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    toast({
      title: "Fehler beim Senden",
      description: "Die Email konnte nicht versendet werden. Bitte versuchen Sie es später erneut.",
      variant: "destructive"
    });
    throw error;
  }
};