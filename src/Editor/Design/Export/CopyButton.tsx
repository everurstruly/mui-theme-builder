import { ContentCopyOutlined } from "@mui/icons-material";
import FlashStateContent from "../../../lib/FlashStateButton";
import useExport from "./useExport";

function CopyButton() {
  const { copyToClipboard } = useExport();

  return (
    <FlashStateContent
      flash="Copied!"
      flashDurationMs={1200}
      onClick={copyToClipboard}
      sx={{ minWidth: "auto" }}
    >
      <ContentCopyOutlined fontSize="small" />
    </FlashStateContent>
  );
}

export default CopyButton;
