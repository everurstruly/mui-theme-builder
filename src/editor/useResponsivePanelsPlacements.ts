import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import useEditorStore from "./Editor.store";

export default function useResponsivePanelsPlacements() {
  const theme = useTheme();
  const isPhoneScreens = useMediaQuery(theme.breakpoints.down("sm"));
  const isLaptopScreens = useMediaQuery(theme.breakpoints.up("lg"));
  const hideAllPanels = useEditorStore((state) => state.hideAllPanels);
  const showAllPanels = useEditorStore((state) => state.showAllPanels);

  useEffect(() => {
    if (isPhoneScreens) {
      hideAllPanels();
    }
  }, [isPhoneScreens, hideAllPanels]);

  useEffect(() => {
    if (isLaptopScreens) {
      showAllPanels();
    }
  }, [isLaptopScreens, showAllPanels]);
}
