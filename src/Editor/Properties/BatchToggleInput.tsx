import { Box, ListItemButton, Tooltip } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { useEditWithDesignerTools } from "../Design/Edit/useEditWithDesignerTools";
import { useMemo } from "react";
import { AddOutlined, InfoOutline, RemoveOutlined } from "@mui/icons-material";
import useEdit from "../Design/Edit/useEdit";
import type { SerializableValue } from "../Design/compiler";

export type BatchToggleInputProps = {
  label: string;
  /** Map of theme paths to their values when enabled */
  edits: Record<string, SerializableValue>;
  /** Optional description for tooltip/help text */
  description?: string;
};

/**
 * A toggle input that applies multiple visual edits as a batch.
 * Shows as a single switch but sets/removes multiple theme paths.
 *
 * Enabled state is determined by checking if ALL paths match their expected values.
 */
export default function BatchToggleInput(props: BatchToggleInputProps) {
  const { addGlobalVisualEdit, removeGlobalVisualEdit } = useEditWithDesignerTools();
  const baseVisualToolEdits = useEdit(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  // Narrow selectors: subscribe only to visualToolEdits maps, not full scheme objects
  const lightModeVisual = useEdit((s) => s.colorSchemes.light?.visualToolEdits);
  const darkModeVisual = useEdit((s) => s.colorSchemes.dark?.visualToolEdits);
  const activeColorScheme = useEdit((s) => s.activeColorScheme);

  // Get the appropriate visual edits based on active color scheme
  const activeVisualToolEdits = useMemo(() => {
    const modeEdits = activeColorScheme === "light" ? lightModeVisual || {} : darkModeVisual || {};
    return { ...baseVisualToolEdits, ...modeEdits };
  }, [baseVisualToolEdits, lightModeVisual, darkModeVisual, activeColorScheme]);

  // Check if all edits are currently applied
  const isEnabled = useMemo(() => {
    return Object.entries(props.edits).every(([path, expectedValue]) => {
      const currentValue = activeVisualToolEdits[path];
      return currentValue === expectedValue;
    });
  }, [props.edits, activeVisualToolEdits]);

  const handleToggle = () => {
    if (isEnabled) {
      // Remove all edits
      Object.keys(props.edits).forEach((path) => {
        removeGlobalVisualEdit(path);
      });
    } else {
      // Apply all edits
      Object.entries(props.edits).forEach(([path, value]) => {
        addGlobalVisualEdit(path, value);
      });
    }
  };

  return (
    <ListItemButton
      onClick={handleToggle}
      sx={{
        px: 2,
        columnGap: 1.5,
        color: isEnabled ? "text.secondary" : "text.primary",
        backgroundColor: isEnabled ? "action.disabledBackgrond" : "action",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginInlineStart: isEnabled ? 2.5 : 0,
        }}
      >
        {isEnabled ? (
          <RemoveOutlined fontSize="small" />
        ) : (
          <AddOutlined fontSize="small" />
        )}
      </Box>

      <ListItemText
        primary={props.label}
        slotProps={{
          primary: {
            sx: {
              fontSize: "caption.fontSize",
            },
          },
        }}
      />

      <Tooltip title={props.description} placement="left-start">
        <InfoOutline fontSize="small" sx={{ mx: 0.5, color: "action.disabled" }} />
      </Tooltip>
    </ListItemButton>
  );
}
