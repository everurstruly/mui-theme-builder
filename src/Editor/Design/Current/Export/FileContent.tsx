import useExport from "./useExport";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Box } from "@mui/material";

function FileContent({ sx }: { sx?: object }) {
  const { fileExtension, getExportCode } = useExport();

  return (
    <Box
      component={SyntaxHighlighter}
      language={fileExtension}
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
