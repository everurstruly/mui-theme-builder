import useEditorUiStore from "../editorUiStore";
import { Button } from "@mui/material";

function OpenLibraryButton() {
  const showPanel = useEditorUiStore((state) => state.showPanel);

  return (
    <Button
      // sx={{ minWidth: 0, px: 0, borderRadius: 2 }}
      sx={{ borderRadius: 2 }}
      onClick={() => showPanel("library")}
    >
      My Saved Themes
    </Button>
  );
}

export default OpenLibraryButton;
