import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { CancelOutlined, ContentCopyOutlined } from "@mui/icons-material";
import { Stack, Box, Typography, Paper, Tabs, Tab } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCreatedThemeOption } from "..";
import FlashStateContent from "../../../lib/FlashStateButton";

type ExportType = "themeOptions" | "themeObject";
type ExportFormat = "js" | "ts" | "json";

export default function DesignExportButton() {
  const [open, setOpen] = React.useState(false);
  const [exportType, setExportType] = React.useState<ExportType>("themeOptions");
  const [exportFormat] = React.useState<ExportFormat>("ts");
  const themeOptions = useCreatedThemeOption();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getThemeCode = () => {
    const joinLines = (lines: string[]) => lines.join("\n");
    const makeWithJson = (prefix: string, suffix = ";") => {
      const out: string[] = [];
      if (jsonLines.length === 0) return prefix + suffix;

      // Attach first JSON line to the prefix so the assignment/header sits on the same line
      out.push(prefix + jsonLines[0]);
      for (let i = 1; i < jsonLines.length; i++) out.push(jsonLines[i]);
      out[out.length - 1] = out[out.length - 1] + suffix;
      return joinLines(out);
    };

    if (!themeOptions) {
      return joinLines(["// No theme available"]);
    }

    const themeJson = JSON.stringify(themeOptions, null, 2);
    const jsonLines = themeJson.split("\n");

    // JSON format - just the raw theme options
    if (exportFormat === "json") {
      return joinLines(jsonLines);
    }

    // ThemeOptions only (config object)
    if (exportType === "themeOptions") {
      if (exportFormat === "js") {
        return makeWithJson("export const themeOptions = ");
      } else {
        // TypeScript
        const header = "import type { ThemeOptions } from '@mui/material/styles';";
        const body = makeWithJson("export const themeOptions: ThemeOptions = ");
        return joinLines([header, "", body, ""]);
      }
    }

    // Whole Theme object (with createTheme)
    if (exportFormat === "js") {
      const parts: string[] = [];
      parts.push("import { createTheme } from '@mui/material/styles';");
      parts.push("");
      parts.push(makeWithJson("const themeOptions = ", ""));
      parts.push("");
      parts.push("const theme = createTheme(themeOptions);");
      parts.push("");
      parts.push("export default theme;");
      parts.push("");
      return joinLines(parts);
    } else {
      // TypeScript
      const parts: string[] = [];
      parts.push(
        "import { createTheme, type ThemeOptions } from '@mui/material/styles';"
      );
      parts.push("");
      parts.push(makeWithJson("const themeOptions: ThemeOptions = ", ""));
      parts.push("");
      parts.push("const theme = createTheme(themeOptions);");
      parts.push("");
      parts.push("export default theme;");
      parts.push("");
      return joinLines(parts);
    }
  };

  const getFileContent = () => {
    return getThemeCode();
  };

  function handleCopyContent() {
    copyToClipboard(getFileContent());
  }

  return (
    <>
      <Button
        variant="contained"
        aria-label="Copy and Implement Selected Theme"
        onClick={() => handleClickOpen()}
      >
        Copy Theme
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="export-context-dialog"
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 1, pb: 2 }}
          >
            <Typography variant="h6">MUI Theme Designed — Copy/Export</Typography>

            <IconButton size="small" aria-label="close" onClick={handleClose}>
              <CancelOutlined />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Paper sx={{ position: "relative" }}>
            <Box
              component={SyntaxHighlighter}
              language={"typescript"}
              style={vscDarkPlus}
              showLineNumbers
              sx={{
                scrollbarWidth: "none",
                overflow: "auto",
                height: "65vh",
                margin: "0 !important",
                paddingTop: "6rem !important",
              }}
            >
              {getFileContent()}
            </Box>

            <Stack
              direction={"row"}
              sx={{
                alignItems: "center",
                justifyContent: "flex-end",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                color: "common.white",
                backdropFilter: "blur(20px)",
                borderBottom: 1,
                borderBottomColor: "#333",
              }}
            >
              <Tabs
                sx={{
                  px: 2,
                  marginInlineEnd: "auto",
                }}
              >
                <Tab
                  label="Theme Options"
                  value="themeOptions"
                  sx={{
                    py: 3,
                    color:
                      exportType === "themeOptions"
                        ? "primary.light"
                        : "common.white",
                  }}
                  onClick={() => setExportType("themeOptions")}
                />
                {/* <Tab
                  label="Colors (Light)"
                  sx={{
                    py: 3,
                    color: "common.white",
                  }}
                />
                <Tab
                  label="Colors (Dark)"
                  sx={{
                    py: 3,
                    color: "common.white",
                  }}
                /> */}
              </Tabs>

              <FlashStateContent
                flash="Copied!"
                flashDurationMs={1200}
                onClick={() => handleCopyContent()}
                sx={{ mr: 1 }}
              >
                <ContentCopyOutlined
                  fontSize="small"
                  sx={{ color: "common.white" }}
                />
              </FlashStateContent>
            </Stack>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
}
