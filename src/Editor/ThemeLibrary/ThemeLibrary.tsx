import Drawer from "@mui/material/Drawer";
import useEditorUiStore from "../editorUiStore";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  List,
  ListItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CloseOutlined, PreviewOutlined } from "@mui/icons-material";

export default function ThemeLibrary() {
  const hidePanel = useEditorUiStore((state) => state.hidePanel);
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const [currentTab, setCurrentTab] = useState("saves");

  const isOpen = !hiddenPanels.includes("library");

  function handleCloseDrawer(event: unknown) {
    hidePanel("library");
    void event;
  }

  function handleTabsChange(event: React.SyntheticEvent, newValue: string) {
    setCurrentTab(newValue);
    void event;
  }

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={handleCloseDrawer}
        anchor={"left"}
        slotProps={{
          paper: {
            sx: {
              width: "var(--explorer-panel-width)",
              boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
            },
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(60, 60, 69, 0.3)",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            paddingInline={2}
            sx={{
              minHeight: "var(--header-height)",
              height: "var(--header-height)",
              bgcolor: "var(--editor-tool-unit-bgColor)",
            }}
          >
            <Typography variant="subtitle1" component={"h6"} fontWeight={"bold"}>
              Themes
            </Typography>

            {/* <Button
              size="small"
              color="error"
              variant="contained"
              onClick={handleCloseDrawer}
            >
              Close
            </Button> */}
          </Stack>

          <Divider />

          <Tabs value={currentTab} onChange={handleTabsChange}>
            <Tab
              value="saves"
              label="My Saves"
              // sx={{ px: 2, minHeight: "var(--activity-bar-height)" }}
            />
            <Tab
              value="discover"
              label="Templates"
              // sx={{ px: 2, minHeight: "var(--activity-bar-height)" }}
            />
          </Tabs>

          <Divider />
        </Box>

        <List
          sx={{
            paddingInline: 2,
            paddingBlock: 3,
            paddingBlockEnd: 8,
          }}
        >
          {currentTab === "saves" && (
            <>
              {colorPalettesData.map((palette) => {
                return (
                  <ListItem
                    sx={{
                      flexDirection: "column",
                      paddingInline: 1.5,
                      paddingBlockEnd: 1.5,
                      paddingBlockStart: 3,
                      marginBottom: 3,
                      rowGap: 3,
                      borderRadius: 2,
                      justifyContent: "space-between",
                      backgroundColor: "#f5f5f5",
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Stack spacing={0.5} alignItems={"center"}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={"semibold"}
                        color="common.black"
                        textTransform={"capitalize"}
                      >
                        {palette.name}
                      </Typography>

                      <Stack direction="row" spacing={0.2} height={"14px"}>
                        {palette.colors.map((item) => {
                          const backgroundColor = item;
                          return (
                            <Box
                              key={`${palette.name}-${backgroundColor}`}
                              sx={{
                                height: "100%",
                                aspectRatio: "1 / 1",
                                backgroundColor,
                                borderRadius: 1,
                                border: 1.5,
                                borderColor: "divider",
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Stack>

                    <ButtonGroup fullWidth size="small" color="inherit">
                      <Button sx={{ "&:hover": { color: "error.main" } }}>
                        Delete
                      </Button>
                      <Button sx={{ "&:hover": { color: "primary.main" } }}>
                        Duplicate
                      </Button>
                      <Button sx={{ "&:hover": { color: "primary.main" } }}>
                        Edit
                      </Button>
                    </ButtonGroup>
                  </ListItem>
                );
              })}
            </>
          )}

          {currentTab === "discover" && (
            <>
              {colorPalettesData.reverse().map((palette) => {
                return (
                  <ListItem
                    sx={{
                      paddingInline: 1.5,
                      marginBottom: 2,
                      paddingBlock: 2,
                      justifyContent: "space-between",
                      backgroundColor: "#f5f5f5",
                      border: 1,
                      borderRadius: 2,
                      borderColor: "divider",
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={"semibold"}
                        color="common.black"
                        textTransform={"capitalize"}
                      >
                        {palette.name}
                      </Typography>

                      <Stack direction="row" spacing={0.2} height={"14px"} pl={0.2}>
                        {palette.colors.map((backgroundColor) => {
                          return (
                            <Box
                              key={`${palette.name}-${backgroundColor}`}
                              sx={{
                                height: "100%",
                                aspectRatio: "1 / 1",
                                backgroundColor,
                                borderRadius: 1,
                                border: 1.5,
                                borderColor: "divider",
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <IconButton size="small">
                        <PreviewOutlined />
                      </IconButton>
                    </Stack>
                  </ListItem>
                );
              })}
            </>
          )}
        </List>

        <Typography
          variant="caption"
          component={"small"}
          textAlign={"center"}
          py={2} // NB(nice to have): unintentionally center-aligns with the canvas bottom controls
          display="block"
        >
          -- You've reached the end --
        </Typography>

        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={handleCloseDrawer}
          sx={{
            position: "fixed",
            minWidth: "unset",
            top: 0,
            left: "var(--explorer-panel-width)",
            zIndex: 2,
          }}
          startIcon={<CloseOutlined />}
        >
          Hide Menu
        </Button>
      </Drawer>
    </>
  );
}

export function ThemeLibraryList({ currentTab = "saves" }) {

  return (
    <List
      sx={{
        paddingInline: 2,
        paddingBlock: 3,
        paddingBlockEnd: 8,
      }}
    >
      {currentTab === "saves" && (
        <>
          {colorPalettesData.map((palette) => {
            return (
              <ListItem
                sx={{
                  flexDirection: "column",
                  paddingInline: 1.5,
                  paddingBlockEnd: 1.5,
                  paddingBlockStart: 3,
                  marginBottom: 3,
                  rowGap: 3,
                  borderRadius: 2,
                  justifyContent: "space-between",
                  backgroundColor: "#f5f5f5",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Stack spacing={0.5} alignItems={"center"}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={"semibold"}
                    color="common.black"
                    textTransform={"capitalize"}
                  >
                    {palette.name}
                  </Typography>

                  <Stack direction="row" spacing={0.2} height={"14px"}>
                    {palette.colors.map((item) => {
                      const backgroundColor = item;
                      return (
                        <Box
                          key={`${palette.name}-${backgroundColor}`}
                          sx={{
                            height: "100%",
                            aspectRatio: "1 / 1",
                            backgroundColor,
                            borderRadius: 1,
                            border: 1.5,
                            borderColor: "divider",
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>

                <ButtonGroup fullWidth size="small" color="inherit">
                  <Button sx={{ "&:hover": { color: "error.main" } }}>Delete</Button>
                  <Button sx={{ "&:hover": { color: "primary.main" } }}>
                    Duplicate
                  </Button>
                  <Button sx={{ "&:hover": { color: "primary.main" } }}>Edit</Button>
                </ButtonGroup>
              </ListItem>
            );
          })}
        </>
      )}

      {currentTab === "discover" && (
        <>
          {colorPalettesData.reverse().map((palette) => {
            return (
              <ListItem
                sx={{
                  paddingInline: 1.5,
                  marginBottom: 2,
                  paddingBlock: 2,
                  justifyContent: "space-between",
                  backgroundColor: "#f5f5f5",
                  border: 1,
                  borderRadius: 2,
                  borderColor: "divider",
                }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={"semibold"}
                    color="common.black"
                    textTransform={"capitalize"}
                  >
                    {palette.name}
                  </Typography>

                  <Stack direction="row" spacing={0.2} height={"14px"} pl={0.2}>
                    {palette.colors.map((backgroundColor) => {
                      return (
                        <Box
                          key={`${palette.name}-${backgroundColor}`}
                          sx={{
                            height: "100%",
                            aspectRatio: "1 / 1",
                            backgroundColor,
                            borderRadius: 1,
                            border: 1.5,
                            borderColor: "divider",
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <IconButton size="small">
                    <PreviewOutlined />
                  </IconButton>
                </Stack>
              </ListItem>
            );
          })}
        </>
      )}
    </List>
  );
}

const colorPaletteNames = [
  "modern-minimal",
  "violet-bloom",
  "t3-chat",
  "twitter",
  "mocha-mousse",
  "bubblegum",
  "amethyst-haze",
  "notebook",
  "doom-64",
  "catppuccin",
  "graphite",
  "perpetuity",
  "kodama-grove",
  "cosmic-night",
  "tangerine",
  "quantum-rose",
  "nature",
  "bold-tech",
  "elegant-luxury",
  "amber-minimal",
  "supabase",
  "neo-brutalism",
  "solar-dusk",
  "claymorphism",
  "cyberpunk",
  "pastel-dreams",
  "clean-slate",
  "caffeine",
  "ocean-breeze",
  "retro-arcade",
  "midnight-bloom",
  "candyland",
  "northern-lights",
  "vintage-paper",
  "sunset-horizon",
  "starry-night",
  "claude",
  "vercel",
  "darkmatter",
  "mono",
  "soft-pop",
  "neon-dreams",
  "forest-whisper",
  "arctic-aurora",
  "desert-sunset",
  "ocean-depths",
  "vintage-film",
  "cyber-neon",
  "pastel-sky",
  "monochrome-elegance",
  "golden-hour",
];

const colorPalettesData = colorPaletteNames.map((name) => {
  return {
    name,
    colors: Array.from({ length: 5 }, () => generateRandomColorHexCode()),
  };
});

function generateRandomColorHexCode() {
  const bytes =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint8Array(3))
      : Uint8Array.from({ length: 3 }, () => Math.floor(Math.random() * 256));
  const backgroundColor = `#${[...bytes]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
  return backgroundColor;
}

// LEFT ALIGNED LAYOUT VERSION FOR "MY-SAVES" TAB
// {
//   colorPalettesData.slice(0, 5).map((palette) => {
//     return (
//       <ListItem
//         sx={{
//           flexDirection: "column",
//           paddingInline: 1.5,
//           paddingBlockStart: 2.5,
//           marginBottom: 4,
//           rowGap: 4,
//           borderRadius: 2,
//           justifyContent: "space-between",
//           backgroundColor: "#f5f5f5",
//           border: 1,
//           borderColor: "divider",
//         }}
//       >
//         <Stack spacing={0.5} alignSelf={"flex-start"} pl={1}>
//           <Typography
//             variant="subtitle2"
//             fontWeight={"semibold"}
//             color="common.black"
//             textTransform={"capitalize"}
//           >
//             {palette.name}
//           </Typography>

//           <Stack direction="row" spacing={0.3} height={"14px"}>
//             {palette.colors.map((backgroundColor) => {
//               return (
//                 <Box
//                   key={backgroundColor}
//                   sx={{
//                     height: "100%",
//                     aspectRatio: "1 / 1",
//                     backgroundColor,
//                     borderRadius: 1,
//                     border: 1.5,
//                     borderColor: "divider",
//                   }}
//                 />
//               );
//             })}
//           </Stack>
//         </Stack>

//         <ButtonGroup fullWidth size="medium" color="inherit">
//           <Button sx={{ "&:hover": { color: "error.main" } }}>Delete</Button>
//           <Button sx={{ "&:hover": { color: "primary.main" } }}>Copy</Button>
//           <Button sx={{ "&:hover": { color: "primary.main" } }}>Preview</Button>
//         </ButtonGroup>
//       </ListItem>
//     );
//   });
// }
