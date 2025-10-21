import type { Theme } from "@mui/material";

const HEADER_HEIGHT = 135;
const CANVAS_PY = 0;

const styles = {
  canvas: {
    px: 0,
    py: CANVAS_PY,
    height: `calc(100vh - ${HEADER_HEIGHT}px - ${CANVAS_PY}px)`,
  },
  board: {
    flexGrow: 1,
    backgroundColor: "transparent",
    marginInline: "auto",
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    overflow: "auto",
  },
  header: (theme: Theme) => ({
    // height: HEADER_HEIGHT,
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  }),
  activities: {
    width: "20vw",
    maxWidth: "300px",
    display: "none",
    md: {
      display: "block",
    },
  },
  properties: (theme: Theme) => {
    return {
      width: "25vw",
      maxWidth: "340px",
      height: "100vh",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      backgroundColor: "transparent",
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
      // hide scrollbar but keep scrolling
      msOverflowStyle: "none", // IE and Edge
      scrollbarWidth: "none", // Firefox
      "&::-webkit-scrollbar": {
        display: "none", // WebKit
      },
    };
  },
} as const;

export default styles;
