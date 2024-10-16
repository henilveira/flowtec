"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AssociatedAccounts() {
  const [associatedAccounts] = useState([
    { id: 1, name: "Johnson & Co. Accounting" },
    { id: 2, name: "Smith Financial Services" },
    { id: 3, name: "Global Tax Solutions" },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contabilidades associadas</CardTitle>
        <CardDescription>
          Veja e gerencie as contabilidades que você está associado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {associatedAccounts.map((account) => (
            <li
              key={account.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span>{account.name}</span>
              <Button variant="outline" size="sm">
                Gerenciar
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
