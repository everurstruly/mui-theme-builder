import type { SavedToStorageDesign } from "./types";

export function insertItem(list: SavedToStorageDesign[], item: SavedToStorageDesign): SavedToStorageDesign[] {
  return [item, ...list];
}

// Move updated item to the head and remove the old occurrence by index
export function updateItem(list: SavedToStorageDesign[], index: number, item: SavedToStorageDesign): SavedToStorageDesign[] {
  return [item, ...list.slice(0, index), ...list.slice(index + 1)];
}

export function removeItem(list: SavedToStorageDesign[], id: string): SavedToStorageDesign[] {
  return list.filter((d) => d.id !== id);
}

export function limitList<T>(list: T[], max: number): T[] {
  return list.slice(0, max);
}

export function generateId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
      return (crypto as any).randomUUID();
    }
  } catch (e) {
    void e;
  }
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}
