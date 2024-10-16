"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de privacidade</CardTitle>
        <CardDescription>
          Gerencie suas informações sensíveis aqui.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Senha atual</Label>
          <Input id="current-password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Senha nova</Label>
          <Input id="new-password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar senha nova</Label>
          <Input id="confirm-password" type="password" />
        </div>
        <Button variant="outline">Alterar senha</Button>
      </CardContent>
    </Card>
  );
}
