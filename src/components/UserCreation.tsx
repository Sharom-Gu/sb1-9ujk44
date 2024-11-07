import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface UserCreationProps {
  patientInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  errors: Record<string, string>;
  onPatientInfoChange: (info: any) => void;
  onSubmit: () => void;
}

export default function UserCreation({
  patientInfo,
  errors,
  onPatientInfoChange,
  onSubmit,
}: UserCreationProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6" />
          Neuen Patienten anlegen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Vorname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${errors.firstName ? 'border-red-500' : ''}`}
              value={patientInfo.firstName}
              onChange={(e) =>
                onPatientInfoChange({ ...patientInfo, firstName: e.target.value })
              }
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nachname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : ''}`}
              value={patientInfo.lastName}
              onChange={(e) =>
                onPatientInfoChange({ ...patientInfo, lastName: e.target.value })
              }
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Geburtsdatum <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      errors.birthDate ? 'border-red-500' : ''
                    }`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {patientInfo.birthDate
                      ? format(new Date(patientInfo.birthDate), 'P', { locale: de })
                      : 'Geburtsdatum auswählen'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={patientInfo.birthDate ? new Date(patientInfo.birthDate) : undefined}
                    onSelect={(date) =>
                      onPatientInfoChange({
                        ...patientInfo,
                        birthDate: date?.toISOString().split('T')[0] || '',
                      })
                    }
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
              )}
            </div>
          </div>
        </div>
        <Button onClick={onSubmit} className="w-full mt-6">
          Patient anlegen und fortfahren
        </Button>
      </CardContent>
    </Card>
  );
}