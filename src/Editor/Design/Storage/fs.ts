import type { SavedToStorageDesign } from "./types";

const ROOT_KEY = "mui-theme-builder.fs.v1";

type FsRoot = {
  index: Record<string, string>; // normalizedTitle -> id
  data: Record<string, SavedToStorageDesign>;
};

function readRoot(): FsRoot {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return { index: {}, data: {} };
    }
    const raw = localStorage.getItem(ROOT_KEY);
    if (!raw) return { index: {}, data: {} };
    const parsed = JSON.parse(raw) as FsRoot;
    if (!parsed || typeof parsed !== "object") return { index: {}, data: {} };
    return {
      index: parsed.index || {},
      data: parsed.data || {},
    };
  } catch {
    return { index: {}, data: {} };
  }
}

function writeRoot(root: FsRoot) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem(ROOT_KEY, JSON.stringify(root));
  } catch {
    // ignore
  }
}

export async function list(): Promise<SavedToStorageDesign[]> {
  const root = readRoot();
  return Object.values(root.data).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function read(id: string): Promise<SavedToStorageDesign | undefined> {
  const root = readRoot();
  return root.data[id];
}

export async function existsByNormalized(normalizedTitle: string): Promise<string | undefined> {
  const root = readRoot();
  return root.index[normalizedTitle];
}

export async function create(item: SavedToStorageDesign): Promise<void> {
  const root = readRoot();
  const norm = String(item.title || "").trim().toLowerCase();
  if (norm && root.index[norm] && root.index[norm] !== item.id) {
    throw new Error(`TITLE_CONFLICT:${root.index[norm]}`);
  }
  root.data[item.id] = item;
  if (norm) root.index[norm] = item.id;
  writeRoot(root);
}

export async function save(item: SavedToStorageDesign): Promise<void> {
  const root = readRoot();
  const norm = String(item.title || "").trim().toLowerCase();
  // If title collides with other id, throw
  if (norm && root.index[norm] && root.index[norm] !== item.id) {
    throw new Error(`TITLE_CONFLICT:${root.index[norm]}`);
  }
  root.data[item.id] = item;
  if (norm) root.index[norm] = item.id;
  writeRoot(root);
}

export async function rename(id: string, newTitle: string): Promise<void> {
  const root = readRoot();
  const old = root.data[id];
  if (!old) throw new Error(`NOT_FOUND:${id}`);
  const oldNorm = String(old.title || "").trim().toLowerCase();
  const newNorm = String(newTitle || "").trim().toLowerCase();
  if (newNorm && root.index[newNorm] && root.index[newNorm] !== id) {
    throw new Error(`TITLE_CONFLICT:${root.index[newNorm]}`);
  }
  old.title = newTitle;
  if (oldNorm && root.index[oldNorm] === id) delete root.index[oldNorm];
  if (newNorm) root.index[newNorm] = id;
  root.data[id] = old;
  writeRoot(root);
}

export async function remove(id: string): Promise<void> {
  const root = readRoot();
  const old = root.data[id];
  if (!old) return;
  const oldNorm = String(old.title || "").trim().toLowerCase();
  delete root.data[id];
  if (oldNorm && root.index[oldNorm] === id) delete root.index[oldNorm];
  writeRoot(root);
}

export async function overwriteAll(items: SavedToStorageDesign[]): Promise<void> {
  const root: FsRoot = { index: {}, data: {} };
  for (const it of items) {
    root.data[it.id] = it;
    const norm = String(it.title || "").trim().toLowerCase();
    if (norm) root.index[norm] = it.id;
  }
  writeRoot(root);
}

export async function clear(): Promise<void> {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.removeItem(ROOT_KEY);
  } catch {
    // ignore
  }
}

export default {
  list,
  read,
  existsByNormalized,
  create,
  save,
  rename,
  remove,
  overwriteAll,
  clear,
};
