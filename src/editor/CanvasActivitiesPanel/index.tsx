import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import type { Theme, CSSObject } from "@mui/material/styles";
import { Box, Typography, Drawer, Divider, Button } from "@mui/material";
import { Menu, ChevronRight, ChevronLeft } from "@mui/icons-material";
import layoutStyles from "../layout-styles";

const openedMixin = (theme: Theme): CSSObject => ({
  ...theme.mixins.toolbar,
  width: layoutStyles.sidebar.width,
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)})`,
});

const PanelHeader = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  height: 54,
  padding: theme.spacing(0, 1),
}));

const Panel = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: layoutStyles.sidebar.width,
  flexShrink: 0,
  whiteSpace: "nowrap",
  border: "none",
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

export default function CanvasActivityPanel() {
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
            paddingInline: 0.5,
            transition: theme.transitions.create("opacity", {
              duration: 200,
            }),
            display: open ? "block" : "none",
          }}
        >
          MUI Theme Builder v5
        </Typography>

        <Button
          size="small"
          variant={open ? "text" : "contained"}
          onClick={toggleDrawer}
          sx={{ minWidth: 0, ml: open ? "auto" : 0 }}
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

      <Box
        sx={{
          opacity: open ? 1 : 0,
        }}
      >
        <Typography variant="body2" sx={{ p: 2 }}>
          Activity Panel Content
        </Typography>
      </Box>
    </Panel>
  );
}
