import { useContext } from "react";
import { StorageContext } from "./StorageContext";
import type { StorageDependencies } from "./types";

/**
 * Hook to access storage dependencies
 * Throws if used outside StorageProvider
 */

export function useStorage(): StorageDependencies {
  const context = useContext(StorageContext);

  if (!context) {
    throw new Error(
      "useStorage must be used within StorageProvider. " +
      "Wrap your component tree with <StorageProvider>."
    );
  }

  return context;
}
