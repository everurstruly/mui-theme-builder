import React from "react";
import {
  ListItem,
  Stack,
  Typography,
  Button,
  ButtonGroup,
  Box,
  alpha,
} from "@mui/material";
import type { SavedToStorageDesign } from "./types";

type Props = {
  design: SavedToStorageDesign;
  onLoad: (id: string) => void;
  onRemove: (e: React.MouseEvent, id: string) => void;
  onDuplicate?: (id: string) => void;
};

export default function StoredDesignListItem({
  design,
  onLoad,
  onRemove,
  onDuplicate,
}: Props) {
  return (
    <ListItem
      sx={{
        flexDirection: "column",
        paddingInline: 1.5,
        paddingBlockEnd: 1.5,
        paddingBlockStart: 2,
        marginBottom: 3,
        rowGap: 2,
        borderRadius: 3,
        justifyContent: "space-between",
        backgroundColor: getCardBackground(design),
        border: 1,
        borderColor: getCardBorder(design),
      }}
    >
      <Stack spacing={0.5} alignItems={"center"}>
        <Typography variant="subtitle2" textTransform={"capitalize"}>
          {design.title}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {getPaletteColors(design).map((backgroundColor, idx) => (
            <Box
              key={`${design.id}-swatch-${idx}`}
              sx={{
                width: 18,
                height: 18,
                backgroundColor,
                borderRadius: 0.5,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          ))}
        </Stack>

        <Typography variant="caption" color="textSecondary">
          {new Date(design.createdAt).toLocaleString()}
        </Typography>
      </Stack>

      <ButtonGroup fullWidth color="inherit">
        <Button
          sx={{ "&:hover": { color: "error.main" } }}
          onClick={(e) => onRemove(e, design.id)}
        >
          Delete
        </Button>

        <Button
          sx={{ "&:hover": { color: "primary.main" } }}
          onClick={() => onDuplicate?.(design.id)}
        >
          Duplicate
        </Button>

        <Button
          sx={{ "&:hover": { color: "primary.main" } }}
          onClick={() => onLoad(design.id)}
        >
          Edit
        </Button>
      </ButtonGroup>
    </ListItem>
  );
}

function getPaletteColors(design: SavedToStorageDesign): string[] {
  try {
    const raw = design.themeOptionsCode;
    if (!raw) return ["#1976d2", "#dc004e", "#ff9800"];

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return ["#1976d2", "#dc004e", "#ff9800"];
    }

    const defaultScheme = "light";
    const colors: string[] = [];

    if (
      parsed?.colorSchemes &&
      parsed.colorSchemes[defaultScheme] &&
      parsed.colorSchemes[defaultScheme].palette
    ) {
      const palette = parsed.colorSchemes[defaultScheme].palette;
      const keys = ["primary", "secondary", "error", "warning", "info"];
      for (const k of keys) {
        const c = palette[k];
        if (c && typeof c === "object" && "main" in c) {
          colors.push(c.main);
          if (colors.length >= 6) break;
        }
      }
    }

    if (colors.length < 3 && parsed?.palette) {
      const palette = parsed.palette;
      const keys = ["primary", "secondary", "error"];
      for (const k of keys) {
        const c = palette[k];
        if (c && typeof c === "object" && "main" in c) {
          colors.push(c.main);
          if (colors.length >= 6) break;
        }
      }
    }

    if (colors.length === 0) return ["#1976d2", "#dc004e", "#ff9800"];
    return colors.slice(0, 6);
  } catch {
    return ["#1976d2", "#dc004e", "#ff9800"];
  }
}

function getPrimarySecondary(design: SavedToStorageDesign) {
  try {
    const raw = design.themeOptionsCode;
    if (!raw) return { primary: "#1976d2", secondary: "#9e9e9e" };
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { primary: "#1976d2", secondary: "#9e9e9e" };
    }

    const defaultScheme = "light";
    let primary: string | undefined;
    let secondary: string | undefined;

    if (parsed?.colorSchemes && parsed.colorSchemes[defaultScheme]?.palette) {
      const palette = parsed.colorSchemes[defaultScheme].palette;
      primary = palette?.primary?.main;
      secondary = palette?.secondary?.main;
    }

    if (!primary && parsed?.palette) {
      primary = parsed.palette?.primary?.main;
    }
    if (!secondary && parsed?.palette) {
      secondary = parsed.palette?.secondary?.main;
    }

    return {
      primary: primary || "#1976d2",
      secondary: secondary || "#9e9e9e",
    };
  } catch {
    return { primary: undefined, secondary: undefined };
  }
}

function getCardBackground(design: SavedToStorageDesign) {
  const { primary } = getPrimarySecondary(design);
  if (primary) return alpha(primary, 0.05);
}

function getCardBorder(design: SavedToStorageDesign) {
  const { secondary } = getPrimarySecondary(design);
  if (secondary) return alpha(secondary, 0.12);
}
