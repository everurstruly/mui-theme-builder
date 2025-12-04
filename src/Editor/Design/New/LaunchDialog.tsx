import * as React from "react";
import LaunchBlockerDialog from "./LaunchBlockerDialog";
import DialogHeading from "../../components/DialogHeading";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { useLaunchDialog } from "./useLaunchDialog";
import { useLoad } from "./useLoad";
import { launchDialogTabs } from "./launchDialogTabs";
import { AddOutlined } from "@mui/icons-material";

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
      <Dialog open={Boolean(isOpen)} onClose={close} fullWidth maxWidth={"xs"}>
        <DialogTitle>
          <DialogHeading title="Start a New Design" Icon={AddOutlined} />
        </DialogTitle>

        <Tabs
          value={screen}
          onChange={(_, value) => setScreen(value)}
          aria-label="New design creation methods"
          sx={{ mx: 4, borderBottom: 1, borderColor: "divider" }}
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

        <DialogContent>
          {launchDialogTabs.map(
            ({ value, Component }) =>
              screen === value && <Component key={value} onClose={close} />
          )}
        </DialogContent>
      </Dialog>

      <LaunchBlockerDialog />
    </>
  );
}
