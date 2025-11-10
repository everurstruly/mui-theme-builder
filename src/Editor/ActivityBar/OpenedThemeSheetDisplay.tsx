import { Stack, Typography } from "@mui/material";

function OpenedThemeSheetDisplay() {
  return (
    <Stack>
      <Typography
        color="primary"
        variant="caption"
        fontWeight="semibold"
        sx={{ lineHeight: 1 }}
      >
        You're currently editing
      </Typography>
      <Typography color="inherit" variant="subtitle2" fontWeight="semibold">
        X3 Lab Dashboard
      </Typography>
    </Stack>
  );
}

export default OpenedThemeSheetDisplay;

