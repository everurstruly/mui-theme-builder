import React from "react";
import useEditor from "../useEditor";
import DeveloperPropertiesPanel from "./Experiences/DeveloperPropertiesPanel";
import DesignerPropertiesPanel from "./Experiences/DesignerPropertiesPanel";
import { Stack } from "@mui/material";
import ShadesDrawer from "./Color/ShadesDrawer/ShadesDrawer";

export default function PanelBody() {
  const selectedExperienceId = useEditor((state) => state.selectedExperience);
  const setMouseOverPropertiesPanel = useEditor(
    (state) => state.setMouseOverPropertiesPanel
  );
  const keyboardFocusRequest = useEditor((s) => s.keyboardFocusRequest);
  const clearKeyboardFocusRequest = useEditor((s) => s.clearKeyboardFocusRequest);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const focusTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Only autofocus when the focus request was initiated via keyboard
    if (keyboardFocusRequest !== "properties") {
      return;
    }

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

      // Clear the keyboard focus request so we don't re-run on unrelated changes
      try {
        clearKeyboardFocusRequest();
      } catch {
        /* ignore */
      }
    }, 0);

    return () => {
      if (focusTimeoutRef.current) {
        window.clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };
  }, [selectedExperienceId, keyboardFocusRequest, clearKeyboardFocusRequest]);

  return (
    <Stack
      ref={containerRef}
      tabIndex={-1}
      role="region"
      aria-label={`Properties panel (${selectedExperienceId})`}
      onMouseEnter={() => setMouseOverPropertiesPanel(true)}
      onMouseLeave={() => setMouseOverPropertiesPanel(false)}
      sx={{
        height: "100%",
        overflow: "hidden",

        // css: create content window
        // position: "relative !important",
        // transform: "translateX(0px)",
      }}
    >
      {selectedExperienceId === "designer" && <DesignerPropertiesPanel />}
      {selectedExperienceId === "developer" && <DeveloperPropertiesPanel />}

      <ShadesDrawer />
    </Stack>
  );
}
