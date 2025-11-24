import * as React from "react";
import TemplateOption from "./NewDesignOptions/TemplateOption";
import PasteOption from "./NewDesignOptions/PasteOption";
import LinkOption from "./NewDesignOptions/LinkOption";
import BlankOption from "./NewDesignOptions/BlankOption";
import { Box, Tabs, Tab } from "@mui/material";

type Mode = "template" | "paste" | "link" | "blank";

export default function NewDesignDialogContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [mode, setMode] = React.useState<Mode>("template");

  return (
    <Box
      sx={{
        position: "relative",
        maxHeight: "50vh",
        overflow: "auto",
        scrollbarWidth: "none",
        scrollbarColor: "rgba(0,0,0,0.5) transparent",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Tabs
          value={mode}
          onChange={(_, value) => setMode(value)}
          variant="fullWidth"
          aria-label="New design creation method"
          sx={{
            px: 2.6,
            pt: 1.6,
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          <Tab label="Template" value="template" sx={{ py: 2.4 }} />
          <Tab label="Paste" value="paste" sx={{ py: 2.4 }} />
          <Tab label="Blank" value="blank" sx={{ py: 2.4 }} />
        </Tabs>
      </Box>

      <Box role="region" sx={{ p: 2 }}>
        {mode === "template" && <TemplateOption onClose={onClose} />}
        {mode === "paste" && <PasteOption onClose={onClose} />}
        {mode === "link" && <LinkOption onClose={onClose} />}
        {mode === "blank" && <BlankOption onClose={onClose} />}
      </Box>
    </Box>
  );
}
