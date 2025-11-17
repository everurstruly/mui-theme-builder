import * as React from "react";
import { Box, Tabs, Tab, Divider } from "@mui/material";
import TemplateOption from "./NewDesignOptions/TemplateOption";
import PasteOption from "./NewDesignOptions/PasteOption";
import LinkOption from "./NewDesignOptions/LinkOption";
import BlankOption from "./NewDesignOptions/BlankOption";

type Mode = "template" | "paste" | "link" | "blank";

export default function NewDesignDialogContent({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = React.useState<Mode>("template");

  return (
    <Box sx={{ p: 1 }}>
      <Tabs
        value={mode}
        onChange={(_, value) => setMode(value)}
        variant="fullWidth"
        sx={{ mb: 1 }}
        aria-label="New design creation method"
      >
        <Tab label="Template" value="template" />
        <Tab label="Paste" value="paste" />
        <Tab label="From Link" value="link" />
        <Tab label="Blank" value="blank" />
      </Tabs>

      <Divider sx={{ mb: 1 }} />

      <Box role="region">
        {mode === "template" && <TemplateOption onClose={onClose} />}
        {mode === "paste" && <PasteOption onClose={onClose} />}
        {mode === "link" && <LinkOption onClose={onClose} />}
        {mode === "blank" && <BlankOption onClose={onClose} />}
      </Box>
    </Box>
  );
}
