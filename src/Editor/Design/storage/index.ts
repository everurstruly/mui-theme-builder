// Storage contract types only - feature-level types live in Current/useCurrent/types
export type {
  ThemeSnapshot,
  ThemeSnapshotMetadata,
  StorageAdapter,
  SerializationStrategy,
  BaseThemeStorage,
  StorageDependencies
} from './types';

// Storage Context Provider
export { StorageProvider } from './StorageProvider';
export { useStorage } from "./useStorage";

// Serialization
export { ThemeSerializer } from './serialization/ThemeSerializer';

// Adapters
export { MockStorageAdapter } from './adapters/MockStorageAdapter';
// export { FirebaseStorageAdapter } from './adapters/FirebaseStorageAdapter';
