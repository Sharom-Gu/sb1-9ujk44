import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LogIn, ArrowLeft } from 'lucide-react';

interface PatientLoginProps {
  loginInfo: {
    lastName: string;
    birthDate: string;
  };
  errors: Record<string, string>;
  onLoginInfoChange: (info: any) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function PatientLogin({
  loginInfo,
  errors,
  onLoginInfoChange,
  onSubmit,
  onBack,
}: PatientLoginProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-6 w-6" />
          Patient Login
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nachname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${errors.lastName ? 'border-red-500' : ''}`}
              value={loginInfo.lastName}
              onChange={(e) =>
                onLoginInfoChange({ ...loginInfo, lastName: e.target.value })
              }
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Geburtsdatum <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full p-2 border rounded ${errors.birthDate ? 'border-red-500' : ''}`}
              value={loginInfo.birthDate}
              onChange={(e) =>
                onLoginInfoChange({ ...loginInfo, birthDate: e.target.value })
              }
              max={new Date().toISOString().split('T')[0]}
              required
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              Einloggen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}