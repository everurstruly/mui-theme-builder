import { MockStorageAdapter } from "./adapters/MockStorageAdapter";
import { ThemeSerializer } from "./serialization/ThemeSerializer";
import { StorageContext, type StorageProviderProps } from "./StorageContext";
import type { StorageDependencies } from "./types";

/**
 * Provides storage dependencies to the component tree
 */

export function StorageProvider({
  children, adapter, serializer, templateRegistry,
}: StorageProviderProps) {
  // Use provided dependencies or create defaults
  const deps: StorageDependencies = {
    adapter: adapter ?? new MockStorageAdapter(),
    serializer: serializer ?? new ThemeSerializer(templateRegistry),
  };

  return (
    <StorageContext.Provider value={deps}>
      {children}
    </StorageContext.Provider>
  );
}
