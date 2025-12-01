import AlertBar from "./AlertBar";
import CodeMirror from "@uiw/react-codemirror";
import Toolbar from "./Toolbar";
import useDeveloperToolEdit from "../../Design/Current/useDeveloperToolEdit";
import useDeveloperToolActions from "../../Design/Current/useDeveloperEditTools";
import useCodeEditor from "./useCodeEditor";
import { useMemo } from "react";
import { Stack, Paper } from "@mui/material";
import { getEditorExtensions, getEditorBasicSetup } from "./editorExtensions";
import { muiThemeCompletions } from "./muiThemeCompletions";
import { themeCompiler } from "../../Design/compiler";
import { createMuiThemeCompleter } from "./codeEditorExtras";

export default function CodeEditor() {
  // Use focused hooks instead of monolithic useCodeEditorPanel
  const { source, error, hasOverrides } = useDeveloperToolEdit();
  const { applyModifications, clearOverrides } = useDeveloperToolActions();
  const validate = themeCompiler.validateThemeCode;

  const { state, actions, refs } = useCodeEditor({
    source,
    validate,
    applyModifications,
    clearOverrides,
  });

  const { editorFullContent, validationErrors, validationWarnings, hasUnsavedModifications } = state;
  const { onEditorChange, onApply, onDiscard, onReset } = actions;
  const { attachViewPlugin } = refs;

  // Simple completion source that offers keys from muiThemeCompletions
  const muiThemeCompleter = useMemo(() => createMuiThemeCompleter(muiThemeCompletions), []);

  const extensions = useMemo(
    () =>
      getEditorExtensions({
        muiThemeCompleter,
        attachViewPlugin,
        onApply,
        onFormatted: actions.handleFormatted,
      }),
    [muiThemeCompleter, attachViewPlugin, onApply, actions.handleFormatted]
  );

  // Memoize the basic setup options so the object identity is stable
  // across renders and doesn't cause unnecessary re-renders in CodeMirror.
  const basicSetup = useMemo(() => getEditorBasicSetup(), []);

  return (
    <Stack height="100%">
      <AlertBar
        validationErrors={validationErrors}
        setValidationErrors={actions.setValidationErrors}
        validationWarnings={validationWarnings}
        setValidationWarnings={actions.setValidationWarnings}
        error={error}
        handleReset={onReset}
      />

      <Toolbar
        onApply={onApply}
        onDiscard={onDiscard}
        onClear={onReset}
        hasUnsaved={hasUnsavedModifications}
        hasOverrides={!!hasOverrides}
      />

      <Paper
        sx={{
          height: "100%",
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          p: .5,

          // Ensure CodeMirror occupies the available space and uses an
          // internal scroller instead of growing the parent container.
          "& .cm-editor": {
            flexGrow: 1,
            height: "100%",
            minHeight: 0,
            fontSize: "12px",
          },
          "& .cm-content": { pr: 2, py: 2 },
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
          value={editorFullContent}
          onChange={onEditorChange}
          extensions={extensions}
          theme="dark"
          style={{
            width: "100%",
            height: "100%",
          }}
          basicSetup={basicSetup}
        />
      </Paper>
    </Stack>
  );
}
