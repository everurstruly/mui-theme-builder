import type { ThemeDsl } from "../compiler";
import type { ThemeSerializer } from "./serialization/ThemeSerializer";

/**
 * Serialization strategy for base theme storage
 */
export type SerializationStrategy = "full" | "delta" | "hybrid";

/**
 * Base theme storage format
 */
export type BaseThemeStorage =
  | {
      type: "inline";
      dsl: ThemeDsl;
      metadata: {
        templateId?: string;
        sourceLabel?: string;
        [key: string]: any;
      };
    }
  | {
      type: "reference";
      reference: {
        templateId: string;
        version: string;
        checksum: string;
      };
      metadata: {
        templateId: string;
        sourceLabel?: string;
        [key: string]: any;
      };
    };

import type { ThemeSnapshot } from "../Current/useCurrent/types";
export type { ThemeSnapshot } from "../Current/useCurrent/types";

/**
 * Lightweight metadata for browsing collection
 */
export interface ThemeSnapshotMetadata {
  id: string;
  title: string;
  createdAt: number;
  updatedAt?: number;
  strategy: SerializationStrategy;
  checkpointHash: string;
}

/**
 * Transaction interface for atomic multi-operation updates
 */
export interface StorageTransaction {
  get(id: string): Promise<ThemeSnapshot | null>;
  create(snapshot: Omit<ThemeSnapshot, "id" | "createdAt">): Promise<ThemeSnapshot>;
  update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot>;
  delete(id: string): Promise<boolean>;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  // CRUD operations
  get(id: string): Promise<ThemeSnapshot | null>;
  create(snapshot: Omit<ThemeSnapshot, "id" | "createdAt">): Promise<ThemeSnapshot>;
  update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot>;
  delete(id: string): Promise<boolean>;

  // Querying
  list(): Promise<ThemeSnapshotMetadata[]>;
  exists(id: string): Promise<boolean>;
  findByTitle(title: string): Promise<ThemeSnapshotMetadata[]>;
  count(): Promise<number>;

  // Transaction support
  transaction<T>(callback: (tx: StorageTransaction) => Promise<T>): Promise<T>;

  // Cleanup
  clear(): Promise<void>;
}

export interface StorageDependencies {
  adapter: StorageAdapter;
  serializer: ThemeSerializer;
}
