import Button from "@mui/material/Button";
import useExport from "./useExport";
import { toPascalKebab } from "./toPascalKebab";
import { DownloadOutlined } from "@mui/icons-material";

type DownloadButtonProps = {
  compactView: boolean;
};

export default function DownloadButton({ compactView }: DownloadButtonProps) {
  const {
    title,
    getExportCode,
    mode,
    fileExtension: language,
    colorScheme,
  } = useExport();

  const handlePrimaryClick = () => {
    const filename = `${toPascalKebab(title)}-${mode}-${colorScheme}.${language}`;
    const mime = language === "json" ? "application/json" : "text/javascript";
    const code = getExportCode();
    downloadFile(filename, code, mime);
  };

  return (
    <Button
      onClick={handlePrimaryClick}
      color="primary"
      sx={{
        minWidth: compactView ? 0 : undefined,
        paddingInline: compactView ? 1 : undefined,
      }}
    >
      {compactView ? <DownloadOutlined fontSize="small" /> : "Download"}
    </Button>
  );
}

function downloadFile(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
