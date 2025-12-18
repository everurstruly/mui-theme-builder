import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import FileSelectTab from "./FileSelectTab";
// import MergeWithDefaultsSwitch from "./MergeWithDefaultsSwitch";
import DownloadButton from "./DownloadButton";
import CopyButton from "./CopyButton";
import FileExtensionToggle from "./FileExtensionToggle";
import useExportOptions from "./useExportOptions";
import FileContent from "./FileContent";
import { Close, FolderCopyOutlined } from "@mui/icons-material";
import { Box, Stack, useMediaQuery } from "@mui/material";
import FileSelectBox from "./FileSelectBox";
import DialogHeading from "../../DialogHeading";

export default function ExportDialog() {
  const open = useExportOptions((s) => s.opened);
  const setOpen = useExportOptions((s) => s.setOpened);
  const requiresCompactView = useMediaQuery("(min-width:400px)");

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="export-context-dialog"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <DialogHeading title="Export Designed Theme" Icon={FolderCopyOutlined} />

        <IconButton
          size="small"
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ marginInlineStart: "auto" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            mb: 1,
          }}
        >
          {/* {requiresCompactView && <MergeWithDefaultsSwitch />} */}
          <FileExtensionToggle
            sx={{ m: "0 !important", marginInlineEnd: "auto !important" }}
          />

          <Box
            sx={{
              marginLeft: "auto !important",
              display: "inherit",
              alignItems: "inherit",
              flexGrow: !requiresCompactView ? 1 : 0,
              justifyContent: !requiresCompactView ? "flex-end" : "inherit",
              columnGap: 2,
            }}
          >

            <DownloadButton compactView={!requiresCompactView} />
            <CopyButton />
          </Box>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {requiresCompactView ? <FileSelectTab /> : <FileSelectBox />}
          {/* {requiresCompactView && <FileExtensionToggle />} */}
        </Box>

        <FileContent
          sx={{
            position: "relative",
            scrollbarWidth: "none",
            overflow: "auto",
            height: "60vh",
            border: 1,
            borderEndStartRadius: 4,
            borderEndEndRadius: 4,
            borderColor: (theme) => theme.palette.divider,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
