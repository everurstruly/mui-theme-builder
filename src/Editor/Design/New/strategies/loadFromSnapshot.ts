import type { StorageDependencies } from "../../storage";
import { validateSnapshot } from "../../storage/validateSnapshot";
import type { LoadData } from "../types";

/**
 * Load from saved snapshot
 */

export async function loadFromSnapshot(
  snapshotId: string,
  storage: StorageDependencies
): Promise<LoadData> {
  const snapshot = await storage.adapter.get(snapshotId);
  if (!snapshot) {
    throw {
      code: "INVALID_DATA",
      message: "Snapshot not found",
    };
  }

  // Validate before returning
  validateSnapshot(snapshot, "snapshot");

  return {
    snapshot,
    metadata: {
      snapshotId: snapshot.id,
      updatedAt: snapshot.updatedAt,
      title: snapshot.title,
      sourceType: "snapshot",
    },
  };
}
