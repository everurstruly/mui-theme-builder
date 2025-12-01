/**
 * useCollection Hook
 * 
 * Hook for browsing the collection of saved designs.
 * Fetches and caches the list of all saved theme snapshots.
 */

import { useCallback, useEffect } from 'react';
import { usePersistenceStore } from '../persistenceStore';
import { getPersistenceDependencies } from '../persistenceRegistry';

export function useCollection() {
  const collection = usePersistenceStore((s) => s.collection);
  const setCollection = usePersistenceStore((s) => s.setCollection);
  const status = usePersistenceStore((s) => s.status);
  
  const refreshCollection = useCallback(async () => {
    try {
      const { adapter } = getPersistenceDependencies();
      const items = await adapter.list();
      setCollection(items);
      return items;
    } catch (error) {
      console.error('Failed to fetch collection:', error);
      return [];
    }
  }, [setCollection]);

  // Auto-fetch on mount (with small delay to ensure provider initialized)
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshCollection();
    }, 100);
    return () => clearTimeout(timer);
  }, [refreshCollection]);

  return {
    collection,
    refreshCollection,
    isLoading: status === 'loading',
  };
}
