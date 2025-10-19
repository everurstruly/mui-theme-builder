const HEADER_HEIGHT = 0;
const CANVAS_PY = 0;

const styles = {
  header: {
    height: HEADER_HEIGHT,
  },
  sidebar: {
    width: "20vw",
    maxWidth: "300px",
  },
  canvas: {
    px: 0,
    py: CANVAS_PY,
    height: `calc(100vh - ${HEADER_HEIGHT}px - ${CANVAS_PY}px)`,
  },
  render: { flexGrow: 1, backgroundColor: "transparent" },
  properties: {
    width: "25vw",
    maxWidth: "320px",
    backgroundColor: "transparent",
  },
} as const;

export default styles;
