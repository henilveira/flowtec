"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>Customize suas preferências.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="marketing-emails">
            Receba e-mails de atualizações de estado das suas requisições
          </Label>
          <Switch id="marketing-emails" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="two-factor-auth">
            Ativar autenticação de dois fatores
          </Label>
          <Switch id="two-factor-auth" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="account-activity">
            Notificar minhas atividades
          </Label>
          <Switch id="account-activity" />
        </div>
      </CardContent>
    </Card>
  );
}
