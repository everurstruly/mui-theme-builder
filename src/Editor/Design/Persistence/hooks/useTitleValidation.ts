/**
 * useTitleValidation Hook
 * 
 * User-facing hook for proactive title conflict detection.
 * Provides debounced title checking with caching.
 */

import { useState, useMemo } from 'react';
import type { ConflictInfo } from '../types';
import { getPersistenceDependencies } from '../persistenceRegistry';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function useTitleValidation() {
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkTitle = useMemo(() => {
    return debounce(async (title: string) => {
      setIsChecking(true);
      
      try {
        const { adapter } = getPersistenceDependencies();
        const existing = await adapter.findByTitle(title);
        
        const result = (existing && existing.length > 0) 
          ? { 
              type: 'title' as const, 
              existingId: existing[0].id, 
              existingTitle: existing[0].title, 
              currentTitle: title 
            } 
          : null;
        
        setConflict(result);
      } catch (error) {
        console.error('Title validation error:', error);
        setConflict(null);
      } finally {
        setIsChecking(false);
      }
    }, 300);
  }, []);

  return { 
    checkTitle, 
    conflict, 
    isChecking, 
    hasConflict: conflict !== null 
  };
}
