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
 * Version snapshot - a historical point-in-time copy of a design
 */
export interface VersionSnapshot {
  id: string;
  parentDesignId: string;
  snapshot: ThemeSnapshot;
  createdAt: number;
  // Future: Add commit message, author, etc.
}

/**
 * Lightweight metadata for version listing
 */
export interface VersionMetadata {
  id: string;
  parentDesignId: string;
  createdAt: number;
  title: string; // Design title at time of version
  checkpointHash: string;
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

  // Version management
  createVersion(parentDesignId: string, snapshot: ThemeSnapshot): Promise<VersionSnapshot>;
  listVersions(parentDesignId: string): Promise<VersionMetadata[]>;
  getVersion(versionId: string): Promise<VersionSnapshot | null>;
  deleteVersion(versionId: string): Promise<boolean>;

  // Cleanup
  clear(): Promise<void>;
}

export interface StorageDependencies {
  adapter: StorageAdapter;
  serializer: ThemeSerializer;
}