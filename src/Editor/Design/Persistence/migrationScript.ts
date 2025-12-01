/**
 * Storage Migration Script
 * 
 * Migrates data from old Storage format to new Persistence format.
 * Run this once during deployment to convert existing user data.
 * 
 * Usage:
 *   import { migrateStorageToPersistence } from './migrationScript';
 *   await migrateStorageToPersistence();
 */

import type { ThemeSnapshot } from './types';

// Old Storage format type (defined here since Storage module is deleted)
interface SavedToStorageDesign {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  themeOptionsCode: string;
  session?: {
    neutralEdits?: Record<string, any>;
    light?: { designer?: Record<string, any> };
    dark?: { designer?: Record<string, any> };
    codeOverridesSource?: string;
    activeColorScheme?: 'light' | 'dark';
  };
}

const OLD_STORAGE_KEY = 'mui-theme-builder-designs';
const NEW_STORAGE_KEY = 'mui-theme-builder-snapshots-v2';
const BACKUP_KEY = 'mui-theme-builder-designs-backup';

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  failedCount: number;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Main migration function
 */
export async function migrateStorageToPersistence(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    // 1. Check if already migrated
    const existingNew = localStorage.getItem(NEW_STORAGE_KEY);
    if (existingNew) {
      console.log('Migration already completed');
      result.success = true;
      return result;
    }

    // 2. Read old storage format
    const oldData = localStorage.getItem(OLD_STORAGE_KEY);
    if (!oldData) {
      console.log('No old data to migrate');
      result.success = true;
      return result;
    }

    const oldDesigns: SavedToStorageDesign[] = JSON.parse(oldData);
    console.log(`Found ${oldDesigns.length} designs to migrate`);

    // 3. Convert each design to new ThemeSnapshot format
    const newSnapshots: ThemeSnapshot[] = [];

    for (const old of oldDesigns) {
      try {
        const snapshot = convertOldToNew(old);
        newSnapshots.push(snapshot);
        result.migratedCount++;
      } catch (error: any) {
        console.error(`Failed to migrate design ${old.id}:`, error);
        result.errors.push({ id: old.id, error: error.message });
        result.failedCount++;
      }
    }

    // 4. Write to new storage location
    localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(newSnapshots));

    // 5. Keep old storage as backup
    localStorage.setItem(BACKUP_KEY, oldData);

    console.log(`Migration complete: ${result.migratedCount} succeeded, ${result.failedCount} failed`);
    result.success = true;
    return result;
  } catch (error: any) {
    console.error('Migration failed:', error);
    result.errors.push({ id: 'migration', error: error.message });
    return result;
  }
}

/**
 * Convert old SavedToStorageDesign to new ThemeSnapshot
 */
function convertOldToNew(old: SavedToStorageDesign): ThemeSnapshot {
  // Parse compiled theme options back to DSL
  const baseDsl = parseThemeCode(old.themeOptionsCode);

  // Reconstruct edits from session data
  const edits = {
    neutral: old.session?.neutralEdits ?? {},
    schemes: {
      light: { designer: old.session?.light?.designer ?? {} },
      dark: { designer: old.session?.dark?.designer ?? {} },
    },
    codeOverrides: {
      source: old.session?.codeOverridesSource ?? '',
      dsl: old.session?.codeOverridesSource
        ? parseThemeCode(old.session.codeOverridesSource)
        : {},
      flattened: {},
    },
  };

  // Compute checkpoint hash
  const checkpointHash = JSON.stringify({
    base: old.themeOptionsCode,
    ...edits,
  });

  // Convert timestamp strings to numbers
  const createdAt = typeof old.createdAt === 'string' 
    ? new Date(old.createdAt).getTime() 
    : old.createdAt;
  const updatedAt = old.updatedAt 
    ? (typeof old.updatedAt === 'string' ? new Date(old.updatedAt).getTime() : old.updatedAt)
    : createdAt;

  return {
    id: old.id,
    version: 1,
    title: old.title,
    createdAt,
    updatedAt,
    strategy: 'full', // Old format didn't have delta snapshots
    baseTheme: {
      type: 'inline',
      dsl: baseDsl,
      metadata: {},
    },
    edits,
    preferences: {
      activeColorScheme: old.session?.activeColorScheme ?? 'light',
    },
    checkpointHash,
  };
}

/**
 * Parse theme code string to DSL object
 */
function parseThemeCode(source: string): Record<string, any> {
  try {
    return JSON.parse(source);
  } catch {
    return {};
  }
}

/**
 * Rollback migration (restore old data)
 */
export async function rollbackMigration(): Promise<boolean> {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) {
      console.warn('No backup found to rollback');
      return false;
    }

    localStorage.setItem(OLD_STORAGE_KEY, backup);
    localStorage.removeItem(NEW_STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);

    console.log('Migration rolled back successfully');
    return true;
  } catch (error) {
    console.error('Rollback failed:', error);
    return false;
  }
}

/**
 * Check migration status
 */
export function getMigrationStatus(): {
  hasOldData: boolean;
  hasNewData: boolean;
  hasBackup: boolean;
  needsMigration: boolean;
} {
  const hasOldData = !!localStorage.getItem(OLD_STORAGE_KEY);
  const hasNewData = !!localStorage.getItem(NEW_STORAGE_KEY);
  const hasBackup = !!localStorage.getItem(BACKUP_KEY);

  return {
    hasOldData,
    hasNewData,
    hasBackup,
    needsMigration: hasOldData && !hasNewData,
  };
}
