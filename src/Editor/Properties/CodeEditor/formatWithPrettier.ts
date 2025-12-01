/**
 * Lightweight Prettier formatter helper used by the CodeEditor.
 *
 * This isolates the lazy dynamic imports and keeps the editor component
 * focused on UI logic. The function is best-effort: if Prettier or the
 * parsers can't be loaded the input string is returned unchanged.
 */
export async function formatWithPrettier(code: string): Promise<string> {
  try {
    let prettierModule: unknown;
    let parserBabelModule: unknown;
    let parserTsModule: unknown;
    try {
      // Dynamic imports; keep optional so consumer bundles don't require Prettier
      // @ts-expect-error - dynamic import of optional dependency
      prettierModule = await import("prettier/standalone");
      // @ts-expect-error - dynamic import of optional dependency
      parserBabelModule = await import("prettier/parser-babel");
      // @ts-expect-error - dynamic import of optional dependency
      parserTsModule = await import("prettier/parser-typescript");
    } catch {
      return code;
    }

    const prettier = (
      prettierModule as unknown as {
        default: { format: (c: string, o: unknown) => string };
      }
    ).default;
    const isProbablyTs = /:\s*ThemeOptions|interface\s|type\s|<\w+>/.test(code);
    const parser = isProbablyTs ? "typescript" : "babel";
    const plugins = isProbablyTs
      ? [(parserTsModule as unknown as { default: unknown }).default]
      : [(parserBabelModule as unknown as { default: unknown }).default];

    return prettier.format(code, {
      parser,
      plugins,
      singleQuote: true,
    });
  } catch {
    return code;
  }
}
