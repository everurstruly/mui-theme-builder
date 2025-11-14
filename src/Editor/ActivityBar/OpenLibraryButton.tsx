import { BookmarkBorderOutlined } from "@mui/icons-material";
import useEditorUiStore from "../editorUiStore";
import { Button } from "@mui/material";

function OpenLibraryButton() {
  const showPanel = useEditorUiStore((state) => state.showPanel);

  return (
    <Button
      size="small"
      variant="outlined"
      sx={{
        px: 1,
        borderRadius: 2,
        "& .MuiButton-startIcon": {
          // marginInlineEnd: 0.5,
          marginBottom: 0.125, // fix: ensure text alignement with icons
        },
      }}
      onClick={() => showPanel("library")}
      startIcon={<BookmarkBorderOutlined />}
    >
      My Saves
    </Button>
  );
}

export default OpenLibraryButton;
