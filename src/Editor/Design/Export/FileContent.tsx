import useExport from "./useExport";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fileExtensionToProgrammingLanguage } from "./fileExtensionToProgrammingLanguage";
import { Box, type SxProps, type Theme } from "@mui/material";

function FileContent({ sx }: { sx?: SxProps<Theme> }) {
  const { fileExtension, getExportCode } = useExport();
  const language = fileExtensionToProgrammingLanguage(fileExtension) || fileExtension;
  return (
    <Box
      component={SyntaxHighlighter}
      language={language}
      style={vscDarkPlus}
      showLineNumbers
      sx={{
        ...sx,
      }}
    >
      {getExportCode()}
    </Box>
  );
}

export default FileContent;
