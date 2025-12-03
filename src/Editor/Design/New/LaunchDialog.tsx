import * as React from "react";
import LaunchBlockerDialog from "./LaunchBlockerDialog";
import { Dialog, DialogContent } from "@mui/material";
import { Box, Tabs, Tab, Stack, lighten } from "@mui/material";
import { useLaunchDialog } from "./useLaunchDialog";
import { useLoad } from "./useLoad";
import { launchDialogTabs } from "./launchDialogTabs";

export default function LaunchDialog() {
  const { status, blocker } = useLoad();

  const isOpen = useLaunchDialog((s) => s.isOpen);
  const close = useLaunchDialog((s) => s.close);
  const screen = useLaunchDialog((s) => s.screen);
  const setScreen = useLaunchDialog((s) => s.setScreen);

  // Close dialog on successful launch
  React.useEffect(() => {
    if (status === "idle" && !blocker) {
      // Successfully loaded - close after a brief moment
      const timer = setTimeout(close, 100);
      return () => clearTimeout(timer);
    }
  }, [status, blocker, close]);

  return (
    <>
      <Dialog
        open={Boolean(isOpen)}
        onClose={close}
        fullWidth
        maxWidth={"xs"}
        PaperProps={{ sx: { borderRadius: 6 } }}
      >
        <DialogContent sx={{ p: 0 }}>
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
                {launchDialogTabs.map((modeOption) => (
                  <Tab
                    key={modeOption.value}
                    label={modeOption.label}
                    value={modeOption.value}
                    sx={{ py: 2.4 }}
                  />
                ))}
              </Tabs>
            </Stack>

            <Box role="region" sx={{ px: 2, pb: 2 }}>
              {launchDialogTabs.map(
                ({ value, Component }) =>
                  screen === value && <Component key={value} onClose={close} />
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <LaunchBlockerDialog />
    </>
  );
}
