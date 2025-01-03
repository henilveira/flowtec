"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface FormContextType {
  formId: string | null;
  setFormId: (id: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: any) {
  const [formId, setFormId] = useState<string | null>(null);

  return (
    <FormContext.Provider value={{ formId, setFormId }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
