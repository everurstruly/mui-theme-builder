import { useCallback, useEffect, useMemo, useRef, useReducer } from "react";
import { EditorView } from "@codemirror/view";
import {
  buildEditorFullFromSource,
  parseFullContent,
  normalizeForComparison,
  formatWithPrettierSafe,
  dispatchReplaceAll,
} from "./codeEditorUtils";
import { createAttachViewPlugin } from "./codeEditorExtras";
import type { ValidationError } from "../../Design/compiler";

type Params = {
  source: string;
  validate: (s: string) => { valid: boolean; errors: ValidationError[]; warnings: ValidationError[] };
  applyModifications: (s: string) => void;
  clearOverrides: () => void;
};

type State = {
  editorFullContent: string;
  editorBody: string;
  validationErrors: ValidationError[];
  validationWarnings: ValidationError[];
};

type Action =
  | { type: "replaceFull"; full: string }
  | { type: "setFull"; full: string }
  | { type: "setBody"; body: string }
  | { type: "setValidation"; errors: ValidationError[]; warnings: ValidationError[] }
  | { type: "setValidationErrors"; errors: ValidationError[] }
  | { type: "setValidationWarnings"; warnings: ValidationError[] }
  | { type: "clearValidation" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "replaceFull": {
      try {
        const [, body] = parseFullContent(action.full);
        return { ...state, editorFullContent: action.full, editorBody: body };
      } catch {
        return { ...state, editorFullContent: action.full };
      }
    }
    case "setFull":
      try {
        const [, body] = parseFullContent(action.full);
        return { ...state, editorFullContent: action.full, editorBody: body };
      } catch {
        return { ...state, editorFullContent: action.full };
      }
    case "setBody":
      return { ...state, editorBody: action.body };
    case "setValidation":
      return { ...state, validationErrors: action.errors, validationWarnings: action.warnings };
    case "setValidationErrors":
      return { ...state, validationErrors: action.errors };
    case "setValidationWarnings":
      return { ...state, validationWarnings: action.warnings };
    case "clearValidation":
      return { ...state, validationErrors: [], validationWarnings: [] };
    default:
      return state;
  }
}

export default function useCodeEditor(params: Params) {
  const { source, validate, applyModifications, clearOverrides } = params;

  const initialFull = buildEditorFullFromSource(source);
  const initialState: State = {
    editorFullContent: initialFull,
    editorBody: parseFullContent(initialFull)[1],
    validationErrors: [],
    validationWarnings: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const editorViewRef = useRef<EditorView | null>(null);
  const lastEditorBodyRef = useRef<string>(state.editorBody);

  useEffect(() => {
    lastEditorBodyRef.current = state.editorBody;
  }, [state.editorBody]);

  // Keep fullContent and editorBody in sync when external `source` changes
  useEffect(() => {
    const base = buildEditorFullFromSource(source);
    try {
      const [full] = parseFullContent(base);
      dispatch({ type: "replaceFull", full });
    } catch {
      dispatch({ type: "setFull", full: base });
    }
  }, [source]);

  const hasUnsavedModifications = useMemo(() => {
    const sourceFull = buildEditorFullFromSource(source);
    return normalizeForComparison(state.editorFullContent) !== normalizeForComparison(sourceFull);
  }, [state.editorFullContent, source]);

  const onEditorChange = useCallback(
    (value: string) => {
      lastEditorBodyRef.current = state.editorBody;
      dispatch({ type: "setFull", full: value });
      dispatch({ type: "clearValidation" });
    },
    [state.editorBody]
  );

  const onApply = useCallback(async () => {
    const currentFull = state.editorFullContent;
    const formattedFull = await formatWithPrettierSafe(currentFull);
    dispatchReplaceAll(editorViewRef.current, formattedFull);
    try {
      const [full] = parseFullContent(formattedFull);
      dispatch({ type: "replaceFull", full });
    } catch {
      // ignore
    }

    const validationResult = validate(formattedFull);
    if (!validationResult.valid) {
      dispatch({ type: "setValidation", errors: validationResult.errors, warnings: validationResult.warnings });
      return;
    }

    if (validationResult.warnings.length > 0) dispatch({ type: "setValidation", errors: [], warnings: validationResult.warnings });
    else dispatch({ type: "clearValidation" });

    applyModifications(formattedFull);
  }, [state.editorFullContent, validate, applyModifications]);

  const onDiscard = useCallback(() => {
    const base = buildEditorFullFromSource(source);
    dispatch({ type: "replaceFull", full: base });
    dispatch({ type: "clearValidation" });
  }, [source]);

  const onReset = useCallback(() => {
    clearOverrides();
    const base = buildEditorFullFromSource();
    dispatch({ type: "replaceFull", full: base });
    dispatch({ type: "clearValidation" });
  }, [clearOverrides]);

  const attachViewPlugin = useMemo(() => createAttachViewPlugin(editorViewRef), [editorViewRef]);

  const actions = useMemo(
    () => ({
      onEditorChange,
      onApply,
      onDiscard,
      onReset,
      handleFormatted: (formattedFull: string) => {
        dispatch({ type: "replaceFull", full: formattedFull });
      },
      setValidationErrors: (errors: ValidationError[]) => dispatch({ type: "setValidationErrors", errors }),
      setValidationWarnings: (warnings: ValidationError[]) => dispatch({ type: "setValidationWarnings", warnings }),
    }),
    [onEditorChange, onApply, onDiscard, onReset]
  );

  return {
    state: {
      editorFullContent: state.editorFullContent,
      editorBody: state.editorBody,
      validationErrors: state.validationErrors,
      validationWarnings: state.validationWarnings,
      hasUnsavedModifications,
    },
    actions,
    refs: {
      editorViewRef,
      lastEditorBodyRef,
      attachViewPlugin,
    },
  };
}
