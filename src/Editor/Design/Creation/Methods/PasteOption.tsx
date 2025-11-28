import * as React from "react";
import { Box, Button, TextField, Alert } from "@mui/material";

export default function PasteOption({ onClose }: { onClose: () => void }) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const validate = (text: string) => {
    try {
      JSON.parse(text);
      setError(null);
      return true;
    } catch (e: any) {
      setError(e?.message || String(e));
      return false;
    }
  };

  const handleImport = () => {
    if (!validate(value)) return;
    try {
      const obj = JSON.parse(value);
      // TODO: call store action to import theme options
      console.log("Imported theme options from paste:", obj);
      onClose();
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Paste themeOptions (JSON)"
        placeholder='{"palette": {"mode": "dark"}}'
        multiline
        minRows={6}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error) validate(e.target.value);
        }}
        size="small"
      />

      {error && <Alert severity="error">JSON parse error: {error}</Alert>}

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={handleImport} disabled={!value}>Import</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </Box>
    </Box>
  );
}
