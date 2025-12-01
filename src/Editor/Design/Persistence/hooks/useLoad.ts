/**
 * useLoad Hook
 * 
 * User-facing hook for load operations.
 * Provides load function and loading state.
 */

import { usePersistence } from '../usePersistence';
import { usePersistenceStore } from '../persistenceStore';

export function useLoad() {
  const { load } = usePersistence();
  const status = usePersistenceStore((s) => s.status);
  const error = usePersistenceStore((s) => s.error);
  
  return { 
    load, 
    isLoading: status === 'loading', 
    error 
  };
}
