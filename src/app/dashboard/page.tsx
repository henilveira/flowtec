"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterIcon } from "lucide-react";
import Title from "./page-title";
import RecentRequests from "./requisicoes-recentes";
import { Piechart2 } from "./piechart-2";
import { Piechart1 } from "./piechart-1";
import { Barchart1 } from "./barchart-1";

export default function Painel() {
  return (
    <div>
      <Title titulo="Dashboard">
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </Title>
      <div className=" w-full p-4 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Requisições totais" value="217" />
          <MetricCard
            title="Contabilidades cadastradas"
            value="20"
          />
          <MetricCard title="Total de Usuários" value="45" />
          <MetricCard
            title="Empresas cadastradas"
            value="185"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Piechart1 />
          <Piechart2 />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <RecentRequests />
          <Barchart1 />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,

}: {
  title: string;
  value: string;

}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

      </CardContent>
    </Card>
  );
}
