import { Button, ListItem, Typography, Box, Stack, Popover } from "@mui/material";
import { useState, useRef } from "react";
import { Sketch } from "@uiw/react-color";
import { useDebouncyEffect } from "use-debouncy";
import { useThemeValue } from "../../ThemeWorkspace";

type ColorGroupListtOptionProps = {
  name: string;
  path: string;
  resolvedValue: string;
};

export default function ColorGroupListOption(props: ColorGroupListtOptionProps) {
  const {
    value,
    setValue,
    isUserEditted,
    resetToBase,
    shouldBeEditedWithCode: isControlledByFunction,
  } = useThemeValue(props.path);

  const canResetValue = isUserEditted;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const colorBoxRef = useRef<HTMLDivElement>(null);

  // Debounce the color updates - only applies to theme after 200ms of no changes
  useDebouncyEffect(
    () => {
      if (tempColor && tempColor !== value) {
        setValue(tempColor);
      }
    },
    200,
    [tempColor]
  );

  const handleOpenPicker = () => {
    if (!isControlledByFunction) {
      setTempColor(value?.toString() || "#000000");
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
      <Typography
        variant="caption"
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.75,
          cursor: "pointer",
          fontWeight: 400,
          textTransform: "capitalize",
        }}
      >
        {!canResetValue && (
          <Typography
            color="green"
            sx={{
              p: 0.5,
              fontSize: 10,
              lineHeight: 1,
              backgroundColor: "#e0f8e089",
            }}
          >
            Default
          </Typography>
        )}

        {canResetValue && (
          <Button
            color="warning"
            onClick={() => resetToBase()}
            sx={{
              lineHeight: 1,
              fontSize: 10,
              padding: 0.5,
              fontWeight: 400,
              minWidth: "auto",
            }}
          >
            Reset
          </Button>
        )}

        {props.name}
      </Typography>

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
            bgcolor: open ? tempColor : value,
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
            color={tempColor}
            onChange={handleColorChange}
            disableAlpha={false}
          />
        </Popover>
      </Stack>
    </ListItem>
  );
}
