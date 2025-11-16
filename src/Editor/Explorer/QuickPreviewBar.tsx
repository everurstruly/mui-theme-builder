import useEditorUiStore from "../editorStore";
import useFolderNavigator from "./useFolderNavigator";
import { DoubleArrowOutlined } from "@mui/icons-material";
import { Stack, Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { useThemeDesignStore } from "../Design";
import { getFolderNodeByChain } from "../Previews/registry";

function QuickPreviewBar() {
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const shouldBeHidden = !hiddenPanels.includes("explorer");

  const activePreviewId = useThemeDesignStore((s) => s.activePreviewId);
  const selectPreview = useThemeDesignStore((s) => s.selectPreview);

  const {
    samplesTree,
    activeFolderChain,
    setActiveFolderChain,
    childrenEntries,
    upCue,
  } = useFolderNavigator(activePreviewId);

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
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: 1,
        borderBottomColor: "divider",
      }}
    >
      <Breadcrumbs
        aria-label="quick-previews-breadcrumbs"
        separator={<DoubleArrowOutlined sx={{ fontSize: ".8625rem" }} />}
        sx={{
          px: 1.5,
          fontSize: "body2.fontSize",
          alignItems: "center !important",
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Link
          component="button"
          underline="none"
          color="inherit"
          sx={{
            whiteSpace: "nowrap",
            py: 1,
            // display: "flex",
            // alignItems: "center",
            // columnGap: 0.5,
          }}
          onClick={() => {
            // Clicking 'Previews' -> focus root folder
            setActiveFolderChain([]);
          }}
        >
          {/* <ListOutlined fontSize="small" /> */}
          List of Previews
        </Link>

        {/* Render folder-only breadcrumbs from the activeFolderChain */}
        {activeFolderChain && activeFolderChain.length > 0
          ? activeFolderChain.map((key, idx) => {
              // Get node for this chain prefix to read label
              const node = getFolderNodeByChain(
                samplesTree,
                activeFolderChain.slice(0, idx + 1)
              );
              const label = node?.label || key;

              return (
                <Link
                  key={key}
                  component="button"
                  underline="none"
                  color="inherit"
                  sx={{ py: 1, whiteSpace: "nowrap" }}
                  onClick={() => {
                    // Move up one level when clicking a breadcrumb folder
                    // e.g. clicking the folder at index `idx` will shorten the chain to `0..idx-1` (one level up)
                    setActiveFolderChain(activeFolderChain.slice(0, idx));
                  }}
                >
                  {label}
                </Link>
              );
            })
          : null}

        <Box sx={{ display: "flex", ml: -1.7 }}>
          <DoubleArrowOutlined sx={{ fontSize: ".8625rem" }} />
        </Box>
      </Breadcrumbs>

      {/* <Divider orientation="vertical" flexItem /> */}

      <Stack
        direction={"row"}
        // pl={1.5}
        divider={
          <Typography
            color="action.disabled"
            sx={{ userSelect: "none", fontWeight: 400 }}
          >
            {"//"}
          </Typography>
        }
        sx={{
          columnGap: 1,
          alignItems: "center",
          borderLeftColor: "divider",
          backgroundColor: "transparent",
          overflowX: "auto",
          // animation/visual cue when navigating up: translate + fade briefly
          transition:
            "transform 220ms ease, opacity 220ms ease, box-shadow 220ms ease",
          transform: upCue ? "translateY(-6px)" : "translateY(0)",
          opacity: upCue ? 0.85 : 1,
          boxShadow: upCue
            ? (theme) => `0 6px 18px ${theme.palette.action.hover}`
            : "none",
        }}
      >
        {childrenEntries.map(([key, node]) => {
          if (node.type === "folder") {
            return (
              <Link
                key={key}
                variant="body2"
                component="button"
                underline="none"
                color="inherit"
                sx={{ whiteSpace: "nowrap", px: 1.5, py: 1.5 }}
                onClick={() =>
                  setActiveFolderChain([...(activeFolderChain || []), key])
                }
              >
                {node.label}
              </Link>
            );
          }

          return (
            <Link
              key={key}
              variant="body2"
              component="button"
              underline="none"
              sx={{ whiteSpace: "nowrap", px: 1.5, py: 1.5 }}
              color={node.id === activePreviewId ? "primary" : "inherit"}
              onClick={() => selectPreview(node.id as string)}
            >
              {node.label}
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
}

// helpers moved to the registry and into `useFolderNavigator`

export default QuickPreviewBar;
