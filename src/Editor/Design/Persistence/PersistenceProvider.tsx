/**
 * Persistence Provider
 * 
 * Initializes persistence dependencies on mount.
 * Wraps application to provide persistence context.
 */

import { useEffect, type ReactNode } from 'react';
import { initializePersistence } from './persistenceRegistry';
import { MockStorageAdapter } from './adapters/MockStorageAdapter';
import { ThemeSerializer } from './serialization/ThemeSerializer';
import { ThemeDeserializer } from './serialization/ThemeDeserializer';
import { usePersistenceStore } from './persistenceStore';
import useCurrent from '../Current/useCurrent';

interface PersistenceProviderProps {
  children: ReactNode;
  adapter?: any;
  serializer?: any;
  deserializer?: any;
  templateRegistry?: any;
}

export function PersistenceProvider({ 
  children,
  adapter,
  serializer,
  deserializer,
  templateRegistry,
}: PersistenceProviderProps) {
  const setSnapshotId = usePersistenceStore((s) => s.setSnapshotId);
  const loadNewTimestamp = useCurrent((s) => (s as any).modificationTimestamps?.loadNew);

  useEffect(() => {
    // Initialize with provided dependencies or defaults
    const adapterInstance = adapter ?? new MockStorageAdapter();
    const serializerInstance = serializer ?? new ThemeSerializer(templateRegistry);
    const deserializerInstance = deserializer ?? new ThemeDeserializer(templateRegistry);

    initializePersistence(
      adapterInstance,
      serializerInstance,
      deserializerInstance
    );

    console.log('Persistence module initialized');
  }, [adapter, serializer, deserializer, templateRegistry]);

  // Clear currentSnapshotId whenever loadNew() is called
  useEffect(() => {
    if (loadNewTimestamp) {
      setSnapshotId(null);
    }
  }, [loadNewTimestamp, setSnapshotId]);

  return <>{children}</>;
}
