/**
 * Mock Storage Adapter (localStorage-based)
 *
 * Simple localStorage-based implementation for testing and development.
 * Implements StorageAdapter interface (transactions retired).
 */

import type {
  StorageAdapter,
  ThemeSnapshot,
  ThemeSnapshotMetadata,
  VersionSnapshot,
  VersionMetadata,
} from "../types";

const STORAGE_KEY = "mui-theme-builder-snapshots-v2";
const VERSIONS_KEY = "mui-theme-builder-versions-v1";

export class MockStorageAdapter implements StorageAdapter {
  private generateId(): string {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private async readAll(): Promise<ThemeSnapshot[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private async writeAll(snapshots: ThemeSnapshot[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  }

  private async readAllVersions(): Promise<VersionSnapshot[]> {
    const data = localStorage.getItem(VERSIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private async writeAllVersions(versions: VersionSnapshot[]): Promise<void> {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
  }

  private generateVersionId(): string {
    return `version-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  async get(id: string): Promise<ThemeSnapshot | null> {
    const snapshots = await this.readAll();
    return snapshots.find((s) => s.id === id) || null;
  }

  async create(
    snapshot: Omit<ThemeSnapshot, "id" | "createdAt">
  ): Promise<ThemeSnapshot> {
    const snapshots = await this.readAll();

    // Enforce title uniqueness at storage layer
    const titleExists = snapshots.some(
      (s) => s.title.toLowerCase() === snapshot.title.toLowerCase()
    );
    if (titleExists) {
      throw new Error(`Title "${snapshot.title}" already exists`);
    }

    const newSnapshot: ThemeSnapshot = {
      ...snapshot,
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    snapshots.push(newSnapshot);
    await this.writeAll(snapshots);
    return newSnapshot;
  }

  async update(id: string, partial: Partial<ThemeSnapshot>): Promise<ThemeSnapshot> {
    const snapshots = await this.readAll();
    const index = snapshots.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error(`Snapshot ${id} not found`);
    }

    // Check for title conflicts if title is being updated
    if (partial.title) {
      const titleConflict = snapshots.find(
        (s) => s.id !== id && s.title.toLowerCase() === partial.title!.toLowerCase()
      );
      if (titleConflict) {
        throw new Error(`Title "${partial.title}" already exists (used by snapshot ${titleConflict.id})`);
      }
    }

    const updated: ThemeSnapshot = {
      ...snapshots[index],
      ...partial,
      id, // Ensure ID doesn't change
      updatedAt: Date.now(),
    };

    snapshots[index] = updated;
    await this.writeAll(snapshots);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const snapshots = await this.readAll();
    const filtered = snapshots.filter((s) => s.id !== id);

    if (filtered.length === snapshots.length) {
      return false; // Not found
    }

    await this.writeAll(filtered);
    return true;
  }

  async list(): Promise<ThemeSnapshotMetadata[]> {
    const snapshots = await this.readAll();
    return snapshots.map((s) => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      strategy: s.strategy,
      checkpointHash: s.checkpointHash,
    }));
  }

  async exists(id: string): Promise<boolean> {
    const snapshots = await this.readAll();
    return snapshots.some((s) => s.id === id);
  }

  async findByTitle(title: string): Promise<ThemeSnapshotMetadata[]> {
    const snapshots = await this.readAll();
    return snapshots
      .filter((s) => s.title.toLowerCase() === title.toLowerCase())
      .map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        strategy: s.strategy,
        checkpointHash: s.checkpointHash,
      }));
  }

  async count(): Promise<number> {
    const snapshots = await this.readAll();
    return snapshots.length;
  }

  // Transaction support removed for this mock adapter per project decision.

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSIONS_KEY);
  }

  // Version management
  async createVersion(parentDesignId: string, snapshot: ThemeSnapshot): Promise<VersionSnapshot> {
    const versions = await this.readAllVersions();
    const newVersion: VersionSnapshot = {
      id: this.generateVersionId(),
      parentDesignId,
      snapshot,
      createdAt: Date.now(),
    };
    versions.push(newVersion);
    await this.writeAllVersions(versions);
    return newVersion;
  }

  async listVersions(parentDesignId: string): Promise<VersionMetadata[]> {
    const versions = await this.readAllVersions();
    return versions
      .filter((v) => v.parentDesignId === parentDesignId)
      .map((v) => ({
        id: v.id,
        parentDesignId: v.parentDesignId,
        createdAt: v.createdAt,
        title: v.snapshot.title,
        checkpointHash: v.snapshot.checkpointHash,
      }))
      .sort((a, b) => b.createdAt - a.createdAt); // Most recent first
  }

  async getVersion(versionId: string): Promise<VersionSnapshot | null> {
    const versions = await this.readAllVersions();
    return versions.find((v) => v.id === versionId) || null;
  }

  async deleteVersion(versionId: string): Promise<boolean> {
    const versions = await this.readAllVersions();
    const filtered = versions.filter((v) => v.id !== versionId);

    if (filtered.length === versions.length) {
      return false; // Not found
    }

    await this.writeAllVersions(filtered);
    return true;
  }
}
