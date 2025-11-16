import { Box, ListItemButton, Tooltip } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { useThemeDesignStore, type SerializableValue } from "../Design";
import { useMemo } from "react";
import { AddOutlined, InfoOutline, RemoveOutlined } from "@mui/icons-material";

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
  const setVisualEdit = useThemeDesignStore((s) => s.addVisualToolEdit);
  const removeVisualEdit = useThemeDesignStore((s) => s.removeVisualToolEdit);
  const baseVisualToolEdits = useThemeDesignStore(
    (s) => s.colorSchemeIndependentVisualToolEdits
  );
  const lightMode = useThemeDesignStore((s) => s.light);
  const darkMode = useThemeDesignStore((s) => s.dark);
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);

  // Get the appropriate visual edits based on active color scheme
  const activeVisualToolEdits = useMemo(() => {
    const modeEdits = activeColorScheme === "light" ? lightMode : darkMode;
    return { ...baseVisualToolEdits, ...modeEdits.visualToolEdits };
  }, [baseVisualToolEdits, lightMode, darkMode, activeColorScheme]);

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
        removeVisualEdit(path);
      });
    } else {
      // Apply all edits
      Object.entries(props.edits).forEach(([path, value]) => {
        setVisualEdit(path, value);
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
