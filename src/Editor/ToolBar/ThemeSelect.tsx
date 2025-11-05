import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { FolderOutlined } from "@mui/icons-material";

// const label = "Theme";

export default function ThemeSelect() {
  const [selectedTheme, setSelectedTheme] = React.useState("google");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <FormControl
      sx={{ m: 0, width: "100%", maxWidth: { lg: "24ch" } }}
      size="small"
      variant="outlined"
    >
      {/* <InputLabel id="demo-select-small-label">{label}</InputLabel> */}
      <Select
        // label={label}
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={selectedTheme}
        startAdornment={
          <FolderOutlined sx={{ marginRight: 1.5 }} color="action" />
        }
        onChange={handleChange}
        sx={{
          borderRadius: 2,
          fontSize: ".875rem",
        }}
      >
        <MenuItem value="google">Google</MenuItem>
        <MenuItem value="material">Material Design</MenuItem>
        <MenuItem value="ios">IOS</MenuItem>
      </Select>
    </FormControl>
  );
}
