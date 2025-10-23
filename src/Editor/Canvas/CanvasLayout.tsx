import { Box } from "@mui/material";

type CanvasLayoutProps = {
  children?: React.ReactNode;
};

export default function CanvasLayout({ children }: CanvasLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        flexGrow: 1,
        minWidth: 0, // <-- ensure this flex child can shrink
        overflow: "hidden", // <-- contain expansion, create clip/scroll context
        height: `calc(100% - var(--header-height))`,

        position: "relative",
        px: "var(--canvas-brim-padding)",
        pb: "var(--canvas-brim-padding)",
        backgroundColor: "transparent",

        [theme.breakpoints.up("sm")]: {
          height: `calc(100% - var(--canvas-brim-padding) - var(--toolbar-height))`,
        },
      })}
    >
      {children}
    </Box>
  );
}
