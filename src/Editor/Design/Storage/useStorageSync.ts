import { useEffect } from "react";
import type { StorageAdapter } from "./storageAdapters";
import type { SavedToStorageDesign } from "./types";

export function useStorageSync(
  adapter: StorageAdapter,
  setSavedDesigns: (items: SavedToStorageDesign[]) => void
) {
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (mounted) {
        const items = await adapter.read();
        setSavedDesigns(items);
      }
    }

    init();

    // listen for storage events to keep multiple tabs in sync
    const onStorage = async () => {
      const items = await adapter.read();
      setSavedDesigns(items);
    };

    window.addEventListener("storage", onStorage);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [adapter, setSavedDesigns]);
}
