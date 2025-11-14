import { DoubleArrowOutlined } from "@mui/icons-material";
import { Stack, Button, Box } from "@mui/material";
import useEditorUiStore from "../editorUiStore";

function QuickPreviewBar() {
  const hiddenPannels = useEditorUiStore((state) => state.hiddenPanels);
  const shouldBeHidden = !hiddenPannels.includes("explorer");

  if (shouldBeHidden) {
    return null;
  }

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        alignItems: "center",
        backdropFilter: "blur(40px)",
        borderBottom: 1,
        borderBottomColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          columnGap={0.5}
          divider={<DoubleArrowOutlined sx={{ mb: 0.35, fontSize: ".8625rem" }} />}
        >
          <Button
            component="h6"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Previews
          </Button>

          <Button
            component="h6"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Components
          </Button>
        </Stack>
      </Box>

      <Stack direction={"row"} sx={{ px: 1.5 }}>
        {new Array(10).fill(0).map(() => {
          return <Button color="inherit">Test</Button>;
        })}
      </Stack>
    </Stack>
  );
}

export default QuickPreviewBar;
