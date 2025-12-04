/**
 * Load from saved snapshot
 */

import type { ThemeSnapshot } from "../../storage";
import { validateSnapshot } from "../../storage/validateSnapshot";
import type { LoadData } from "../types";

export async function loadFromSnapshot(snapshot: ThemeSnapshot): Promise<LoadData> {
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
