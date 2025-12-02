import { type RefObject } from "react";
import { CompletionContext } from "@codemirror/autocomplete";
import { ViewPlugin, EditorView } from "@codemirror/view";

/** Create a simple completer that suggests the provided completions. */
export function createMuiThemeCompleter(muiThemeCompletions: any) {
  return () => (context: CompletionContext) => {
    const word = context.matchBefore(/\w*/);
    if (!word || (word.from === word.to && !context.explicit)) return null;
    return { from: word.from, options: muiThemeCompletions };
  };
}

/** Create a ViewPlugin that keeps the provided ref pointing at the active view. */
export function createAttachViewPlugin(
  editorViewRef: RefObject<EditorView | null>
) {
  return ViewPlugin.fromClass(
    class {
      view: EditorView;
      constructor(view: EditorView) {
        this.view = view;
        editorViewRef.current = view;
      }
      destroy() {
        if (editorViewRef.current === this.view) editorViewRef.current = null;
      }
    }
  );
}
