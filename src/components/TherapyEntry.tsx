import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface TherapyEntryProps {
  currentEntry: {
    date: string;
    einnahmezeit: string;
    wirkungszeit: string;
    wirkung: string;
    nebenwirkungen: string;
    fazit: string;
  };
  errors: Record<string, string>;
  onEntryChange: (entry: any) => void;
  onSubmit: () => void;
  isEditing: boolean;
  showForm: boolean;
}

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

export default function TherapyEntry({
  currentEntry,
  errors,
  onEntryChange,
  onSubmit,
  isEditing,
  showForm,
}: TherapyEntryProps) {
  const timeOptions = generateTimeOptions();

  if (!showForm) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Therapie-Dokumentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Datum <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.date ? 'border-red-500' : ''
                      }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {currentEntry.date
                        ? format(new Date(currentEntry.date), 'P', { locale: de })
                        : 'Datum auswählen'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(currentEntry.date)}
                      onSelect={(date) =>
                        onEntryChange({
                          ...currentEntry,
                          date: date?.toISOString().split('T')[0] || '',
                        })
                      }
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Einnahmezeit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`w-full p-2 pr-8 border rounded appearance-none ${
                    errors.einnahmezeit ? 'border-red-500' : ''
                  }`}
                  value={currentEntry.einnahmezeit}
                  onChange={(e) =>
                    onEntryChange({ ...currentEntry, einnahmezeit: e.target.value })
                  }
                >
                  <option value="">Zeit auswählen</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time} Uhr
                    </option>
                  ))}
                </select>
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              {errors.einnahmezeit && (
                <p className="text-red-500 text-sm mt-1">{errors.einnahmezeit}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Wirkungszeit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className={`w-full p-2 pr-8 border rounded appearance-none ${
                    errors.wirkungszeit ? 'border-red-500' : ''
                  }`}
                  value={currentEntry.wirkungszeit}
                  onChange={(e) =>
                    onEntryChange({ ...currentEntry, wirkungszeit: e.target.value })
                  }
                >
                  <option value="">Zeit auswählen</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time} Uhr
                    </option>
                  ))}
                </select>
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              {errors.wirkungszeit && (
                <p className="text-red-500 text-sm mt-1">{errors.wirkungszeit}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Nebenwirkungen
              </label>
              <select
                className="w-full p-2 border rounded"
                value={currentEntry.nebenwirkungen}
                onChange={(e) =>
                  onEntryChange({
                    ...currentEntry,
                    nebenwirkungen: e.target.value,
                  })
                }
              >
                <option value="keine">Keine</option>
                <option value="leicht">Leichte Nebenwirkungen</option>
                <option value="mittel">Mittelschwere Nebenwirkungen</option>
                <option value="stark">Starke Nebenwirkungen</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Wirkung <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full p-2 border rounded ${errors.wirkung ? 'border-red-500' : ''}`}
                rows={3}
                value={currentEntry.wirkung}
                onChange={(e) =>
                  onEntryChange({ ...currentEntry, wirkung: e.target.value })
                }
                required
              />
              {errors.wirkung && (
                <p className="text-red-500 text-sm mt-1">{errors.wirkung}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fazit</label>
              <select
                className="w-full p-2 border rounded"
                value={currentEntry.fazit}
                onChange={(e) =>
                  onEntryChange({ ...currentEntry, fazit: e.target.value })
                }
              >
                <option value="🙂">🙂 Gut</option>
                <option value="😐">😐 Neutral</option>
                <option value="🙁">🙁 Nicht gut</option>
              </select>
            </div>
          </div>
          <Button onClick={onSubmit} className="w-full mt-4">
            {isEditing ? 'Eintrag aktualisieren' : 'Eintrag hinzufügen'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}