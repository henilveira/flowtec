"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";

interface FormContextType {
  formId: string | null;
  setFormId: (id: string) => void;
}

const FORM_ID_STORAGE_KEY = "flowtec_form_id";

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id");

  // Initialize state with null
  const [formId, setFormIdState] = useState<string | null>(null);

  // On initial load, check for ID in URL params first, then localStorage
  useEffect(() => {
    if (urlId) {
      // If ID is in URL, use it and save to localStorage
      setFormIdState(urlId);
      localStorage.setItem(FORM_ID_STORAGE_KEY, urlId);
    } else {
      // If not in URL, try to get from localStorage
      const storedId = localStorage.getItem(FORM_ID_STORAGE_KEY);
      if (storedId) {
        setFormIdState(storedId);
      }
    }
  }, [urlId]);

  // Create a function to update both state and localStorage
  const setFormId = (id: string) => {
    setFormIdState(id);
    localStorage.setItem(FORM_ID_STORAGE_KEY, id);
  };

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
