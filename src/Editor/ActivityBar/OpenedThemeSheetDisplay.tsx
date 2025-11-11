import { Stack, Typography } from "@mui/material";

function OpenedThemeSheetDisplay() {
  return (
    <Stack>
      <Typography color="primary" variant="caption" sx={{ lineHeight: 1 }}>
        You're currently editing
      </Typography>
      <Typography
        color="text.secondary"
        variant="subtitle2"
        sx={{ lineHeight: 1.4 }}
      >
        X3 Lab Dashboard
      </Typography>
    </Stack>
  );
}

export default OpenedThemeSheetDisplay;
