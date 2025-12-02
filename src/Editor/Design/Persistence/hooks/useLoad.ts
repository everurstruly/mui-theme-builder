/**
 * useLoad Hook
 * 
 * User-facing hook for load operations with blocker pattern.
 * Checks for unsaved changes before loading.
 */

import { useState, useCallback } from 'react';
import { usePersistence } from '../usePersistence';
import { usePersistenceStore } from '../persistenceStore';
import { useSave } from './useSave';
import { useCurrent } from '../../Current/useCurrent';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'blocked';

export interface LoadBlocker {
  reason: 'UNSAVED_CHANGES';
  context: { targetDesignId: string };
  resolutions: {
    discardAndProceed: () => void;
    cancel: () => void;
  };
}

export function useLoad() {
  const { load: loadFromPersistence } = usePersistence();
  const persistenceStatus = usePersistenceStore((s) => s.status);
  const error = usePersistenceStore((s) => s.error);
  const currentSnapshotId = usePersistenceStore((s) => s.currentSnapshotId);
  const { isDirty } = useSave();
  
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [blocker, setBlocker] = useState<LoadBlocker | null>(null);

  // Internal executor: Actually loads the design
  const executeLoad = useCallback(
    async (id: string) => {
      setStatus('loading');
      setBlocker(null);

      try {
        await loadFromPersistence(id);
        setStatus('success');
        // Reset to idle on next tick
        setTimeout(() => setStatus('idle'), 0);
      } catch (err) {
        console.error('Load failed', err);
        setStatus('idle');
      }
    },
    [loadFromPersistence]
  );

  // Public API
  const load = useCallback(
    async (id: string) => {
      const editStore = useCurrent.getState();
      const checkpointHash = (editStore as any).checkpointHash;
      
      // Check for unsaved changes (same logic as launch)
      const hasDesignerEdits = 
        Object.keys(editStore.neutralEdits).length > 0 ||
        Object.keys(editStore.schemeEdits.light?.designer || {}).length > 0 ||
        Object.keys(editStore.schemeEdits.dark?.designer || {}).length > 0 ||
        (editStore.codeOverridesSource && editStore.codeOverridesSource.trim().length > 0);
      
      const hasUnsavedChanges = checkpointHash !== null 
        ? isDirty
        : hasDesignerEdits;
      
      console.log('[LOAD DEBUG]', {
        isDirty,
        currentSnapshotId,
        checkpointHash,
        hasDesignerEdits,
        hasUnsavedChanges,
        willBlock: hasUnsavedChanges
      });
      
      if (hasUnsavedChanges) {
        // HIT A BLOCKER: Return the context and resolutions
        setStatus('blocked');
        setBlocker({
          reason: 'UNSAVED_CHANGES',
          context: { targetDesignId: id },
          resolutions: {
            discardAndProceed: () => executeLoad(id),
            cancel: () => {
              setStatus('idle');
              setBlocker(null);
            },
          },
        });
      } else {
        // HAPPY PATH
        await executeLoad(id);
      }
    },
    [isDirty, currentSnapshotId, executeLoad]
  );
  
  return { 
    load, 
    isLoading: persistenceStatus === 'loading' || status === 'loading',
    status,
    blocker,
    error 
  };
}
