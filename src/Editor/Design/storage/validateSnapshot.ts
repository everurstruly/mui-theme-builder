import type { ThemeSnapshot } from "../storage";

/**
 * Validate that a snapshot follows our architecture rules.
 * Throws if snapshot is malformed.
 */
export function validateSnapshot(snapshot: ThemeSnapshot, sourceType: string): void {
  // Rule 1: Unsaved designs must have empty ID
  if ((sourceType === 'template' || sourceType === 'blank') && snapshot.id !== '') {
    throw new Error(
      `[${sourceType}] snapshot MUST have empty ID, got: "${snapshot.id}". ` +
      `This would make it appear as a saved design.`
    );
  }

  // Rule 2: Saved designs must have real ID
  if (sourceType === 'snapshot' && !snapshot.id) {
    throw new Error(
      `[${sourceType}] snapshot MUST have a real ID, got empty string. ` +
      `This is a saved design from storage.`
    );
  }

  // Rule 3: Edits must be empty (we use flattened snapshots)
  const hasNeutralEdits = Object.keys(snapshot.edits.neutral).length > 0;
  const hasSchemeEdits = Object.keys(snapshot.edits.schemes.light?.designer || {}).length > 0 ||
    Object.keys(snapshot.edits.schemes.dark?.designer || {}).length > 0;
  const hasCodeEdits = snapshot.edits.codeOverrides?.source ||
    Object.keys(snapshot.edits.codeOverrides?.dsl || {}).length > 0;

  if (hasNeutralEdits || hasSchemeEdits || hasCodeEdits) {
    console.warn(
      `[${sourceType}] snapshot has non-empty edits. This violates our flattened architecture. ` +
      `Edits should be merged into baseTheme during serialization. ` +
      `If this is from old storage, migration should have flattened it.`,
      { neutral: hasNeutralEdits, scheme: hasSchemeEdits, code: hasCodeEdits }
    );
  }
}
