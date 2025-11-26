import { Box, ListItem, Popover, Typography } from "@mui/material";
import { Sketch } from "@uiw/react-color";
import { useState, useRef, useEffect } from "react";
import { useCurrentDesign } from "../../../Design/Current/useCurrent";
import { useDebouncyEffect } from "use-debouncy";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useEditWithDesignTool from "../../../Design/Current/useEditWithDesignTool";

export default function ShadeListItem({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  const activeScheme = useCurrentDesign((s) => s.activeColorScheme);
  const {
    value,
    resolvedValue,
    setValue,
    reset: resetValue,
    hasVisualEdit: isCustomized,
    hasCodeOverride: isControlledByFunction,
  } = useEditWithDesignTool(path, activeScheme);

  const canResetValue = isCustomized || isControlledByFunction;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tempColor, setTempColor] = useState<string>("");
  const colorBoxRef = useRef<HTMLDivElement | null>(null);
  const lastAppliedColorRef = useRef<string>("");

  useDebouncyEffect(
    () => {
      if (tempColor && tempColor !== (value as string)) {
        setValue(tempColor);
        lastAppliedColorRef.current = tempColor;
      }
    },
    165,
    [tempColor, value]
  );

  useEffect(() => {
    if (tempColor && (value as string) !== lastAppliedColorRef.current) {
      setTempColor("");
      lastAppliedColorRef.current = value as string;
    }
  }, [value, tempColor]);

  const handleOpenPicker = () => {
    if (!isControlledByFunction) {
      lastAppliedColorRef.current = value as string;
      setTempColor(value as string);
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
            bgcolor: String(tempColor || value || resolvedValue),
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
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Sketch
            color={(tempColor || (value as string)) as string}
            onChange={(c) => setTempColor((c as any).hex ?? (c as any).hex)}
            disableAlpha={false}
          />
        </Popover>
      </Box>
    </ListItem>
  );
}
