import { useEffect, type ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useSwipeToClose } from "./useSwipeToClose";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  height?: string;
  enableSwipe?: boolean;
  swipeThreshold?: number;
  showGrabber?: boolean;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
  height = "max(60vh, 75%)",
  enableSwipe = true,
  swipeThreshold = 100,
  showGrabber = true,
}: DrawerProps) {
  const { ref, swipeOffset, isSwipingDown, touchHandlers } = useSwipeToClose({
    onClose,
    threshold: swipeThreshold,
  });

  // Register Escape key behavior
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <Box
        aria-hidden
        onClick={onClose}
        sx={(theme) => ({
          position: "fixed !important",
          inset: 0,
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.5)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 380ms cubic-bezier(.2,.8,.2,1)",
          zIndex: 1400,
        })}
      />

      {/* Drawer Panel */}
      <Paper
        ref={ref}
        role="dialog"
        aria-hidden={!open}
        {...(enableSwipe ? touchHandlers : {})}
        sx={{
          position: "fixed !important",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1500,
          borderRadius: "8px 8px 0 0",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open
            ? `translateY(${enableSwipe ? swipeOffset : 0}px)`
            : "translateY(100%)",
          transition: isSwipingDown
            ? "none"
            : "transform 320ms cubic-bezier(.2,.8,.2,1), opacity 320ms cubic-bezier(.2,.8,.2,1)",
          height,
          boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showGrabber && <DrawerGrabber />}

        {title && (
          <Box
            sx={{
              px: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: "center",
                mx: "auto",
                py: 2,
              }}
            >
              {title}
            </Typography>
          </Box>
        )}

        {children}
      </Paper>
    </>
  );
}

function DrawerGrabber() {
  return (
    <Box
      sx={{
        flexShrink: 0,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 4,
          borderRadius: 999,
          background: "rgba(155,155,155,0.5)",
        }}
      />
    </Box>
  );
}
