import { ListItem, Typography, Box, Stack, Popover } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Sketch } from "@uiw/react-color";
import { useDebouncyEffect } from "use-debouncy";
import useResolvedPaletteShade from "./useResolvedPaletteShade";
import OptionListItemResetButton from "../OptionListItemResetButton";

type ColorOptionGroupItemProps = {
  name: string;
  path: string;
};

export default function ColorOptionGroupItem(props: ColorOptionGroupItemProps) {
  const {
    displayValue,
    isResolved,
    setValue,
    reset: resetValue,
    hasVisualEdit: isCustomized,
    hasCodeOverride: isControlledByFunction,
  } = useResolvedPaletteShade(props.path, props.name as string);

  // Show Reset button only when the user has actually customized this value or it's code-controlled.
  const canResetValue = isCustomized || isControlledByFunction;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const colorBoxRef = useRef<HTMLDivElement>(null);
  const lastAppliedColorRef = useRef<string>("");

  // displayValue, resolvedShadeValue and isResolved are provided by the hook

  // Debounce the color updates - only applies to theme after 200ms of no changes
  useDebouncyEffect(
    () => {
        if (tempColor && tempColor !== (displayValue as string)) {
          setValue(tempColor);
          lastAppliedColorRef.current = tempColor;
        }
    },
    165,
    [tempColor, displayValue]
  );

  // Clear tempColor when value changes externally (e.g., from reset).
  // Move into an effect so we don't call setState during render (fixes Hooks order errors).
  useEffect(() => {
    if (tempColor && (displayValue as string) !== lastAppliedColorRef.current) {
      setTempColor("");
      lastAppliedColorRef.current = displayValue as string;
    }
  }, [displayValue, tempColor]);

  const handleOpenPicker = () => {
    if (!isControlledByFunction) {
      // Record the currently displayed value so the picker doesn't immediately
      // clear when opened and so it initializes to the visible swatch color.
      lastAppliedColorRef.current = displayValue as string;
      setTempColor(displayValue as string);
      setAnchorEl(colorBoxRef.current);
    }
  };

  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color: { hex: string }) => {
    // Just update temp color, debounce hook will handle applying it
    setTempColor(color.hex);
  };

  const open = Boolean(anchorEl);

  return (
    <ListItem
      sx={{
        width: "auto",
        paddingInline: 0,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={resetValue}
          initStateLabel={isResolved ? "Auto" : "Default"}
          labelColor={isResolved ? "resolved" : undefined}
        />

        <Typography
          variant="caption"
          sx={{
            textTransform: "capitalize",
          }}
        >
          {props.name}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        marginInlineStart="auto"
        alignItems="center"
        spacing={1}
      >
        <Box
          ref={colorBoxRef}
          onClick={handleOpenPicker}
          sx={{
            width: 32,
            height: 20,
            bgcolor: (tempColor || (displayValue as string)) as string,
            borderRadius: 1,
            border: 2,
            borderColor: "divider",
            cursor: isControlledByFunction ? "not-allowed" : "pointer",
            display: "inline-block",
            opacity: isControlledByFunction ? 0.5 : 1,
          }}
        />

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePicker}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Sketch
            color={(tempColor || (displayValue as string)) as string}
            onChange={handleColorChange}
            disableAlpha={false}
          />
        </Popover>
      </Stack>
    </ListItem>
  );
}
