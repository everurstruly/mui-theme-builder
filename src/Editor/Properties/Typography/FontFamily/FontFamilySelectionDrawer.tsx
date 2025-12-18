import { useMemo } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { Drawer } from "../../Drawer";
import { useFontFamilyDrawerStore } from "./useFontFamilyDrawerStore";

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

export default function FontFamilySelectionDrawer() {
  const open = useFontFamilyDrawerStore((s) => s.open);
  const title = useFontFamilyDrawerStore((s) => s.title);
  const currentValue = useFontFamilyDrawerStore((s) => s.currentValue);
  const onSelect = useFontFamilyDrawerStore((s) => s.onSelect);
  const onReset = useFontFamilyDrawerStore((s) => s.onReset);
  const close = useFontFamilyDrawerStore((s) => s.close);

  const primary = useMemo(
    () => extractPrimaryFont(currentValue ?? ""),
    [currentValue]
  );

  function handleChoose(font: string) {
    onSelect?.(formatFontFamilyWithFallback(font));
    close();
  }

  function handleResetClick() {
    onReset?.();
    close();
  }

  return (
    <Drawer
      open={open}
      onClose={close}
      // title={`${title} Font`}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1">{title} Font Family</Typography>
          <Typography variant="caption" color="text.secondary">
            Current Selection
          </Typography>
          <Typography sx={{ lineHeight: 1 }}>{primary || "Default"}</Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{ fontSize: 48, lineHeight: 1, fontFamily: primary || undefined }}
          >
            Aa
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          overflow: "auto",
          px: 2,
          flex: 1,
          scrollbarWidth: "thin",
        }}
      >
        <List dense disablePadding>
          {FONT_OPTIONS.map((f) => (
            <ListItemButton
              key={f}
              onClick={() => handleChoose(f)}
              selected={extractPrimaryFont(currentValue ?? "") === f}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText
                primary={f}
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: formatFontFamilyWithFallback(f) }}
                  >
                    The quick brown fox jumps
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          borderTopColor: "divider",
          py: 2,
          px: 2,
        }}
      >
        <Button size="small" color="warning" onClick={handleResetClick}>
          Reset
        </Button>

        <Button size="small" color="error" onClick={close}>
          Close
        </Button>
      </Box>
    </Drawer>
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
