/**
 * Templates Store
 * 
 * Manages the list of available templates and UI state.
 * This is similar to the collection store but for templates.
 * 
 * Responsibilities:
 * - Store the list of all templates
 * - Track loading state
 * - Manage UI state (dialog open, etc.)
 */

import { create } from 'zustand';
import templatesRegistry, { type TemplateMetadata } from '../../../Templates/registry';

export interface TemplatesState {
  menuOpened: boolean;

  /** List of all available templates */
  templates: TemplateMetadata[];
  
  /** Whether templates are being loaded */
  isLoading: boolean;
  
  /** Error during template operations */
  error: string | null;
}

export interface TemplatesActions {
  setMenuOpened: (opened: boolean) => void;
  setTemplates: (items: TemplateMetadata[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type TemplatesStore = TemplatesState & TemplatesActions;

const initialState: TemplatesState = {
  menuOpened: false,
  templates: Object.values(templatesRegistry), // Initialize from registry
  isLoading: false,
  error: null,
};

export const useTemplates = create<TemplatesStore>((set) => ({
  ...initialState,

  setMenuOpened: (menuOpened) => set({ menuOpened }),

  setTemplates: (templates) => set({ templates, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set(initialState),
}));

export default useTemplates;
