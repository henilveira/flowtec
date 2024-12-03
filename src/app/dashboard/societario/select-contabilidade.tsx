'use client'
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListContabilidades } from "@/hooks/useListContabilidade";

const ContabilidadeContext = React.createContext<{
  selectedCompany: string | null;
  setSelectedCompany: (value: string) => void;
}>({
  selectedCompany: null,
  setSelectedCompany: () => {},
});

export const useContabilidade = () => {
  const context = React.useContext(ContabilidadeContext);
  if (!context) {
    throw new Error('useContabilidade must be used within a ContabilidadeProvider');
  }
  return context;
};

export const ContabilidadeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(null);

  return (
    <ContabilidadeContext.Provider value={{ selectedCompany, setSelectedCompany }}>
      {children}
    </ContabilidadeContext.Provider>
  );
};

export function SelectContabilidade() {
  const { companies } = useListContabilidades();
  const { selectedCompany, setSelectedCompany } = useContabilidade();

  return (
    <Select value={selectedCompany || ""} onValueChange={setSelectedCompany}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Contabilidade..." />
      </SelectTrigger>
      <SelectContent className="flex items-center justify-center">
        {Array.isArray(companies) &&
          companies.map((company) => (
            <SelectGroup key={company.id}>
              <SelectItem value={company.id}>{company.nome}</SelectItem>
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  );
}