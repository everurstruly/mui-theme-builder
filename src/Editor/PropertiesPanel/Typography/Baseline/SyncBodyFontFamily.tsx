import * as React from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel, Stack, Typography } from "@mui/material";

export default function SyncBodyFontFamily() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
      <Typography variant="caption" gutterBottom>
        Font Family (Body)
      </Typography>

      <FormControlLabel
        label="Sync Changes"
        value="sync"
        labelPlacement="start"
        control={
          <Switch
            size="small"
            checked={checked}
            onChange={handleChange}
            slotProps={{ input: { "aria-label": "controlled" } }}
          />
        }
        slotProps={{
          typography: {
            fontSize: "caption.fontSize",
          },
        }}
      />
    </Stack>
  );
}
