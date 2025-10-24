import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

export default function ThemeSelect() {
  const [selectedTheme, setSelectedTheme] = React.useState("google");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <FormControl sx={{ m: 0, width: "100%", maxWidth: "26ch" }} size="small">
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        size="small"
        value={selectedTheme}
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
