import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import type { Theme, CSSObject } from "@mui/material/styles";
import { Typography, Drawer, Divider, Button, Stack } from "@mui/material";
import { Menu, ChevronRight, ChevronLeft } from "@mui/icons-material";
import layoutStyles from "../layout-styles";
import FramesPopOver from "./FramesPopOver";

const openedMixin = (theme: Theme): CSSObject => ({
  ...theme.mixins.toolbar,
  width: 300,
  overflowX: "hidden",
  [theme.breakpoints.up("lg")]: {
    width: layoutStyles.activities.width,
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  overflowX: "hidden",
  width: `calc(${theme.spacing(6)})`,
});

const PanelHeader = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 50,
  height: 50,
  padding: theme.spacing(0, 1),
}));

const Panel = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: layoutStyles.activities.width,
  flexShrink: 0,
  whiteSpace: "nowrap",
  border: "none",
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "block",
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          // hide native scrollbars but preserve scrolling
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
            width: 0,
            height: 0,
          },
        },
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          // hide native scrollbars but preserve scrolling
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
            width: 0,
            height: 0,
          },
        },
      },
    },
  ],
  backgroundColor: "#111",
}));

// type CanvasActivitiesPanelProps = {
//   isShowing: boolean;
// };

export default function CanvasActivitiesPanel() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen((open) => !open);
  };

  return (
    <Panel variant="permanent" open={open}>
      <PanelHeader>
        <Typography
          variant="subtitle2"
          sx={{
            flexGrow: 1,
            textAlign: "start",
            fontWeight: 700,
            opacity: open ? 1 : 0,
            paddingInline: 1,
            transition: theme.transitions.create("opacity", {
              duration: 200,
            }),
            display: open ? "block" : "none",
          }}
        >
          MUI Theme Builder{" "}
          <Typography
            component="span"
            sx={{ fontWeight: 600, fontSize: ".875rem" }}
            color="error"
          >
            v5
          </Typography>
        </Typography>

        <Button
          size="small"
          onClick={toggleDrawer}
          sx={{
            height: 50,
            minWidth: theme.spacing(6),
            width: theme.spacing(8),
            ml: open ? "auto" : 0,
          }}
        >
          {open ? (
            theme.direction === "rtl" ? (
              <ChevronRight />
            ) : (
              <ChevronLeft />
            )
          ) : (
            <Menu />
          )}
        </Button>
      </PanelHeader>
      <Divider />

      {!open ? (
        <Stack paddingTop={2} paddingInline={1} alignItems="center">
          <FramesPopOver />
        </Stack>
      ) : (
        <Stack
          paddingTop={2}
          paddingInline={1}
          alignItems="center"
          sx={{
            opacity: open ? 1 : 0,
          }}
        >
          <Typography variant="body2" sx={{ p: 2 }}>
            Activity Panel Content
          </Typography>
        </Stack>
      )}
    </Panel>
  );
}
