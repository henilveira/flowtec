"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListTipoProcessos } from "@/hooks/useSocietario";

const TipoProcessoContext = React.createContext<{
  selectedTipoProcesso: string | null;
  setSelectedTipoProcesso: (value: string | null) => void;
}>({
    selectedTipoProcesso: null,
    setSelectedTipoProcesso: () => {},
});

export const TipoProcessoProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTipoProcesso, setSelectedTipoProcesso] = React.useState<string | null>(null);

  return (
    <TipoProcessoContext.Provider value={{ selectedTipoProcesso, setSelectedTipoProcesso }}>
      {children}
    </TipoProcessoContext.Provider>
  );
};

export const useTipoProcesso = () => {
  const context = React.useContext(TipoProcessoContext);
  if (!context) {
    throw new Error("useTipoProcesso must be used within a TipoProcessoProvider");
  }
  return context;
};

export function SelectTipoProcessos() {
  const { tipoProcessos, isLoading, isError } = useListTipoProcessos();
  const { selectedTipoProcesso, setSelectedTipoProcesso } = useTipoProcesso();

  if (isLoading) {
    return <div>Carregando tipos de processo...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar tipos de processo.</div>;
  }

  return (
    <div className="w-full">
      <Select value={selectedTipoProcesso || ""} onValueChange={setSelectedTipoProcesso}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um tipo de processo..." />
        </SelectTrigger>
        <SelectContent>
          {tipoProcessos.map((tipo) => (
            <SelectItem key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
