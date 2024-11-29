import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const UFSelect = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="UF do responsável" />
      </SelectTrigger>
      <SelectContent>
        {[
          "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", 
          "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", 
          "RR", "SC", "SP", "SE", "TO"
        ].map((uf) => (
          <SelectItem key={uf} value={uf}>
            {uf}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default UFSelect;
