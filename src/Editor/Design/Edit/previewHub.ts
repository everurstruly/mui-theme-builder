type Listener = () => void;

const previewMap = new Map<string, any>();
const listeners = new Set<Listener>();
let rafHandle: number | null = null;

export const setPreviewValue = (path: string, value: any) => {
  previewMap.set(path, value);
  scheduleNotify();
};

export const clearPreviewValue = (path?: string) => {
  if (path == null) previewMap.clear();
  else previewMap.delete(path);
  scheduleNotify();
};

export const getPreviewValue = (path: string) => previewMap.get(path);

export const getAllPreviews = () => {
  // return a shallow clone for safe iteration
  return Object.fromEntries(previewMap.entries());
};

export const subscribeToPreviews = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

function scheduleNotify() {
  if (rafHandle != null) return;
  if (typeof requestAnimationFrame === "undefined") {
    // Fallback: synchronous notify in non-browser envs
    listeners.forEach((l) => l());
    return;
  }
  rafHandle = requestAnimationFrame(() => {
    rafHandle = null;
    listeners.forEach((l) => l());
  });
}
