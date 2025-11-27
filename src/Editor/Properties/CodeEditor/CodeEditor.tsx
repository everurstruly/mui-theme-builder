import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Typography, Button, Alert, Stack, Box } from "@mui/material";
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
  validateCodeBeforeEvaluation,
  type ValidationError,
} from "../../Design/compiler";

const HEADER_TEMPLATE = `
const theme: ThemeOptions = {`;

const DEFAULT_BODY_CONTENT = `  
  components: {
    // Add component style overrides here
  },
`;

const FOOTER_TEMPLATE = `};`;

// Build full content from body
const buildEditableCodeBodyContent = (body: string) =>
  `${HEADER_TEMPLATE}${body}${FOOTER_TEMPLATE}`;

// Extract body using a regex that allows an optional TypeScript type annotation
// (e.g. `const theme: ThemeOptions = {`) and captures everything up to the closing `};`
const extractBody = (fullContent: string): string => {
  const match = /const\s+theme(?:\s*:\s*[^=]+)?\s*=\s*\{([\s\S]*?)\};/m.exec(
    fullContent
  );
  if (!match || !match[1] || match[1].trim() === "") return DEFAULT_BODY_CONTENT;
  return match[1].replace(/\n\s+$/g, "");
};

export default function CodeEditor() {
  // Use focused hooks instead of monolithic useCodeEditorPanel
  const { source, error, hasOverrides } = useDeveloperToolEdit();
  const { applyModifications, clearOverrides } = useDeveloperToolActions();
  const validate = validateCodeBeforeEvaluation;

  // Track validation errors separately from evaluation errors
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationError[]>(
    []
  );
  // Editor body holds just the inner contents of the theme object
  const [editorBody, setEditorBody] = useState<string>(() =>
    source ? extractBody(source) : DEFAULT_BODY_CONTENT
  );

  // Keep a snapshot of the previous editor body so we can undo the last change
  // if evaluation fails. This mirrors a single undo step.
  const lastEditorBodyRef = useRef<string>(
    source ? extractBody(source) : DEFAULT_BODY_CONTENT
  );

  useEffect(() => {
    lastEditorBodyRef.current = editorBody;
  }, [editorBody]);

  // Track unsaved changes relative to the incoming `source`
  const hasUnsavedModifications = useMemo(() => {
    const current = source ? extractBody(source) : DEFAULT_BODY_CONTENT;
    return editorBody !== current;
  }, [editorBody, source]);

  // Full content shown in the editor
  const fullContent = useMemo(
    () => buildEditableCodeBodyContent(editorBody),
    [editorBody]
  );

  // Keep editorBody in sync when external `source` changes
  useEffect(() => {
    if (!source) {
      setEditorBody(DEFAULT_BODY_CONTENT);
      return;
    }

    // Always use extractBody() to handle both formats correctly:
    // - Full template: "const theme: ThemeOptions = { ... };"
    // - Raw object: "{ ... }"
    const extracted = extractBody(source);
    setEditorBody(extracted);
  }, [source]);

  // Handle edits from CodeMirror. Prevent header/footer edits by checking they remain unchanged.
  const handleChange = useCallback(
    (value: string) => {
      const actual = value.split("\n");

      // Quick sanity: header must match and footer must match (compare trimmed)
      const headerLines = HEADER_TEMPLATE.split("\n");
      for (let i = 0; i < headerLines.length; i++) {
        if ((actual[i] || "").trim() !== (headerLines[i] || "").trim()) {
          return; // reject edits that modify header
        }
      }

      if (
        (actual[actual.length - 1] || "").trim() !== (FOOTER_TEMPLATE || "").trim()
      ) {
        return; // reject footer edits
      }

      // If valid, extract body and update state
      const newBody = extractBody(value);
      // Snapshot the previous body so we can undo a failed apply
      lastEditorBodyRef.current = editorBody;
      setEditorBody(newBody);

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
    const fullContent = buildEditableCodeBodyContent(editorBody);

    // Format using Prettier before validating/applying. If formatting fails,
    // fall back to the raw content. Use lazy-loading formatter.
    let formattedFull = fullContent;
    try {
      formattedFull = await formatWithPrettier(fullContent);
    } catch {
      // If prettier fails, continue with unformatted content.
    }

    // If we have the EditorView, dispatch a single change so CodeMirror keeps
    // selection/undo history. Otherwise fall back to setEditorBody.
    const view = editorViewRef.current;
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: formattedFull },
        userEvent: "input",
      });
      try {
        setEditorBody(extractBody(formattedFull));
      } catch {
        // ignore
      }
    } else {
      try {
        setEditorBody(extractBody(formattedFull));
      } catch {
        // ignore
      }
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
  }, [applyModifications, editorBody, validate, formatWithPrettier]);

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
    setEditorBody(source ? extractBody(source) : DEFAULT_BODY_CONTENT);
    // Clear validation errors when discarding
    setValidationErrors([]);
    setValidationWarnings([]);
  }, [source]);

  const handleReset = useCallback(() => {
    clearOverrides();
    setEditorBody(DEFAULT_BODY_CONTENT);
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
      {/* Show validation errors (pre-evaluation) */}
      {validationErrors.length > 0 && (
        <Alert
          severity="error"
          onClose={() => setValidationErrors([])}
          sx={{
            pl: 1.5,
            py: 1,
          }}
        >
          <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
            Validation Error{validationErrors.length > 1 ? "s" : ""}:
          </Typography>
          {validationErrors.map((err, idx) => (
            <Typography
              key={idx}
              variant="caption"
              component="div"
              sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
            >
              {err.line && err.column ? `Line ${err.line}:${err.column} - ` : ""}
              {err.message}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Show evaluation errors (post-evaluation from store) */}
      {error && !validationErrors.length && (
        <Alert
          severity="error"
          onClose={handleReset}
          sx={{
            pl: 1.5,
            py: 1,
          }}
        >
          <Typography
            variant="caption"
            component="pre"
            sx={{ whiteSpace: "pre-wrap", m: 0, p: 0 }}
          >
            {error}
          </Typography>
        </Alert>
      )}

      {/* Show warnings (non-blocking) */}
      {validationWarnings.length > 0 && !validationErrors.length && (
        <Alert
          severity="warning"
          onClose={() => setValidationWarnings([])}
          sx={{
            pl: 1.5,
            py: 1,
          }}
        >
          <Typography variant="caption" fontWeight={600} display="block" mb={0.5}>
            Warning{validationWarnings.length > 1 ? "s" : ""}:
          </Typography>
          {validationWarnings.map((warn, idx) => (
            <Typography
              key={idx}
              variant="caption"
              component="div"
              sx={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
            >
              {warn.line && warn.column ? `Line ${warn.line}:${warn.column} - ` : ""}
              {warn.message}
            </Typography>
          ))}
        </Alert>
      )}

      <Toolbar
        onApply={handleApply}
        onDiscard={handleDiscard}
        onClear={handleReset}
        hasUnsaved={hasUnsavedModifications}
        hasOverrides={!!hasOverrides}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,

          "& .cm-editor": { height: "100%", fontSize: "12px" },
          "& .cm-content": { pr: 2 }, // fix: improves readability by preventing content being too close to edge
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
                    const full = view.state.doc.toString();
                    const formatted = await formatWithPrettier(full);
                    view.dispatch({
                      changes: {
                        from: 0,
                        to: view.state.doc.length,
                        insert: formatted,
                      },
                      userEvent: "input",
                    });
                    try {
                      setEditorBody(extractBody(formatted));
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
          style={{ height: "100%", paddingInline: "2px" }}
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

function Toolbar({
  onApply,
  onDiscard,
  onClear,
  hasUnsaved,
  hasOverrides,
}: {
  onApply: () => void;
  onDiscard: () => void;
  onClear: () => void;
  hasUnsaved: boolean;
  hasOverrides: boolean;
}) {
  return (
    <Stack
      direction="row"
      px={1.5}
      columnGap={1}
      alignItems="center"
      py={1}
      minHeight={"var(--activity-bar-height)"}
    >
      <Link
        href="https://mui.com/material-ui/guides/building-extensible-themes/"
        fontSize="small"
        sx={{ paddingInlineEnd: 1 }}
      >
        Docs
      </Link>

      <Link
        href="https://mui.com/material-ui/guides/building-extensible-themes/"
        fontSize="small"
        sx={{ paddingInlineEnd: 1 }}
      >
        Tips
      </Link>

      <Button
        variant="contained"
        size="small"
        onClick={onApply}
        disabled={!hasUnsaved}
        sx={{ marginLeft: "auto !important" }}
      >
        Apply
      </Button>

      <Button
        variant="outlined"
        size="small"
        onClick={onDiscard}
        disabled={!hasUnsaved}
      >
        Discard
      </Button>

      <Button
        variant="outlined"
        size="small"
        color="error"
        onClick={onClear}
        disabled={!hasOverrides}
      >
        Reset
      </Button>
    </Stack>
  );
}
