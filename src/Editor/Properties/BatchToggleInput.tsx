import { ListItemButton, Switch, Tooltip } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import { useThemeDesignStore, type SerializableValue } from "../Design";
import { useMemo } from "react";
import { InfoOutline } from "@mui/icons-material";

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
  const setVisualEdit = useThemeDesignStore((s) => s.addDesignToolEdit);
  const removeVisualEdit = useThemeDesignStore((s) => s.removeDesignToolEdit);
  const baseVisualEdits = useThemeDesignStore((s) => s.colorSchemeIndependentDesignToolEdits);
  const lightMode = useThemeDesignStore((s) => s.light);
  const darkMode = useThemeDesignStore((s) => s.dark);
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme);

  // Get the appropriate visual edits based on active color scheme
  const activeVisualEdits = useMemo(() => {
    const modeEdits = activeColorScheme === "light" ? lightMode : darkMode;
    return { ...baseVisualEdits, ...modeEdits.designToolEdits };
  }, [baseVisualEdits, lightMode, darkMode, activeColorScheme]);

  // Check if all edits are currently applied
  const isEnabled = useMemo(() => {
    return Object.entries(props.edits).every(([path, expectedValue]) => {
      const currentValue = activeVisualEdits[path];
      return currentValue === expectedValue;
    });
  }, [props.edits, activeVisualEdits]);

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
        px: 0,
        backgroundColor: isEnabled ? "action.selected" : "inherit",
      }}
    >
      <Switch
        size="small"
        checked={isEnabled}
        disableRipple
        sx={{ pointerEvents: "none" }}
      />

      <ListItemText
        primary={props.label}
        slotProps={{
          primary: {
            sx: {
              fontSize: "body2.fontSize",
            },
          },
        }}
      />

      <Tooltip title={props.description} placement="left-start">
        <InfoOutline fontSize="small" sx={{ mx: 0.5 }} />
      </Tooltip>
    </ListItemButton>
  );
}
