import * as React from "react";
import { Box, Tabs, Tab, Stack, lighten } from "@mui/material";
import TemplateMethod from "./Template/TemplateMethod";

const modes = [
  { value: "template", label: "Built-in Templates", Component: TemplateMethod },
];

type ModeValue = (typeof modes)[number]["value"];

export default function CreationDialog({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = React.useState<ModeValue>("template");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        maxHeight: "50vh",
        overflow: "auto",
        scrollbarWidth: "none",
        scrollbarColor: "rgba(0,0,0,0.5) transparent",
      }}
    >
      <Stack
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Tabs
          value={mode}
          onChange={(_, value) => setMode(value as ModeValue)}
          variant="fullWidth"
          aria-label="New design creation method"
          sx={{
            backgroundColor: (theme) =>
              lighten(theme.palette.background.paper, 0.05),
          }}
        >
          {modes.map((modeOption) => (
            <Tab
              key={modeOption.value}
              label={modeOption.label}
              value={modeOption.value}
              sx={{ py: 2.4 }}
            />
          ))}
        </Tabs>
      </Stack>

      <Box role="region" sx={{ px: 2 }}>
        {modes.map(
          ({ value, Component }) =>
            mode === value && <Component key={value} onClose={onClose} />
        )}
      </Box>
    </Box>
  );
}
