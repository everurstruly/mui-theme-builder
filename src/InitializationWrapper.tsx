import { useEffect } from "react";
import {
  getMigrationStatus,
  migrateStorageToPersistence,
} from "./Editor/Design/storage/migrationScript";

export function InitializationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const status = getMigrationStatus();
    if (status.needsMigration) {
      console.log("Running storage migration...");
      migrateStorageToPersistence().then((result) => {
        if (result.success) {
          console.log(
            `Migration complete: ${result.migratedCount} designs migrated`
          );
        } else {
          console.error("Migration failed:", result.errors);
        }
      });
    }
  }, []);

  return <>{children}</>;
}
