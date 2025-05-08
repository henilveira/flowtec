import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateInput(input: string) {
  const numbers = input.replace(/\D/g, "");
  let formatted = "";
  for (let i = 0; i < numbers.length; i++) {
    if (i === 2 || i === 4) formatted += "/";
    if (i >= 8) break;
    formatted += numbers[i];
  }
  return formatted;
}

