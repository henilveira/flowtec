/**
 * Utilities for managing form ID in localStorage
 */

export const FORM_ID_STORAGE_KEY = "flowtec_form_id";

/**
 * Get the stored form ID from localStorage
 * @returns The stored form ID or null if not found
 */
export function getStoredFormId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(FORM_ID_STORAGE_KEY);
  }
  return null;
}

/**
 * Store a form ID in localStorage
 * @param id The form ID to store
 */
export function storeFormId(id: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(FORM_ID_STORAGE_KEY, id);
  }
}

/**
 * Clear the stored form ID from localStorage
 */
export function clearStoredFormId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(FORM_ID_STORAGE_KEY);
  }
}

/**
 * Check if a form ID is stored in localStorage
 * @returns True if a form ID is stored, false otherwise
 */
export function hasStoredFormId(): boolean {
  const id = getStoredFormId();
  return id !== null && id !== "";
}
