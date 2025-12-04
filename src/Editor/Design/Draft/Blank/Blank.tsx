import { Box, Button, Typography, Stack } from "@mui/material";
import { useDraft } from "../useDraft";
import { createFreshSnapshot } from "../../storage/createFreshSnapshot";

export default function BlankOption({ onClose }: { onClose: () => void }) {
  const { load } = useDraft();

  const createAndClose = async (preset: "light" | "dark") => {
    try {
      const snapshot = createFreshSnapshot({
        id: "",
        title: "Untitled Design",
        baseThemeDsl: {},
        sourceLabel: "Blank Design",
      });

      snapshot.preferences.activeColorScheme = preset;

      await load(
        () =>
          Promise.resolve({
            snapshot,
            metadata: { title: snapshot.title, sourceType: "blank" },
          }),
        { mode: "replace" }
      );

      onClose();
    } catch (err) {
      console.error("Failed to create blank design:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="body2">
        Start a blank design quickly. Your starting color scheme isn't permanent —
        you can edit theme settings later.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => createAndClose("light")}
          sx={{
            flexGrow: 1,
            flexShrink: 0,
            height: 200,
            borderRadius: 3,
            border: 2,
          }}
        >
          Light Mode
        </Button>

        <Button
          variant="outlined"
          onClick={() => createAndClose("dark")}
          sx={{
            flexGrow: 1,
            flexShrink: 0,
            height: 200,
            borderRadius: 3,
            border: 2,
          }}
        >
          Dark Mode
        </Button>
      </Stack>
    </Box>
  );
}
