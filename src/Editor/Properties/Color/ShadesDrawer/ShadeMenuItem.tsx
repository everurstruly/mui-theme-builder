import { useState, useRef, useEffect } from "react";
import { Box, ListItem, Typography } from "@mui/material";
import { useDebouncyEffect } from "use-debouncy";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useThemeEdit from "../../../Design/Edit/useThemeEdit";
import ColorPickerPopover from "../ColorPickerPopover";

type ShadesListItemProps = {
  title: string;
  path: string;
};

export default function ShadeListItem({ title, path }: ShadesListItemProps) {
  const {
    value,
    userEdit,
    setValue,
    reset: resetValue,
    isCodeControlled,
  } = useThemeEdit(path);

  const canResetValue = !!userEdit || !!isCodeControlled;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [transientColor, setTransientColor] = useState<string>("");
  const colorBoxRef = useRef<HTMLDivElement | null>(null);
  const lastAppliedColorRef = useRef<string>("");

  // Only debounce on the local temp color changes. Avoid re-running the
  // debounced setter when `value` (the authoritative theme value) changes —
  // that case is handled by the sync effect below which clears `tempColor`.
  const isDraggingRef = useRef(false);

  useDebouncyEffect(
    () => {
      if (transientColor && transientColor !== (value as string)) {
        // Skip committing while the user is actively dragging; we'll commit
        // on pointerup below to avoid flooding the store with updates.
        if (isDraggingRef.current) return;

        setValue(transientColor);
        lastAppliedColorRef.current = transientColor;
      }
    },
    165,
    [transientColor]
  );

  useEffect(() => {
    if (transientColor && (value as string) !== lastAppliedColorRef.current) {
      setTransientColor("");
      lastAppliedColorRef.current = value as string;
    }
  }, [value, transientColor]);

  // Track pointer activity inside the popover and commit once on pointerup
  useEffect(() => {
    if (!anchorEl) return;

    const onPointerDown = () => {
      // mark dragging started
      isDraggingRef.current = true;
    };

    const onPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        // commit the latest tempColor immediately on pointer release
        if (transientColor && transientColor !== (value as string)) {
          setValue(transientColor);
          lastAppliedColorRef.current = transientColor;
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

  const handleOpenPicker = () => {
    if (!isCodeControlled) {
      lastAppliedColorRef.current = value as string;
      setTransientColor(value as string);
      setAnchorEl(colorBoxRef.current);
    }
  };

  const handleClosePicker = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  return (
    <ListItem sx={{ display: "flex", alignItems: "center", gap: 1, px: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={resetValue}
          label={"Reset"}
        />
        <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          ref={colorBoxRef}
          onClick={handleOpenPicker}
          sx={{
            width: 32,
            height: 20,
            bgcolor: String(transientColor || value || ""),
            borderRadius: 1,
            border: 2,
            borderColor: "divider",
            cursor: isCodeControlled ? "not-allowed" : "pointer",
            display: "inline-block",
            opacity: isCodeControlled ? 0.5 : 1,
          }}
        />

        <ColorPickerPopover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePicker}
          color={(transientColor || (value as string)) as string}
          onChange={(c) => setTransientColor((c as any).hex ?? (c as any).hex)}
        />
      </Box>
    </ListItem>
  );
}
