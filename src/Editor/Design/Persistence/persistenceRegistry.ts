/**
 * Persistence Registry
 * 
 * Simple global registry for persistence dependencies.
 * Provides a clean way to access adapter, serializer, and deserializer
 * without prop drilling or complex context patterns.
 */

import type { StorageAdapter } from './types';

interface PersistenceDependencies {
  adapter: StorageAdapter;
  serializer: any; // ThemeSerializer (will be typed when implemented)
  deserializer: any; // ThemeDeserializer (will be typed when implemented)
}

let _deps: Partial<PersistenceDependencies> = {};

/**
 * Initialize persistence dependencies (call once during app startup)
 */
export function initializePersistence(
  adapter: StorageAdapter,
  serializer: any,
  deserializer: any
): void {
  _deps = { adapter, serializer, deserializer };
}

/**
 * Get persistence dependencies (throws if not initialized)
 */
export function getPersistenceDependencies(): PersistenceDependencies {
  if (!_deps.adapter || !_deps.serializer || !_deps.deserializer) {
    throw new Error(
      'Persistence dependencies not initialized. Call initializePersistence() during app startup.'
    );
  }
  return _deps as PersistenceDependencies;
}

/**
 * Reset dependencies (useful for testing)
 */
export function resetPersistenceDependencies(): void {
  _deps = {};
}
