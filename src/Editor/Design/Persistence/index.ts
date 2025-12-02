/**
 * Persistence Module Index
 * 
 * Main entry point for the Persistence module.
 * Exports all public APIs.
 */

// Core types
export type {
  ThemeSnapshot,
  ThemeSnapshotMetadata,
  StorageAdapter,
  StorageTransaction,
  EditCommand,
  ConflictInfo,
  PersistenceError,
  SaveOptions,
  LoadOptions,
  SerializationStrategy,
} from './types';

// Store
export { usePersistenceStore } from './persistenceStore';

// Registry
export {
  initializePersistence,
  getPersistenceDependencies,
  resetPersistenceDependencies,
} from './persistenceRegistry';

// Orchestrator
export { usePersistence } from './usePersistence';

// User-facing hooks
export { useSave, useLoad, useTitleValidation, useCollection } from './hooks';

// Provider
export { PersistenceProvider } from './PersistenceProvider';

// Components
export { default as SaveButton } from '../Current/Save/SaveButton';
export { default as CollectionPopoverMenuButton } from './components/CollectionPopoverMenuButton';
export { default as CollectionDialog } from './components/CollectionDialog';
export { default as CollectionDialogButton } from './components/CollectionDialogButton';
export { default as ConfirmOverwriteDialog } from '../Current/Save/SaveConflictDialog';

// Serialization
export { ThemeSerializer } from './serialization/ThemeSerializer';
export { ThemeDeserializer } from './serialization/ThemeDeserializer';

// Adapters
export { MockStorageAdapter } from './adapters/MockStorageAdapter';
