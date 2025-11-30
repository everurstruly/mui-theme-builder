import { useDebouncyEffect } from "use-debouncy";
import useThemeEdit from "../../Design/Edit/useEditProperty";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import generateReadableColorShade from "../../../utils/generateReadableColorShade";

type Options = {
  debounceMs?: number;

  /** If false, onChange will not sync the color picking widget/interface with the actual source value. */
  autoApply?: boolean;
};

export type ColorEditResult = {
  color: string;
  previewColor: string;
  previewReadableForegroundColor: string;
  readableForegroundColor: string;
  borderColor: string;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  anchorEl: HTMLElement | null;
  open: boolean;
  openPicker: () => void;
  closePicker: () => void;
  onColorChange: (c: any) => void;
  canReset: boolean;
  reset: () => void;
  hasDelegatedControl: boolean;
  isModified: boolean;
};

export default function useColorEdit(
  path: string,
  options?: Options
): ColorEditResult {
  const debounceMs = options?.debounceMs ?? 140;
  const autoSyncTransientWithValue = options?.autoApply ?? true;

  const { value, userEdit, isCodeControlled, isModified, setValue, reset } =
    useThemeEdit(path as string);

  const canReset = !!userEdit || !!isCodeControlled;

  // -- Local UI state
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [transientColor, setTransientColor] = useState(value);
  const isDraggingRef = useRef(false);

  // Normalize authoritative value to a safe color string. If the store value
  // is not a string we fall back to black to avoid passing invalid values
  // into color helpers or MUI `sx` props.
  const color = typeof value === "string" && value ? value : "#000";
  const borderColor = "divider";
  const readableForegroundColor = generateReadableColorShade(color);
  // previewColor reflects the transient color only while the picker popover is open.
  // This prevents the preview card from permanently showing a transient value
  // when the popover is closed (for example after a reset). When the popover
  // is closed, the effective `color` (from the theme/store) is shown.
  const previewColor =
    anchorEl && typeof transientColor === "string" && transientColor
      ? transientColor
      : color;
  const previewReadableForegroundColor = generateReadableColorShade(previewColor);
  const hasDelegatedControl = !!isCodeControlled;

  const openPicker = useCallback(() => {
    if (isCodeControlled) {
      return; // disabled when code-controlled
    }

    setTransientColor(value);
    setAnchorEl(anchorRef.current);
  }, [isCodeControlled, value]);

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

  const onColorChange = useCallback((c: any) => {
    const hex = c?.hex ?? c;
    if (typeof hex === "string") setTransientColor(hex);
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

      // Don't commit to the global store while the user is actively dragging.
      if (isDraggingRef.current) return;

      if (typeof transientColor === "string" && transientColor) {
        setValue(transientColor);
      }
    },
    debounceMs,
    [transientColor]
  );

  // When the popover is open, track pointer activity so we can avoid
  // committing on every move. Commit once on pointerup for best
  // responsiveness.
  useEffect(() => {
    if (!anchorEl) return;

    const onPointerDown = () => {
      isDraggingRef.current = true;
    };

    const onPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (transientColor && transientColor !== value) {
          setValue(transientColor);
        }
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [anchorEl, transientColor, value, setValue]);

  return useMemo(
    () => ({
      // source values
      color,
      previewColor,
      previewReadableForegroundColor,
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
      previewColor,
      previewReadableForegroundColor,
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

// use generateReadableColorShade from utils to derive readable foreground colors
