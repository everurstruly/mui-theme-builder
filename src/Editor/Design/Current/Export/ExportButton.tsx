import Button from "@mui/material/Button";
import useExportOptions from "./useExportOptions";

export default function ExportButton() {
  const setOpened = useExportOptions((state) => state.setOpened);
  return (
    <Button
      variant="contained"
      aria-label="Copy and Implement Selected Theme"
      onClick={() => setOpened(true)}
    >
      Export Design
    </Button>
  );
}
