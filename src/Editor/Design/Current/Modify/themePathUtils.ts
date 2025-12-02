export const SCHEME_SPECIFIC_PATHS = new Set(["palette", "shadows"]);

export function getEditScope(path: string): 'global' | 'scheme' {
  const topLevel = String(path).split('.')?.[0] ?? '';
  return SCHEME_SPECIFIC_PATHS.has(topLevel) ? 'scheme' : 'global';
}

export function resolveEditPath(path: string, activeScheme: 'light' | 'dark') {
  const scope = getEditScope(path);
  return {
    storeKey: scope === 'scheme' ? `${activeScheme}:${path}` : path,
    scope,
  };
}
