import EditorActivitiesPanel from "./ActivitiesPanel";
import EditorToolBar from "./ToolBar";
import EditorCanvas from "./Canvas";
import EditorPropertiesPanel, {
  editorPropertiesPanelWidth,
} from "./PropertiesPanel";
import EditorPropertiesDrawerToggle from "./PropertiesPanel/DrawerToggle";
import EditorMobileHeader from "./MobileHeader";
import { Stack } from "@mui/material";
import { headerHeightCss } from "./Editor.constants";
import useEditorStore from "./Editor.store";

export default function Editor() {
  const isPropertiesPanelVisible = useEditorStore((state) => {
    return !state.hiddenPanels.includes("properties");
  });

  return (
    <>
      <EditorMobileHeader />
      <Stack
        flexGrow={1}
        direction="row"
        sx={(theme) => ({
          height: `calc(100vh - ${headerHeightCss})`,
          overflow: "hidden",

          [theme.breakpoints.up("md")]: {
            height: "100vh",
            overflow: "hidden",
            paddingInlineEnd: isPropertiesPanelVisible
              ? editorPropertiesPanelWidth.upMd
              : 0,
          },
        })}
      >
        <EditorActivitiesPanel />
        <Stack component="main" flexGrow={1}>
          <EditorToolBar />
          <EditorCanvas />
        </Stack>
        <EditorPropertiesPanel />
        <EditorPropertiesDrawerToggle />
      </Stack>
    </>
  );
}
