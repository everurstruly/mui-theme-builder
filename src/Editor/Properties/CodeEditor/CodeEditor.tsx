import CodeMirror from "@uiw/react-codemirror";
import Toolbar from "./Toolbar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stack, Box } from "@mui/material";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { completionKeymap } from "@codemirror/autocomplete";
import { keymap, EditorView, ViewPlugin } from "@codemirror/view";
import { defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
import { searchKeymap } from "@codemirror/search";
import { muiThemeCompletions } from "./muiThemeCompletions";
import useDeveloperToolEdit from "../../Design/Edit/useDeveloperToolEdit";
import useDeveloperToolActions from "../../Design/Edit/useDeveloperEditTools";
import {
  themeCompiler,
  type ValidationError,
} from "../../Design/compiler";
import {
  buildEditableCodeBodyContent,
  extractBody,
  DEFAULT_BODY_CONTENT,
} from "../../Design/compiler/parsing/codeStringParser";
import AlertBar from "./AlertBar";

export default function CodeEditor() {
  // Use focused hooks instead of monolithic useCodeEditorPanel
  const { source, error, hasOverrides } = useDeveloperToolEdit();
  const { applyModifications, clearOverrides } = useDeveloperToolActions();
  const validate = themeCompiler.validateThemeCode;

  // Track validation errors separately from evaluation errors
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationError[]>(
    []
  );
  // Editor holds the full editable content (header + body + footer).
  // `editorBody` is derived from the full content for convenience.
  const initialFull = source
    ? /^\s*\{/.test(source)
      ? buildEditableCodeBodyContent(extractBody(source))
      : source
    : buildEditableCodeBodyContent(DEFAULT_BODY_CONTENT);

  const [fullContent, setFullContent] = useState<string>(() => initialFull);
  const [editorBody, setEditorBody] = useState<string>(() =>
    extractBody(initialFull)
  );

  // Keep a snapshot of the previous editor body so we can undo the last change
  // if evaluation fails. This mirrors a single undo step.
  const lastEditorBodyRef = useRef<string>(extractBody(initialFull));

  useEffect(() => {
    lastEditorBodyRef.current = editorBody;
  }, [editorBody]);

  // Track unsaved changes relative to the incoming `source` (compare wrapped full content)
  const hasUnsavedModifications = useMemo(() => {
    const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();
    const sourceFull = source
      ? /^\s*\{/.test(source)
        ? buildEditableCodeBodyContent(extractBody(source))
        : source
      : buildEditableCodeBodyContent(DEFAULT_BODY_CONTENT);
    return normalize(fullContent) !== normalize(sourceFull);
  }, [fullContent, source]);

  // Keep fullContent and editorBody in sync when external `source` changes
  useEffect(() => {
    if (!source) {
      const base = buildEditableCodeBodyContent(DEFAULT_BODY_CONTENT);
      setFullContent(base);
      setEditorBody(extractBody(base));
      return;
    }

    const full = /^\s*\{/.test(source)
      ? buildEditableCodeBodyContent(extractBody(source))
      : source;
    setFullContent(full);
    setEditorBody(extractBody(full));
  }, [source]);

  // Handle edits from CodeMirror. Editor contains the full content.
  const handleChange = useCallback(
    (value: string) => {
      // Snapshot the previous body so we can undo a failed apply
      lastEditorBodyRef.current = editorBody;
      setFullContent(value);
      try {
        setEditorBody(extractBody(value));
      } catch {
        // ignore extraction failures while typing
      }

      // Clear validation errors when user edits
      setValidationErrors([]);
      setValidationWarnings([]);
    },
    [editorBody]
  );

  // Keep a ref to the active EditorView so we can dispatch changes (preserves
  // undo/selection) when applying formatted content. We attach it via a small
  // ViewPlugin added to the editor extensions below.
  const editorViewRef = useRef<EditorView | null>(null);

  const attachViewPlugin = useMemo(
    () =>
      ViewPlugin.fromClass(
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
      ),
    []
  );

  // Helper: format using Prettier. Lazy-loads the standalone Prettier and the
  // appropriate parser (typescript or babel) on first use.
  const formatWithPrettier = useCallback(async (code: string) => {
    try {
      let prettierModule: unknown;
      let parserBabelModule: unknown;
      let parserTsModule: unknown;
      try {
        // Dynamic imports; use ts-ignore to avoid type-resolution errors in the editor environment
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
  }, []);

  const handleApply = useCallback(async () => {
    // Use the full editor content (header + body + footer) as the stored source
    const currentFull = fullContent;

    // Format using Prettier before validating/applying. If formatting fails,
    // fall back to the raw content. Use lazy-loading formatter.
    let formattedFull = currentFull;
    try {
      formattedFull = await formatWithPrettier(currentFull);
    } catch {
      // If prettier fails, continue with unformatted content.
    }

    // If we have the EditorView, dispatch a single change so CodeMirror keeps
    // selection/undo history.
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: formattedFull },
        userEvent: "input",
      });
    }

    try {
      setFullContent(formattedFull);
      setEditorBody(extractBody(formattedFull));
    } catch {
      // ignore extraction failures
    }

    // Step 1: Pre-validate before evaluation (validation expects either full content or object literal)
    const validationResult = validate(formattedFull);

    if (!validationResult.valid) {
      // Show validation errors
      setValidationErrors(validationResult.errors);
      setValidationWarnings(validationResult.warnings);
      return;
    }

    // Show warnings but allow apply
    if (validationResult.warnings.length > 0) {
      setValidationWarnings(validationResult.warnings);
    }

    // Clear validation errors before applying
    setValidationErrors([]);

    // Step 2: Apply changes (will trigger evaluation in store)
    applyModifications(formattedFull);
  }, [applyModifications, fullContent, validate, formatWithPrettier]);

  // Global handler: if user presses Mod+S while the editor is NOT focused,
  // still trigger Apply/format. This makes Ctrl/Cmd+S work even when focus
  // moved outside the editor (e.g., another panel). We avoid double-run by
  // only firing when the editor does not contain the active element.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isModS = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (!isModS) return;
      const view = editorViewRef.current;
      const editorHasFocus = view
        ? view.dom.contains(document.activeElement)
        : false;
      if (editorHasFocus) return; // editor will handle it (or already did)
      e.preventDefault();
      // fire apply (don't await here to keep handler sync)
      void handleApply();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleApply]);

  const handleDiscard = useCallback(() => {
    // Build the wrapped full content the same way the incoming `source`
    // is normalized in the effect above, then update both fullContent
    // (which CodeMirror displays) and editorBody (extracted body).
    const base = source
      ? /^\s*\{/.test(source)
        ? buildEditableCodeBodyContent(extractBody(source))
        : source
      : buildEditableCodeBodyContent(DEFAULT_BODY_CONTENT);
    setFullContent(base);
    try {
      setEditorBody(extractBody(base));
    } catch {
      // ignore extraction failures
    }
    // Clear validation errors when discarding
    setValidationErrors([]);
    setValidationWarnings([]);
  }, [source]);

  const handleReset = useCallback(() => {
    clearOverrides();
    // Immediately reflect the default body in the editor by wrapping
    // it into the editable full content and updating both states.
    const base = buildEditableCodeBodyContent(DEFAULT_BODY_CONTENT);
    setFullContent(base);
    try {
      setEditorBody(extractBody(base));
    } catch {
      // ignore
    }
    // Clear validation errors when resetting
    setValidationErrors([]);
    setValidationWarnings([]);
  }, [clearOverrides]);

  // Simple completion source that offers keys from muiThemeCompletions
  const muiThemeCompleter = useCallback(
    () => (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;
      return { from: word.from, options: muiThemeCompletions };
    },
    []
  );

  return (
    <Stack height="100%">
      <AlertBar
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        validationWarnings={validationWarnings}
        setValidationWarnings={setValidationWarnings}
        error={error}
        handleReset={handleReset}
      />

      <Toolbar
        onApply={handleApply}
        onDiscard={handleDiscard}
        onClear={handleReset}
        hasUnsaved={hasUnsavedModifications}
        hasOverrides={!!hasOverrides}
      />

      <Box
        sx={{
          height: "100%",
          flexGrow: 1,
          minHeight: 0,
          display: "flex",

          // Ensure CodeMirror occupies the available space and uses an
          // internal scroller instead of growing the parent container.
          "& .cm-editor": {
            flexGrow: 1,
            height: "100%",
            minHeight: 0,
            fontSize: "12px",
          },
          "& .cm-content": { pr: 2 },
          "& .cm-scroller": {
            overflowY: "auto",
            maxHeight: "100%",
            height: "100%",
            scrollbarWidth: "thin",
            scrollbarColor: "#000",
          },
        }}
      >
        <CodeMirror
          value={fullContent}
          onChange={handleChange}
          extensions={[
            javascript({ typescript: true }),
            autocompletion({
              override: [muiThemeCompleter()],
              closeOnBlur: true,
              activateOnTyping: true,
            }),
            // Prevent browser/save shortcut when editor has focus by handling Mod-s inside CodeMirror
            keymap.of([
              // Capture Cmd/Ctrl+S and mark handled so browser won't open "Save Page"
              {
                key: "Mod-s",
                run: () => {
                  handleApply();
                  return true;
                },
              },
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...completionKeymap,
              indentWithTab,
            ]),
            // Paste handler: after paste completes, run Prettier (lazy-loaded)
            // to format the full content and dispatch the replacement so
            // CodeMirror preserves selection/undo.
            EditorView.domEventHandlers({
              paste: (_event, view) => {
                // Let the paste happen in the DOM, then format and normalize.
                setTimeout(async () => {
                  try {
                    // view.state.doc contains the full content; format and replace
                    const doc = view.state.doc.toString();
                    const formattedFull = await formatWithPrettier(doc);
                    view.dispatch({
                      changes: {
                        from: 0,
                        to: view.state.doc.length,
                        insert: formattedFull,
                      },
                      userEvent: "input",
                    });
                    try {
                      setFullContent(formattedFull);
                      setEditorBody(extractBody(formattedFull));
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
          ]}
          theme="dark"
          style={{
            width: "100%",
            height: "100%",
            paddingInline: "3px",
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false, // handled via extension above
            rectangularSelection: true,
            highlightSelectionMatches: true,
            searchKeymap: true,
          }}
        />
      </Box>
    </Stack>
  );
}
