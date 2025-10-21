import { SaveRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function SaveThemeButton() {
  const isSaved = true;

  const handleSaveChanges = () => {
    // Simulate saving process
  };

  return (
    <Button
      value="save"
      size="small"
      color="primary"
      aria-label="Save changes"
      variant={isSaved ? "outlined" : "contained"}
      disabled={isSaved}
      onClick={() => handleSaveChanges()}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        columnGap: 1,
        lineHeight: "none",
        fontSize: ".75rem",
        fontWeight: 700,
        textAlign: "start",
        textTransform: "none !important",
      }}
    >
      <SaveRounded sx={{ fontSize: 16 }} />
      {isSaved ? "Saved" : "Click to Save changes"}
    </Button>
  );
}
