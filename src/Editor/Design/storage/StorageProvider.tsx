import { MockStorageAdapter } from "./adapters/MockStorageAdapter";
import { ThemeSerializer } from "./serialization/ThemeSerializer";
import { StorageContext, type StorageProviderProps } from "./StorageContext";
import type { StorageDependencies } from "./types";
import { useEffect } from "react";
import { migrateStorageToPersistence } from "./migrationScript";

/**
 * Provides storage dependencies to the component tree
 */

export function StorageProvider({
  children, adapter, serializer,
}: StorageProviderProps) {
  // Use provided dependencies or create defaults
  const deps: StorageDependencies = {
    adapter: adapter ?? new MockStorageAdapter(),
    serializer: serializer ?? new ThemeSerializer(),
  };

  // Run migration silently on mount
  useEffect(() => {
    const runMigration = async () => {
      try {
        const result = await migrateStorageToPersistence();
        if (result.migratedCount > 0) {
          console.log(`Migrated ${result.migratedCount} designs from old format`);
        }
        if (result.errors.length > 0) {
          console.warn('Some designs failed to migrate:', result.errors);
        }
      } catch (error) {
        console.error('Migration failed:', error);
      }
    };
    runMigration();
  }, []);

  return (
    <StorageContext.Provider value={deps}>
      {children}
    </StorageContext.Provider>
  );
}
