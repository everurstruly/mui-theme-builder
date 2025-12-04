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
  /** Currently selected template id for quick selection */
  selectedId: string | null;
}

export interface TemplatesActions {
  setMenuOpened: (opened: boolean) => void;
  setTemplates: (items: TemplateMetadata[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  select: (id: string) => void;
  clearSelection: () => void;
}

export type TemplatesStore = TemplatesState & TemplatesActions;

const initialState: TemplatesState = {
  menuOpened: false,
  templates: Object.values(templatesRegistry), // Initialize from registry
  isLoading: false,
  error: null,
  selectedId: null,
};

export const useTemplates = create<TemplatesStore>((set) => ({
  ...initialState,

  setMenuOpened: (menuOpened) => set({ menuOpened }),

  setTemplates: (templates) => set({ templates, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  reset: () => set(initialState),

  // Selection actions
  select: (id: string) => set({ selectedId: id }),

  clearSelection: () => set({ selectedId: null }),
}));

export default useTemplates;
