"use client";
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
    throw new Error(
      "useContabilidade must be used within a ContabilidadeProvider"
    );
  }
  return context;
};

export const ContabilidadeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(
    null
  );

  return (
    <ContabilidadeContext.Provider
      value={{ selectedCompany, setSelectedCompany }}
    >
      {children}
    </ContabilidadeContext.Provider>
  );
};

export const SelectContabilidade = React.memo(function SelectContabilidade() {
  const { companies } = useListContabilidades();
  const { selectedCompany, setSelectedCompany } = useContabilidade();

  return (
    <div className="w-full">
      <Select value={selectedCompany || ""} onValueChange={setSelectedCompany}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a contabilidade..." />
        </SelectTrigger>
        <SelectContent className="w-full">
          {Array.isArray(companies) &&
            companies.map((company) => (
              <SelectGroup key={company.id}>
                <SelectItem className="w-full" value={company.id}>
                  {company.nome}
                </SelectItem>
              </SelectGroup>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
});
