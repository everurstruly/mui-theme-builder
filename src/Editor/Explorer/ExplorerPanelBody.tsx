import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import SampleCanvasObjectsTree from "./Menus/SampleCanvasObjectsTree";
import useEditor from "../useEditor";

export default function ExplorerPanelBody() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const focusTimeoutRef = React.useRef<number | null>(null);

  const hiddenPanels = useEditor((s) => s.hiddenPanels);
  const isVisible = !hiddenPanels.includes("explorer");

  React.useEffect(() => {
    // Only run focus logic when the explorer panel is visible
    if (!isVisible) {
      // clear any pending timeouts when hidden
      if (focusTimeoutRef.current) {
        window.clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
      return;
    }

    const root = containerRef.current;
    if (!root) return;

    if (focusTimeoutRef.current) {
      window.clearTimeout(focusTimeoutRef.current);
    }

    // Delay a tick so mounted children can render and be focusable
    focusTimeoutRef.current = window.setTimeout(() => {
      const selector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusable = root.querySelector<HTMLElement>(selector);

      if (firstFocusable) {
        try {
          firstFocusable.focus();
        } catch {
          /* ignore focus errors */
        }
      } else {
        try {
          root.focus();
        } catch {
          /* ignore */
        }
      }
    }, 0);

    return () => {
      if (focusTimeoutRef.current) {
        window.clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };
  }, [isVisible]);

  return (
    <Box
      ref={containerRef}
      tabIndex={-1}
      role="region"
      aria-label={`Explorer panel`}
      sx={{ outline: "none" }}
    >
      <Divider />
      <Typography variant="button" component="h6" sx={{ py: 2, mx: 1.5 }}>
        List of Previews
      </Typography>
      <SampleCanvasObjectsTree />
    </Box>
  );
}

