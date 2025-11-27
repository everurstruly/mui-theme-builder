import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDebouncyEffect } from "use-debouncy";
import useEditWithDesignerTool from "../../Design/Edit/useEditWithDesignerTool";
import { useEdit } from "../../Design/Edit/useEdit";
import { readableColor } from "polished";
import { setPreviewValue, clearPreviewValue, getPreviewValue } from "../../Design/Edit/previewHub";

type Options = {
  /** How long to debounce auto-applies (ms). Default: 165 */
  debounceMs?: number;
  /** If true, onChange will update local temp only and commit occurs elsewhere. */
  autoApply?: boolean;
};

/**
 * Hook that encapsulates the color-picker editing UX.
 * - Maintains a local `tempColor` for immediate UI feedback
 * - Optionally auto-applies (debounced) temp changes to the visual edit store
 * - Manages popover anchor/ref and exposes convenient handlers for consumers
 */
export default function useColorPickerEdit(path: string, options?: Options) {
  const debounceMs = options?.debounceMs ?? 165;
  const autoApply = options?.autoApply ?? true;

  // -- Source: visual edit store wrapper
  const activeScheme = useEdit((s) => s.activeColorScheme);
  const {
    value,
    resolvedValue,
    setValue,
    reset,
    hasVisualEdit,
    hasCodeOverride,
    isModified,
  } = useEditWithDesignerTool(path, activeScheme);

  // Using module-level preview hub for transient previews (no store writes)
  const previewValue = getPreviewValue(path);

  // -- Local UI state
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const lastAppliedColorRef = useRef<string>("");

  // -- Auto-apply: when user changes tempColor we optionally apply to the store
  // using a debounced effect so rapid drags don't spam the store.
  useDebouncyEffect(
    () => {
      if (!autoApply) return;
      if (tempColor && tempColor !== (value as string)) {
        // Update preview hub (rAF-scheduled notify) instead of mutating main store.
        setPreviewValue(path, tempColor);
        lastAppliedColorRef.current = tempColor;
      }
    },
    debounceMs,
    [tempColor, value, autoApply, path]
  );

  // If the value changed externally (reset / applied from elsewhere), clear
  // the temp buffer so UI reflects the current authoritative value.
  useEffect(() => {
    if (tempColor && (value as string) !== lastAppliedColorRef.current) {
      setTempColor("");
      lastAppliedColorRef.current = value as string;
    }
  }, [value, tempColor]);

  // -- Handlers (stable identities for consumers)
  const openPicker = useCallback(() => {
    if (hasCodeOverride) return; // disabled when code-controlled
    lastAppliedColorRef.current = (value as string) || "";
    setTempColor((value as string) || "");
    setAnchorEl(anchorRef.current);
  }, [hasCodeOverride, value]);

  const closePicker = useCallback(() => setAnchorEl(null), []);

  const onColorChange = useCallback((color: { hex: string }) => {
    // fast local update only
    setTempColor(color.hex);
  }, []);

  const applyTempColorImmediately = useCallback(
    (c?: string) => {
      const toApply = c ?? tempColor;
      if (!toApply) return;
      // Commit to the real store and clear the transient preview for this path.
      setValue(toApply);
      clearPreviewValue(path);
      lastAppliedColorRef.current = toApply;
    },
    [setValue, tempColor, path]
  );

  // -- Derived UI values (memoized)
  const mainColor = useMemo(
    () => String(tempColor || previewValue || value || resolvedValue || "#000000"),
    [tempColor, previewValue, value, resolvedValue]
  );

  const readableColorStr = useMemo(() => readableColor(mainColor), [mainColor]);
  const borderColor = "divider";

  const canResetValue = !!hasVisualEdit || !!hasCodeOverride;
  const isControlledByFunction = !!hasCodeOverride;

  // Return a stable object - consumers can destructure what they need.
  return useMemo(
    () => ({
      // source values
      value,
      resolvedValue,

      // local editing state
      tempColor,
      setTempColor,
      applyTempColorImmediately,

      // popover anchor + controls
      anchorRef,
      anchorEl,
      open: Boolean(anchorEl),
      openPicker,
      closePicker,
      onColorChange,

      // refs
      lastAppliedColorRef,

      // UI helpers
      mainColor,
      readableColor: readableColorStr,
      borderColor,

      // control state
      canResetValue,
      reset,
      isControlledByFunction,
      isModified,

      // low-level setter
      setValue,
    }),
    [
      value,
      resolvedValue,
      tempColor,
      setTempColor,
      applyTempColorImmediately,
      anchorEl,
      openPicker,
      closePicker,
      onColorChange,
      lastAppliedColorRef,
      mainColor,
      readableColorStr,
      borderColor,
      canResetValue,
      reset,
      isControlledByFunction,
      isModified,
      setValue,
    ]
  );
}
