import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useThemeDesignStore, type TemplateMetadata } from "../../Design";
import { AdsClickOutlined, ShuffleOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useTemplateStore } from "../../Templates/useTemplateStore";
import { serializeThemeOptions } from "../../Design/codeParser";
import DesignColorSchemeToggle from "../DesignColorSchemeToggle";

export default function TemplateOption({ onClose }: { onClose: () => void }) {
  const [displayChangeConfirmation, setDisplayChangeConfirmation] = useState({
    state: false,
    templateId: "",
  });
  const hasUnsavedChanges = useThemeDesignStore((s) => s.hasUnsavedChanges);
  const [shouldKeepUnsavedChanges, setShouldKeepUnsavedChanges] = useState(
    hasUnsavedChanges ? null : true
  );
  const baseThemeMetadata = useThemeDesignStore((s) => s.baseThemeMetadata);
  const setBaseTheme = useThemeDesignStore((s) => s.setBaseTheme);
  const { getAllTemplates, getTemplateById } = useTemplateStore();

  const allTemplates = getAllTemplates();
  const selectedTemplateId = baseThemeMetadata?.sourceTemplateId;

  function cancelChangeOperation() {
    setDisplayChangeConfirmation({ state: false, templateId: "" });
    onClose();
  }

  function discardUnsavedChanges(templateId: string) {
    setDisplayChangeConfirmation({ state: false, templateId: "" });
    setShouldKeepUnsavedChanges(false);

    const template = getTemplateById(templateId);
    if (!template) return;

    const themeCode = serializeThemeOptions(template.themeOptions);
    setBaseTheme(themeCode, { sourceTemplateId: templateId, title: template.label });
  }

  function selectRandom() {
    if (!allTemplates || allTemplates.length === 0) return;

    let candidates = allTemplates.map((t) => t.id);
    if (candidates.length > 1) {
      candidates = candidates.filter((id) => id !== selectedTemplateId);
    }

    const idx = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[idx];
    handleSelectTemplate(chosen);
  }

  const handleSelectTemplate = (templateId: string) => {
    if (shouldKeepUnsavedChanges === null) {
      setDisplayChangeConfirmation({ state: true, templateId });
      return;
    }

    discardUnsavedChanges(templateId);
  };

  return (
    <>
      <Toolbar
        variant="dense"
        sx={{
          justifyContent: "space-between",
          px: "0px !important",
          columnGap: 1,
          mb: 1,
        }}
      >
        <Button size="small" startIcon={<ShuffleOutlined />} onClick={selectRandom}>
          Random
        </Button>

        <DesignColorSchemeToggle />
      </Toolbar>

      <List component={Stack} sx={{ gap: 1 }}>
        {allTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const colorSamples = extractColorSamples(template);

          return (
            <ListItemButton
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              selected={isSelected}
              sx={{
                paddingInline: 2,
                paddingBlock: 2,
                justifyContent: "space-between",
                borderRadius: 3,
                backgroundColor: "background.default",
              }}
            >
              <Stack
                direction="row-reverse"
                alignItems={"center"}
                spacing={0.5}
                sx={{ columnGap: 1 }}
              >
                <Typography variant="body2" textTransform={"capitalize"}>
                  {template.label}
                </Typography>

                <Stack direction="row" spacing={0.2} height={"14px"} pl={0.2}>
                  {colorSamples.map((backgroundColor, index) => {
                    return (
                      <Box
                        key={`${template.id}-${index}`}
                        sx={{
                          height: "100%",
                          aspectRatio: "1 / 1",
                          backgroundColor,
                          borderRadius: 1,
                          border: 1.5,
                          borderColor: "divider",
                        }}
                      />
                    );
                  })}
                </Stack>
              </Stack>

              <AdsClickOutlined
                fontSize="small"
                color={isSelected ? "primary" : "action"}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Dialog
        open={displayChangeConfirmation.state}
        onClose={() => cancelChangeOperation()}
        sx={{ top: "-20%" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">Wait! You've Unsaved Changes</Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ maxWidth: "42ch", py: 1 }}
          >
            Switching templates will override your work unless you choose to keep
            them.
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack
            direction="row"
            spacing={3}
            sx={{ justifyContent: "center", mb: 1 }}
          >
            <Button
              color="warning"
              onClick={() =>
                discardUnsavedChanges(displayChangeConfirmation.templateId)
              }
            >
              Discard all & Switch
            </Button>

            <Button onClick={() => cancelChangeOperation()}>Keep them & Stay</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Extract color samples from a template's ThemeOptions
 * Returns an array of colors to display as preview swatches
 */
function extractColorSamples(template: TemplateMetadata): string[] {
  const themeOptions = template.themeOptions;
  const colors: string[] = [];

  // Try to get colors from colorSchemes.light.palette
  if (
    themeOptions.colorSchemes &&
    typeof themeOptions.colorSchemes === "object" &&
    "light" in themeOptions.colorSchemes &&
    themeOptions.colorSchemes.light &&
    typeof themeOptions.colorSchemes.light === "object" &&
    "palette" in themeOptions.colorSchemes.light
  ) {
    const palette = themeOptions.colorSchemes.light.palette as Record<
      string,
      unknown
    >;

    // Extract main colors from primary, secondary, error, warning, info, success
    const colorKeys = ["primary", "secondary", "error", "warning", "info"] as const;

    for (const key of colorKeys) {
      const color = palette[key];
      if (color && typeof color === "object" && "main" in color) {
        colors.push(color.main as string);
        if (colors.length >= 6) break;
      }
    }
  }

  // If we don't have enough colors, try the old palette format
  if (colors.length < 3 && themeOptions.palette) {
    const palette = themeOptions.palette;
    const colorKeys = ["primary", "secondary", "error"] as const;

    for (const key of colorKeys) {
      const color = palette[key];
      if (color && typeof color === "object" && "main" in color) {
        colors.push(color.main as string);
        if (colors.length >= 6) break;
      }
    }
  }

  // Ensure we have at least some colors (fallback)
  if (colors.length === 0) {
    colors.push("#1976d2", "#dc004e", "#ff9800");
  }

  return colors.slice(0, 6);
}
