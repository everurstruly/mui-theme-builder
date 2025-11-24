import * as React from "react";
import TemplateOption from "./NewDesignOptions/TemplateOption";
import { Box, Tabs, Tab } from "@mui/material";
import PasteOption from "./NewDesignOptions/PasteOption";

const modes = [
  { value: "template", label: "Template", Component: TemplateOption },
  { value: "paste", label: "Paste Code", Component: PasteOption },
];

type ModeValue = (typeof modes)[number]["value"];

export default function NewDesignDialogContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [mode, setMode] = React.useState<ModeValue>("template");

  return (
    <Box
      sx={{
        position: "relative",
        maxHeight: "50vh",
        overflow: "auto",
        scrollbarWidth: "none",
        scrollbarColor: "rgba(0,0,0,0.5) transparent",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Tabs
          value={mode}
          onChange={(_, value) => setMode(value)}
          variant="fullWidth"
          aria-label="New design creation method"
          sx={{
            px: 2.6,
            pt: 1.2,
            backgroundColor: (theme) => theme.palette.background.paper,
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
      </Box>

      <Box role="region" sx={{ p: 2 }}>
        {modes.map(
          ({ value, Component }) =>
            mode === value && <Component key={value} onClose={onClose} />
        )}
      </Box>
    </Box>
  );
}
