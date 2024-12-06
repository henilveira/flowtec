import React, { createContext, useContext, useState } from "react";

// Define o estado do filtro
interface FilterContextType {
  tipoProcesso: string | null;
  setTipoProcesso: (tipo: string | null) => void;
  resetFilters: () => void;
}

// Criação do contexto
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provedor do contexto
export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tipoProcesso, setTipoProcesso] = useState<string | null>(null);

  const resetFilters = () => {
    setTipoProcesso(null);
  };

  return (
    <FilterContext.Provider value={{ tipoProcesso, setTipoProcesso, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook para consumir o contexto
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter deve ser usado dentro de um FilterProvider");
  }
  return context;
};
