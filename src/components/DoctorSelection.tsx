import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { doctors } from '@/lib/doctors';

interface DoctorSelectionProps {
  selectedDoctor: string;
  onDoctorChange: (doctorEmail: string) => void;
}

export default function DoctorSelection({ selectedDoctor, onDoctorChange }: DoctorSelectionProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Zuständiger Arzt <span className="text-red-500">*</span>
      </label>
      <select
        className="w-full p-2 border rounded"
        value={selectedDoctor}
        onChange={(e) => onDoctorChange(e.target.value)}
        required
      >
        <option value="">Bitte wählen Sie einen Arzt aus</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.email}>
            {doctor.name}
          </option>
        ))}
      </select>
    </div>
  );
}