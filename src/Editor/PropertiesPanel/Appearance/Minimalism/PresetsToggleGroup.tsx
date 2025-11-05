import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import presets from "./presets";
import { Divider, ListItemButton, Stack } from "@mui/material";
import { AddOutlined, RemoveOutlined } from "@mui/icons-material";

export default function PresetsToggleGroup() {
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  function isChecked(value: string) {
    return checked.indexOf(value) !== -1;
  }

  return (
    <Stack
      divider={<Divider />}
      sx={{
        px: 0,
        mx: -2.2, // Panel inline-padding
      }}
    >
      {presets.map((preset) => {
        return (
          <ListItemButton
            key={preset.value ?? preset.label}
            onClick={handleToggle(preset.value)}
            sx={{
              pl: isChecked(preset.value) ? 3 : 0.5, // 0.5 (magic number) aligns icons with title
              backgroundColor: isChecked(preset.value)
                ? "action.selected"
                : "inherit",
            }}
          >
            {isChecked(preset.value) ? (
              <RemoveOutlined sx={{ mx: 1 }} />
            ) : (
              <AddOutlined sx={{ mx: 1 }} />
            )}

            <ListItemText
              primary={preset.label}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: "body2.fontSize",
                  },
                },
              }}
            />
          </ListItemButton>
        );
      })}
    </Stack>
  );
}
