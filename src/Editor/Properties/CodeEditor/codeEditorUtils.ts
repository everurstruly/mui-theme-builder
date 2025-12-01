import { EditorView } from "@codemirror/view";
import {
  buildEditableCodeBodyContent,
  extractBody,
  DEFAULT_BODY_CONTENT,
} from "../../Design/compiler/parsing/codeStringParser";
import { formatWithPrettier } from "./formatWithPrettier";

/** Build the wrapped full content used by the editor from `source`. */
export function buildEditorFullFromSource(source?: string): string {
  if (!source) return buildEditableCodeBodyContent(DEFAULT_BODY_CONTENT);
  return /^\s*\{/.test(source)
    ? buildEditableCodeBodyContent(extractBody(source))
    : source;
}

/** Normalize a string for equality checks (line endings + trim). */
export function normalizeForComparison(s: string): string {
  return s.replace(/\r\n/g, "\n").trim();
}

/**
 * Update the editor state values from a full content string. Returns a
 * tuple [full, body] so callers can set state in one place.
 */
export function parseFullContent(full: string): [string, string] {
  return [full, extractBody(full)];
}

/** Format code using the extracted Prettier helper. Best-effort: falls back to input. */
export async function formatWithPrettierSafe(code: string): Promise<string> {
  try {
    return await formatWithPrettier(code);
  } catch {
    return code;
  }
}

/** Dispatch a replace-all change to a CodeMirror EditorView. */
export function dispatchReplaceAll(view: EditorView | null, text: string): void {
  if (!view) return;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: text },
    userEvent: "input",
  });
}
