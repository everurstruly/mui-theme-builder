import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ContentCopy } from "@mui/icons-material";
import { useThemeDesignOptions } from "../ThemeDesign";
import {
  Stack,
  Box,
  MenuItem,
  Select,
  Chip,
  Typography,
} from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type ExportType = "themeOptions" | "themeObject";
type ExportFormat = "js" | "ts" | "json";
type FileType = "theme" | "package" | "install";

export default function ThemeDesignExportButton() {
  const [open, setOpen] = React.useState(false);
  const [packageManager] = React.useState<"npm" | "yarn" | "pnpm" | "bun">("npm");
  const [exportType, setExportType] = React.useState<ExportType>("themeOptions");
  const [exportFormat, setExportFormat] = React.useState<ExportFormat>("ts");
  const [activeFile, setActiveFile] = React.useState<FileType>("theme");
  const themeOptions = useThemeDesignOptions();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getInstallCommand = () => {
    const pkg = "@mui/material @emotion/react @emotion/styled";
    switch (packageManager) {
      case "npm":
        return `npm install ${pkg}`;
      case "yarn":
        return `yarn add ${pkg}`;
      case "pnpm":
        return `pnpm add ${pkg}`;
      case "bun":
        return `bun add ${pkg}`;
      default:
        return `npm install ${pkg}`;
    }
  };

  const getThemeCode = () => {
    if (!themeOptions) return "// No theme available";

    const themeJson = JSON.stringify(themeOptions, null, 2);

    // JSON format - just the raw theme options
    if (exportFormat === "json") {
      return themeJson;
    }

    // ThemeOptions only (config object)
    if (exportType === "themeOptions") {
      if (exportFormat === "js") {
        return `export const themeOptions = ${themeJson};`;
      } else {
        // TypeScript
        return `import type { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = ${themeJson};`;
      }
    }

    // Whole Theme object (with createTheme)
    if (exportFormat === "js") {
      return `import { createTheme } from '@mui/material/styles';

const themeOptions = ${themeJson};

const theme = createTheme(themeOptions);

export default theme;`;
    } else {
      // TypeScript
      return `import { createTheme, type ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = ${themeJson};

const theme = createTheme(themeOptions);

export default theme;`;
    }
  };

  const getPackageJson = () => {
    return `{
  "dependencies": {
    "@mui/material": "^6.0.0",
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0"
  }
}`;
  };

  const getFileContent = () => {
    if (activeFile === "install") return getInstallCommand();
    if (activeFile === "package") return getPackageJson();
    return getThemeCode();
  };

  const getLanguage = () => {
    if (activeFile === "install") return "bash";
    if (activeFile === "package") return "json";
    if (exportFormat === "json") return "json";
    return exportFormat === "js" ? "javascript" : "typescript";
  };

  const getFileName = () => {
    if (activeFile === "install") return "install";
    if (activeFile === "package") return "package.json";
    
    // Theme file name based on format
    if (exportFormat === "json") return "theme.json";
    return exportFormat === "js" ? "theme.js" : "theme.ts";
  };

  return (
    <>
      <Button
        variant="contained"
        aria-label="Copy and Implement Selected Theme"
        onClick={() => handleClickOpen()}
        // startIcon={<FileCopyRounded />}
        sx={{
          borderRadius: 2.5,

          "& .MuiSvgIcon-root": {
            fontSize: "1rem", // FIXME: match font size (not literialy 13px)
          },
        }}
      >
        Copy Theme
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="export-context-dialog"
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle
          id="export-context-dialog"
          component={"div"}
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
            m: 0,
            pt: 2,
            px: 3,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Theme Export</Typography>

            <IconButton
              size="small"
              aria-label="close"
              onClick={handleClose}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* <Tabs
            value={packageManager}
            onChange={(_, val) => setPackageManager(val)}
            sx={{
              minHeight: 36,
              mb: 2,
              "& .MuiTab-root": {
                minHeight: 36,
                py: 0.5,
                px: 2,
                minWidth: 60,
                fontSize: "0.875rem",
                textTransform: "lowercase",
              },
            }}
          >
            <Tab value="pnpm" label="pnpm" />
            <Tab value="npm" label="npm" />
            <Tab value="yarn" label="yarn" />
            <Tab value="bun" label="bun" />
          </Tabs> */}

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as ExportType)}
              size="small"
              sx={{
                minWidth: 140,
                borderRadius: 2,
                fontSize: "12px",
              }}
            >
              <MenuItem value="themeOptions">ThemeOptions</MenuItem>
              <MenuItem value="themeObject">Theme Object</MenuItem>
            </Select>

            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              size="small"
              sx={{
                minWidth: 120,
                borderRadius: 2,
                fontSize: "12px",
              }}
            >
              <MenuItem value="ts">TypeScript</MenuItem>
              <MenuItem value="js">JavaScript</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>

            <Chip
              label="install"
              size="small"
              color={activeFile === "install" ? "primary" : "default"}
              onClick={() => setActiveFile("install")}
              sx={{ cursor: "pointer" }}
            />
            <Chip
              label={getFileName()}
              size="small"
              color={activeFile === "theme" ? "primary" : "default"}
              onClick={() => setActiveFile("theme")}
              sx={{ cursor: "pointer" }}
            />
            <Chip
              label="package.json"
              size="small"
              color={activeFile === "package" ? "primary" : "default"}
              onClick={() => setActiveFile("package")}
              sx={{ cursor: "pointer" }}
            />

            <IconButton
              onClick={() => handleCopy(getFileContent())}
              size="small"
              sx={{
                ml: "auto !important",
              }}
            >
              <ContentCopy fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2,
            mt: 0, // fix: remove annoying jittering
            position: "relative",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
          }}
        >
          <Box
            component={SyntaxHighlighter}
            language={getLanguage()}
            style={vscDarkPlus}
            showLineNumbers
            sx={{
              // bgcolor: (theme) =>
              //   theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
              px: 2.6,
              mx: 2,
              lineHeight: "1.5",
              fontSize: "caption.fontSize",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            {getFileContent()}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

