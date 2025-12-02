import * as React from "react";
import { Box, Button, Typography, Chip } from "@mui/material";

export default function BlankOption({ onClose }: { onClose: () => void }) {
  const [preset, setPreset] = React.useState<"light" | "dark" | null>("light");

  const handleCreate = () => {
    // TODO: call store to create an empty design with the chosen preset
    console.log("Create blank design with preset:", preset);
    onClose();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body2">Create a blank design from scratch. Choose an initial preset:</Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Chip label="Light" color={preset === "light" ? "primary" : "default"} onClick={() => setPreset("light")} clickable />
        <Chip label="Dark" color={preset === "dark" ? "primary" : "default"} onClick={() => setPreset("dark")} clickable />
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={handleCreate}>Create blank</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </Box>
    </Box>
  );
}
