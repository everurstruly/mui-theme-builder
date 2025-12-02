import { useCallback, useEffect, useState } from 'react';
import { useCollection } from './useCollection';
import { useStorage } from "../storage/useStorage";
import { useLoad } from "../Current/useLoad";
import { loadFromSnapshot } from "../Current/loadStrategies";
import useCurrent from "../Current/useCurrent";

export function useManageCollection() {
  const storage = useStorage();
  const collection = useCollection((s) => s.collection);
  const setCollection = useCollection((s) => s.setCollection);
  const isLoading = useCollection((s) => s.isLoading);
  const setLoading = useCollection((s) => s.setLoading);
  const setError = useCollection((s) => s.setError);
  
  const { load, status, blocker } = useLoad();
  const currentSnapshotId = useCurrent((s) => s.persistenceSnapshotId);
  const setSnapshotId = useCurrent((s) => s.setPersistenceSnapshotId);

  const [hasLoadedDesign, setHasLoadedDesign] = useState(false);
  const [onLoadSuccess, setOnLoadSuccess] = useState<(() => void) | null>(null);
  
  const refreshCollection = useCallback(async () => {
    try {
      setLoading(true);
      const items = await storage.adapter.list();
      setCollection(items);
      return items;
    } catch (error) {
      console.error('Failed to fetch collection:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch collection');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setCollection, setLoading, setError, storage.adapter]);

  const loadDesign = useCallback(
    (id: string, onSuccess?: () => void) => {
      setHasLoadedDesign(false);
      if (onSuccess) {
        setOnLoadSuccess(() => onSuccess);
      }
      load(() => loadFromSnapshot(id, storage));
    },
    [load, storage]
  );

  const deleteDesign = useCallback(
    async (id: string) => {
      // If deleting the currently open design, clear the snapshot ID
      if (id === currentSnapshotId) {
        setSnapshotId(null);
      }

      await storage.adapter.delete(id);
      await refreshCollection();
    },
    [refreshCollection, currentSnapshotId, setSnapshotId, storage.adapter]
  );

  // Auto-fetch on mount (with small delay to ensure provider initialized)
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshCollection();
    }, 100);
    return () => clearTimeout(timer);
  }, [refreshCollection]);

  // Handle successful load
  useEffect(() => {
    if (status === "loading") {
      setHasLoadedDesign(true);
    }

    if (hasLoadedDesign && status === "idle" && !blocker) {
      // Successfully loaded without blockers
      const timer = setTimeout(() => {
        if (onLoadSuccess) {
          onLoadSuccess();
          setOnLoadSuccess(null);
        }
        setHasLoadedDesign(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [status, blocker, hasLoadedDesign, onLoadSuccess]);

  return {
    collection,
    refreshCollection,
    isLoading,
    loadDesign,
    deleteDesign,
    loadStatus: status,
    loadBlocker: blocker,
    isLoadingDesign: status === "loading",
  };
}
