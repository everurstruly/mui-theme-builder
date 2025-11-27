import type { SavedToStorageDesign } from "./types";
import fs from "./fs";

export interface StorageAdapter {
  read(): Promise<SavedToStorageDesign[]>;
  write(items: SavedToStorageDesign[]): Promise<void>;
  clear(): Promise<void>;
}

export const deviceStorageAdapter: StorageAdapter = {
  async read() {
    try {
      return await fs.list();
    } catch {
      return [];
    }
  },

  async write(items: SavedToStorageDesign[]) {
    try {
      await fs.overwriteAll(items);
    } catch {
      // ignore
    }
  },

  async clear() {
    try {
      await fs.clear();
    } catch {
      // ignore
    }
  },
};
