// Utility helpers to convert between programming language names and file extensions
export function programmingLanguageToFileExtension(
  language?: string | null,
  includeDot = true
): string | null {
  if (!language || typeof language !== "string") return null;
  const raw = language.trim().toLowerCase();

  // If user already passed an extension like ".js" or "js", normalize and return
  const maybeExt = raw.startsWith(".") ? raw.slice(1) : raw;
  if (/^[a-z0-9#+-]+$/.test(maybeExt) && maybeExt.length <= 6) {
    // treat as extension if short and looks like one
    return includeDot ? `.${maybeExt}` : maybeExt;
  }

  const map: Record<string, string> = {
    javascript: "js",
    js: "js",
    jsx: "jsx",
    typescript: "ts",
    ts: "ts",
    tsx: "tsx",
    json: "json",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    html: "html",
    htm: "html",
    markdown: "md",
    md: "md",
    mdx: "mdx",
    python: "py",
    py: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
    "c++": "cpp",
    csharp: "cs",
    "c#": "cs",
    go: "go",
    rust: "rs",
    rs: "rs",
    swift: "swift",
    kotlin: "kt",
    kt: "kt",
    php: "php",
    ruby: "rb",
    rb: "rb",
    sql: "sql",
    yaml: "yaml",
    yml: "yaml",
  };

  const ext = map[raw] ?? null;
  if (!ext) return null;
  return includeDot ? `.${ext}` : ext;
}

export function fileExtensionToProgrammingLanguage(extension?: string | null): string | null {
  if (!extension || typeof extension !== "string") return null;
  const raw = extension.trim().toLowerCase().replace(/^\./, "");
  if (!raw) return null;

  const map: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    json: "json",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    html: "html",
    md: "markdown",
    mdx: "mdx",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    go: "go",
    rs: "rust",
    swift: "swift",
    kt: "kotlin",
    php: "php",
    rb: "ruby",
    sql: "sql",
    yaml: "yaml",
  };

  return map[raw] ?? null;
}

export default {
  programmingLanguageToFileExtension,
  fileExtensionToProgrammingLanguage,
};
