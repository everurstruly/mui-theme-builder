import * as React from "react";
import { Box, Button, TextField, Alert, CircularProgress } from "@mui/material";

export default function LinkOption({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const text = await res.text();
      const parsed = JSON.parse(text);
      console.log("Fetched theme options from url:", parsed);
      onClose();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="URL to themeOptions (raw JSON)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        size="small"
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button variant="contained" onClick={handleFetch} disabled={!url || loading}>
          Import from link
        </Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        {loading && <CircularProgress size={20} />}
      </Box>
    </Box>
  );
}
