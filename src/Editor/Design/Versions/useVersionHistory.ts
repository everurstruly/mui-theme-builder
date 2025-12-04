import { useState, useCallback, useEffect } from "react";
import { useStorage } from "../storage/useStorage";
import { useCurrent } from "../Current/useCurrent";
import { useHasUnsavedWork } from "../Current/useHasUnsavedWork";
import type { VersionMetadata, VersionSnapshot } from "../storage/types";

export function useVersionHistory() {
  const storage = useStorage();
  const currentDesignId = useCurrent((s) => s.savedId);
  const hasUnsavedWork = useHasUnsavedWork();
  
  const [versions, setVersions] = useState<VersionMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load versions for current design
  const loadVersions = useCallback(async () => {
    if (!currentDesignId) {
      setVersions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const versionList = await storage.adapter.listVersions(currentDesignId);
      setVersions(versionList);
    } catch (err: any) {
      setError(err.message ?? "Failed to load versions");
      console.error("Failed to load versions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentDesignId, storage.adapter]);

  // Auto-load versions when design changes
  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  // Delete a version
  const deleteVersion = useCallback(
    async (versionId: string) => {
      try {
        const success = await storage.adapter.deleteVersion(versionId);
        if (success) {
          setVersions((prev) => prev.filter((v) => v.id !== versionId));
        }
        return success;
      } catch (err: any) {
        setError(err.message ?? "Failed to delete version");
        throw err;
      }
    },
    [storage.adapter]
  );

  // Restore a version (replaces current design)
  const restoreVersion = useCallback(
    async (versionId: string) => {
      try {
        const version = await storage.adapter.getVersion(versionId);
        if (!version) {
          throw new Error("Version not found");
        }

        // Hydrate the version snapshot into current design
        const editStore = useCurrent.getState();
        editStore.hydrate(version.snapshot, { isSaved: true });

        // Update persistence context
        editStore.assignSaveId(version.snapshot.id);
        editStore.recordSavedAt(version.createdAt);

        return version.snapshot;
      } catch (err: any) {
        setError(err.message ?? "Failed to restore version");
        throw err;
      }
    },
    [storage.adapter]
  );

  // Load version as a new design (non-destructive)
  const loadVersionAsNew = useCallback(
    async (versionId: string) => {
      try {
        const version = await storage.adapter.getVersion(versionId);
        if (!version) {
          throw new Error("Version not found");
        }

        // Hydrate as new design (no saved state)
        const editStore = useCurrent.getState();
        editStore.hydrate(version.snapshot, { isSaved: false });

        // Clear persistence context (it's a new design)
        editStore.assignSaveId(null);
        editStore.recordSavedAt(null);
        editStore.updateSaveStatus("idle");

        return version.snapshot;
      } catch (err: any) {
        setError(err.message ?? "Failed to load version");
        throw err;
      }
    },
    [storage.adapter]
  );

  // Get a version for viewing (without loading)
  const getVersion = useCallback(
    async (versionId: string): Promise<VersionSnapshot | null> => {
      try {
        return await storage.adapter.getVersion(versionId);
      } catch (err: any) {
        setError(err.message ?? "Failed to get version");
        return null;
      }
    },
    [storage.adapter]
  );

  return {
    versions,
    isLoading,
    error,
    hasUnsavedWork,
    loadVersions,
    deleteVersion,
    restoreVersion,
    loadVersionAsNew,
    getVersion,
  };
}
