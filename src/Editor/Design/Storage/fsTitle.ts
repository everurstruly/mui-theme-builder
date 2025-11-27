import normalizeTitle from "./normalizeTitle";
import type { SavedToStorageDesign } from "./types";

export type TitleConflict = { id: string; type: "TITLE_CONFLICT" };

export function detectTitleConflict(
  list: SavedToStorageDesign[],
  title: string,
  currentSourceId?: string
): TitleConflict | null {
  const normTitle = normalizeTitle(title);
  const existing = list.find((d) => normalizeTitle(d.title) === normTitle);

  if (existing) {
    if (existing.id !== currentSourceId) {
      return { id: existing.id, type: "TITLE_CONFLICT" };
    }
  }
  return null;
}

export function findItemIndex(
  list: SavedToStorageDesign[],
  title: string,
  currentSourceId?: string,
  overwriteExisting?: boolean
): number {
  if (overwriteExisting && title) {
    const normTitle = normalizeTitle(title);
    return list.findIndex((d) => normalizeTitle(d.title) === normTitle);
  }
  if (currentSourceId) {
    return list.findIndex((d) => d.id === currentSourceId);
  }
  return -1;
}

export function generateCopyTitle(list: SavedToStorageDesign[], rawTitle?: string) {
  const title = rawTitle || "Untitled";
  const normalizedBase = title.replace(/\s*\(copy(?:\s*\d+)?\)\s*$/i, "").trim() || "Untitled";

  function escapeRegExp(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const copyPattern = new RegExp(
    `^${escapeRegExp(normalizedBase)}\\s*\\(copy(?:\\s*\\d+)?\\)$`,
    "i"
  );

  const existingCopies = list
    .map((d) => d.title)
    .filter(Boolean)
    .filter((t) => !!t && copyPattern.test(t as string));

  let copyTitle = `${normalizedBase} (copy)`;
  if (existingCopies.length > 0) {
    let max = 0;
    for (const t of existingCopies) {
      const m = (t as string).match(/\(copy(?:\s*(\d+))?\)$/i);
      if (m) {
        const n = m[1] ? parseInt(m[1], 10) : 1;
        if (n > max) max = n;
      }
    }
    const next = max === 0 ? 2 : max + 1;
    copyTitle = `${normalizedBase} (copy ${next})`;
  }

  return copyTitle;
}
