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

export function SelectContabilidade({ onSelectChange }: any) {
  const { companies } = useListContabilidades();
  const [selectedCompany, setSelectedCompany] = React.useState(null);

  const handleSelectChange = (value: any) => {
    setSelectedCompany(value);
    onSelectChange && onSelectChange(value); // Chama a função de callback com o valor selecionado
  };

  return (
    <Select onValueChange={handleSelectChange}>
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
