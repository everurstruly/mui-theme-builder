import React, { useMemo } from "react";
import {
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";

type FontFamilyPopoverProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  title: string;
  onClose: () => void;
  onSelect: (fontFamily: string) => void; // already formatted (with fallback)
  onReset?: () => void;
  currentValue?: string; // full font-family string (e.g. 'Roboto, sans-serif')
  disabled?: boolean;
};

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Helvetica",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
];

export default function FontFamilyPopover({
  anchorEl,
  open,
  title,
  onClose,
  onSelect,
  onReset,
  currentValue,
  disabled,
}: FontFamilyPopoverProps) {
  const primary = useMemo(
    () => extractPrimaryFont(currentValue ?? ""),
    [currentValue]
  );

  function handleChoose(font: string) {
    if (disabled) return;
    onSelect(formatFontFamilyWithFallback(font));
    onClose();
  }

  function handleResetClick() {
    if (disabled) return;
    onReset?.();
    onClose();
  }

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { minWidth: 280, p: 1, border: 1, borderColor: "divider", mt: "-5rem" },
        },
      }}
    >
      <Box sx={{ px: 1, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              {title} Font
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
              {primary || "Default"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ fontSize: 36, lineHeight: 1, fontFamily: primary || undefined }}
            >
              Aa
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <List dense disablePadding sx={{ maxHeight: 300, overflowY: "auto", mx: -1 }}>
          {FONT_OPTIONS.map((f) => (
            <ListItemButton
              key={f}
              onClick={() => handleChoose(f)}
              disabled={disabled}
              selected={extractPrimaryFont(currentValue ?? "") === f}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText primary={f} secondary={f} />
            </ListItemButton>
          ))}
        </List>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            borderTop: 1,
            borderTopColor: "divider",
            mt: 1,
            pt: 2,
          }}
        >
          <Button
            size="small"
            color="warning"
            onClick={handleResetClick}
            disabled={disabled}
          >
            Reset
          </Button>

          <Button size="small" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

function formatFontFamilyWithFallback(selectedFont: string) {
  return selectedFont.includes(" ")
    ? `"${selectedFont}", sans-serif`
    : `${selectedFont}, sans-serif`;
}

function extractPrimaryFont(fontFamily: string): string {
  const match = fontFamily.match(/^\s*['"]?([^',"\s][^',"]*)/);
  return match ? match[1].trim() : fontFamily.trim();
}
