import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { keymap, EditorView } from "@codemirror/view";
import { defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
import { searchKeymap } from "@codemirror/search";
import { completionKeymap } from "@codemirror/autocomplete";

type GetExtensionsOptions = {
  muiThemeCompleter: any;
  attachViewPlugin: any;
  onApply?: () => void;
  onFormatted?: (formattedFull: string) => void | Promise<void>;
};

import { formatWithPrettierSafe } from "./codeEditorUtils";

export function getEditorExtensions(opts: GetExtensionsOptions) {
  const { muiThemeCompleter, attachViewPlugin, onApply, onFormatted } = opts;

  return [
    javascript({ typescript: true }),
    autocompletion({
      override: [muiThemeCompleter()],
      closeOnBlur: true,
      activateOnTyping: true,
    }),
    // Prevent browser/save shortcut when editor has focus by handling Mod-s inside CodeMirror
    keymap.of([
      {
        key: "Mod-s",
        run: () => {
          onApply?.();
          return true;
        },
      },
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...completionKeymap,
      indentWithTab,
    ]),

    // Paste handler: after paste completes, run the formatter and
    // dispatch the replacement so CodeMirror preserves selection/undo.
    EditorView.domEventHandlers({
      paste: (_event, view: EditorView) => {
        // Let the paste happen in the DOM, then format and normalize.
        setTimeout(async () => {
          try {
            const doc = view.state.doc.toString();
            const formattedFull = await formatWithPrettierSafe(doc);
            view.dispatch({
              changes: { from: 0, to: view.state.doc.length, insert: formattedFull },
              userEvent: "input",
            });
            try {
              if (onFormatted) await onFormatted(formattedFull);
            } catch {
              // ignore
            }
          } catch {
            // Swallow — normalization is best-effort.
          }
        }, 0);
        return false;
      },
    }),

    attachViewPlugin,
  ];
}

/**
 * Return the `basicSetup` options used by `@uiw/react-codemirror`.
 * Kept as a factory so callers can memoize or alter if needed.
 */
export function getEditorBasicSetup() {
  return {
    lineNumbers: true,
    highlightActiveLineGutter: false,
    foldGutter: false,
    dropCursor: false,
    allowMultipleSelections: true,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: false, // handled by our autocompletion extension
    rectangularSelection: true,
    highlightSelectionMatches: true,
    searchKeymap: true,
  } as const;
}
