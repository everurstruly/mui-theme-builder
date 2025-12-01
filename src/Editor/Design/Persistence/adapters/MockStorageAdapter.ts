/**
 * Mock Storage Adapter (localStorage-based)
 * 
 * Simple localStorage-based implementation for testing and development.
 * Implements full StorageAdapter interface with transaction support.
 */

import type { 
  StorageAdapter, 
  StorageTransaction, 
  ThemeSnapshot, 
  ThemeSnapshotMetadata 
} from '../types';

const STORAGE_KEY = 'mui-theme-builder-snapshots-v2';

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

  async get(id: string): Promise<ThemeSnapshot | null> {
    const snapshots = await this.readAll();
    return snapshots.find(s => s.id === id) || null;
  }

  async create(snapshot: Omit<ThemeSnapshot, 'id' | 'createdAt'>): Promise<ThemeSnapshot> {
    const snapshots = await this.readAll();
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
    const index = snapshots.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Snapshot ${id} not found`);
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
    const filtered = snapshots.filter(s => s.id !== id);
    
    if (filtered.length === snapshots.length) {
      return false; // Not found
    }

    await this.writeAll(filtered);
    return true;
  }

  async list(): Promise<ThemeSnapshotMetadata[]> {
    const snapshots = await this.readAll();
    return snapshots.map(s => ({
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
    return snapshots.some(s => s.id === id);
  }

  async findByTitle(title: string): Promise<ThemeSnapshotMetadata[]> {
    const snapshots = await this.readAll();
    return snapshots
      .filter(s => s.title.toLowerCase() === title.toLowerCase())
      .map(s => ({
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

  async transaction<T>(callback: (tx: StorageTransaction) => Promise<T>): Promise<T> {
    // Simple transaction: read all, execute operations, write all
    // In a real implementation, this would use proper locking
    const tx: StorageTransaction = {
      get: this.get.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
    };

    try {
      return await callback(tx);
    } catch (error) {
      // Rollback would happen here in a real implementation
      throw error;
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}
