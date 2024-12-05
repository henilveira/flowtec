"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListEtapas } from "@/hooks/useSocietario";

const EtapaContext = React.createContext<{
  selectedEtapa: string | null;
  setSelectedEtapa: (value: string | null) => void;
}>({
  selectedEtapa: null,
  setSelectedEtapa: () => {},
});

export const EtapaProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedEtapa, setSelectedEtapa] = React.useState<string | null>(null);

  return (
    <EtapaContext.Provider value={{ selectedEtapa, setSelectedEtapa }}>
      {children}
    </EtapaContext.Provider>
  );
};

export const useEtapa = () => {
  const context = React.useContext(EtapaContext);
  if (!context) {
    throw new Error("useEtapa must be used within an EtapaProvider");
  }
  return context;
};

export function SelectEtapas() {
  const { etapas, isLoading, isError } = useListEtapas();
  const { selectedEtapa, setSelectedEtapa } = useEtapa();

  if (isLoading) {
    return <div>Carregando etapas...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar etapas.</div>;
  }

  return (
    <div className="w-full">
      <Select value={selectedEtapa || ""} onValueChange={setSelectedEtapa}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma etapa..." />
        </SelectTrigger>
        <SelectContent>
          {etapas.map((etapa) => (
            <SelectItem className="w-full" key={etapa.id} value={etapa.id}>
              {etapa.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
