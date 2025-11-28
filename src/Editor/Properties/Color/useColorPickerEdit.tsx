import { useDebouncyEffect } from "use-debouncy";
import useDesignerToolEdit from "../../Design/Edit/useDesignerToolEdit";
import { useEdit } from "../../Design/Edit/useEdit";
import { useRef, useState, useMemo, useCallback } from "react";

type Options = {
  debounceMs?: number;
  
  /** If false, onChange will not sync the color picking widget/interface with the actual source value. */
  autoApply?: boolean;
};

export default function useColorPickerEdit(path: string, options?: Options) {
  const debounceMs = options?.debounceMs ?? 140;
  const autoSyncTransientWithValue = options?.autoApply ?? true;
  const activeScheme = useEdit((s) => s.activeColorScheme);
  const {
    value,
    setValue,
    resolvedValue,
    canReset,
    reset,
    hasCodeOverride,
    isModified,
  } = useDesignerToolEdit(path, activeScheme);

  // -- Local UI state
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [transientColor, seTtransientColor] = useState(value);

  const color = resolvedValue || "#000";
  const borderColor = "divider";
  const readableForegroundColor = generateReadableColor(color);
  const hasDelegatedControl = !!hasCodeOverride;

  const openPicker = useCallback(() => {
    if (hasCodeOverride) {
      return; // disabled when code-controlled
    }

    seTtransientColor(value);
    setAnchorEl(anchorRef.current);
  }, [hasCodeOverride, value]);

  const closePicker = useCallback(() => {
    if (
      autoSyncTransientWithValue &&
      transientColor &&
      transientColor !== (value as string)
    ) {
      setValue(transientColor);
    }

    setAnchorEl(null);
  }, [autoSyncTransientWithValue, transientColor, value, setValue]);

  const onColorChange = useCallback((color: { hex: string }) => {
    seTtransientColor(color.hex);
  }, []);

  useDebouncyEffect(
    () => {
      if (!autoSyncTransientWithValue) {
        return;
      }

      // nothing to do if tempColor already equals the current store value
      if (!transientColor || transientColor === value) {
        return;
      }

      setValue(transientColor);
    },
    debounceMs,
    [transientColor]
  );

  return useMemo(
    () => ({
      // source values
      color,
      readableForegroundColor,
      borderColor,

      // popover anchor + controls
      anchorRef,
      anchorEl,
      open: Boolean(anchorEl),
      openPicker,
      closePicker,
      onColorChange,

      // control state
      canReset,
      reset,
      hasDelegatedControl,
      isModified,
    }),
    [
      color,
      anchorEl,
      openPicker,
      closePicker,
      onColorChange,
      readableForegroundColor,
      borderColor,
      canReset,
      reset,
      hasDelegatedControl,
      isModified,
    ]
  );
}

function generateReadableColor(bgColor: string): string {
  // Simple algorithm to determine readable color (black or white) based on background color brightness
  // This can be replaced with a more sophisticated approach if needed
  const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "#000000" : "#FFFFFF";
}
