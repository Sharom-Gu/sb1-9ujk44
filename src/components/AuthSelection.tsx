import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, LogIn } from 'lucide-react';

interface AuthSelectionProps {
  onSelect: (type: 'login' | 'register') => void;
}

export default function AuthSelection({ onSelect }: AuthSelectionProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Willkommen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => onSelect('login')}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Ich habe bereits einen Account
        </Button>
        <Button
          onClick={() => onSelect('register')}
          className="w-full flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Neuen Patienten anlegen
        </Button>
      </CardContent>
    </Card>
  );
}