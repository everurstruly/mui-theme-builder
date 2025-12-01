import * as React from "react";
import { Popover } from "@mui/material";
import { Box, Tabs, Tab, Stack, lighten } from "@mui/material";
import TemplateMethod from "./Template/Template";
import LaunchConfirmationDialog from "./LaunchConfirmationDialog";
import { useLaunchScreen, type LaunchScreen } from "./useLaunchScreen";
import { useLaunch } from "./useLaunch";

const modes: {
  value: LaunchScreen;
  label: string;
  Component: React.ComponentType<any>;
}[] = [
  { value: "template", label: "Built-in Templates", Component: TemplateMethod },
];

export default function LaunchDialogContainer() {
  const anchorEl = useLaunchScreen((s) => s.anchorEl);
  const close = useLaunchScreen((s) => s.close);
  const screen = useLaunchScreen((s) => s.screen);
  const setScreen = useLaunchScreen((s) => s.setScreen);
  
  const { launch, status, blocker } = useLaunch();

  // Close dialog on successful launch
  React.useEffect(() => {
    if (status === "success") {
      close();
    }
  }, [status, close]);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={close}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{
        root: {
          sx: { mt: 2, ml: 1 },
        },
        paper: {
          sx: { width: 320, borderRadius: 4 },
        },
      }}
    >
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
            value={screen}
            onChange={(_, value) => setScreen(value)}
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
              screen === value && (
                <Component
                  key={value}
                  onClose={close}
                  launch={launch}
                />
              )
          )}
        </Box>

        <LaunchConfirmationDialog
          open={status === "blocked" && blocker?.reason === "UNSAVED_CHANGES"}
          onDiscard={() => blocker?.resolutions.discardAndProceed()}
          onKeep={() => blocker?.resolutions.cancel()}
          onCancel={() => blocker?.resolutions.cancel()}
        />
      </Box>
    </Popover>
  );
}
