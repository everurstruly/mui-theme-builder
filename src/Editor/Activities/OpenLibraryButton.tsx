import { BookmarkBorderOutlined } from "@mui/icons-material";
import useEditorUiStore from "../editorStore";
import { Button } from "@mui/material";

function OpenLibraryButton() {
  const showPanel = useEditorUiStore((state) => state.showPanel);

  return (
    <Button
      size="small"
      // variant="outlined"
      startIcon={<BookmarkBorderOutlined sx={{ fontSize: "1rem !important" }} />}
      sx={{
        px: 1,
        borderRadius: 2,
        "& .MuiButton-startIcon": {
          marginInlineEnd: 0.5,
          marginBottom: 0.25, // fix: ensure text alignement with icons
        },
      }}
      onClick={() => showPanel("library")}
    >
      My Saves
    </Button>
  );
}

export default OpenLibraryButton;
