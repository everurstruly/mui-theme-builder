import type { SavedToStorageDesign } from "./useDesignStorage";

export interface PersistenceAdapter {
  read(): Promise<SavedToStorageDesign[]>;
  write(items: SavedToStorageDesign[]): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = "mui-theme-builder.savedDesigns.v1";

export const deviceStorageAdapter: PersistenceAdapter = {
  async read() {
    try {
      if (typeof window === "undefined" || !window.localStorage) return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as SavedToStorageDesign[];
    } catch {
      return [];
    }
  },

  async write(items: SavedToStorageDesign[]) {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  async clear() {
    try {
      if (typeof window === "undefined" || !window.localStorage) return;
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};

export default deviceStorageAdapter;
