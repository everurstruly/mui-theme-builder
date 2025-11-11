import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Typography, Button, Alert, Stack, Box } from "@mui/material";
import { useCodeEditorPanel } from "../../ThemeDesign";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { completionKeymap } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import { defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
import { searchKeymap } from "@codemirror/search";
import { muiThemeCompletions } from "./muiThemeCompletions";

const HEADER_TEMPLATE = `
// MUI Theme Options configuration

const theme: ThemeOptions = {`;

const DEFAULT_BODY_CONTENT = `  
  palette: {
    mode: 'light',
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
  const { source, error, hasOverrides, applyChanges, clearOverrides } =
    useCodeEditorPanel();

  // Editor body holds just the inner contents of the theme object
  const [editorBody, setEditorBody] = useState<string>(() =>
    source ? extractBody(source) : DEFAULT_BODY_CONTENT
  );

  // Track unsaved changes relative to the incoming `source`
  const hasUnsavedChanges = useMemo(() => {
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
    setEditorBody(source ? extractBody(source) : DEFAULT_BODY_CONTENT);
  }, [source]);

  // Handle edits from CodeMirror. Prevent header/footer edits by checking they remain unchanged.
  const handleChange = useCallback((value: string) => {
    const actual = value.split("\n");

    // Quick sanity: header must match and footer must match (compare trimmed)
    const headerLines = HEADER_TEMPLATE.split("\n");
    for (let i = 0; i < headerLines.length; i++) {
      if ((actual[i] || "").trim() !== (headerLines[i] || "").trim()) return; // reject edits that modify header
    }
    if ((actual[actual.length - 1] || "").trim() !== (FOOTER_TEMPLATE || "").trim())
      return; // reject footer edits

    // If valid, extract body and update state
    const newBody = extractBody(value);
    setEditorBody(newBody);
  }, []);

  // Simple completion source that offers keys from muiThemeCompletions
  const muiThemeCompleter = useCallback(
    () => (context: CompletionContext) => {
      const word = context.matchBefore(/\w*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;
      return { from: word.from, options: muiThemeCompletions };
    },
    []
  );

  const handleApply = useCallback(() => {
    // The editor shows the full template (header + body + footer) for UX,
    // but the evaluator expects a plain object literal. Send only the inner
    // object literal (the `editorBody` wrapped in braces) to avoid sending
    // the template/comment/header lines.
    const objectLiteral = `{${editorBody}\n}`;
    applyChanges(objectLiteral);
  }, [applyChanges, editorBody]);

  const handleDiscard = useCallback(() => {
    setEditorBody(source ? extractBody(source) : DEFAULT_BODY_CONTENT);
  }, [source]);

  const handleClear = useCallback(() => {
    clearOverrides();
    setEditorBody(DEFAULT_BODY_CONTENT);
  }, [clearOverrides]);

  return (
    <Stack height="100%">
      {error && (
        <Alert severity="error" onClose={handleClear}>
          <Typography
            variant="caption"
            component="pre"
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {error}
          </Typography>
        </Alert>
      )}

      <Toolbar
        onApply={handleApply}
        onDiscard={handleDiscard}
        onClear={handleClear}
        hasUnsaved={hasUnsavedChanges}
        hasOverrides={!!hasOverrides}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,

          "& .cm-editor": { height: "100%", fontSize: "13px" },
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
              { key: "Mod-s", run: () => true },
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...completionKeymap,
              indentWithTab,
            ]),
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
      columnGap={1.5}
      alignItems="center"
      py={1.5}
      minHeight={"var(--activity-bar-height)"}
    >
      <Link
        href="https://mui.com/material-ui/guides/building-extensible-themes/"
        fontSize="small"
      >
        Docs
      </Link>

      <Link
        href="https://mui.com/material-ui/guides/building-extensible-themes/"
        fontSize="small"
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
        Clear All
      </Button>
    </Stack>
  );
}
