"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SelectContabilidade } from "./select-contabilidade";
import { SelectEtapas } from "./select-etapas";
import { SelectTipoProcessos } from "./select-tipo-processos";


export default function FilterDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [contabilidade, setContabilidade] = React.useState("");
  const [etapa, setEtapa] = React.useState("");
  const [processo, setTipoProcesso] = React.useState("");


  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setContabilidade("");
    setEtapa("");
  };

  const handleApply = () => {
    console.log({
      dateRange: { start: startDate, end: endDate },
      contabilidade,
      etapa,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="end">
        <div className="space-y-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Período</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    {startDate ? (
                      format(startDate, "dd/MM/yyyy")
                    ) : (
                      <span>De</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    {endDate ? format(endDate, "dd/MM/yyyy") : <span>Até</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-blue-500"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
            >
              Limpar
            </Button>
          </div>

          {/* Contabilidade */}
          <div className="space-y-2">
            <Label>Contabilidade</Label>
            <SelectContabilidade />
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-blue-500"
              onClick={() => setContabilidade("")}
            >
              Limpar
            </Button>
          </div>

          {/* Etapa
          <div className="space-y-2">
            <Label>Etapa</Label>
            <SelectEtapas />
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-blue-500"
              onClick={() => setEtapa("")}
            >
              Limpar
            </Button>
          </div> */}

          {/* Tipo de Processo */}
          <div className="space-y-2">
            <Label>Tipo de Processo</Label>
            <SelectTipoProcessos />
            <Button
              variant="ghost"
              className="h-auto p-0 text-xs text-blue-500"
              onClick={() => setTipoProcesso("")}
            >
              Limpar
            </Button>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="w-full" onClick={handleReset}>
              Resetar
            </Button>
            <Button className="w-full" onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}