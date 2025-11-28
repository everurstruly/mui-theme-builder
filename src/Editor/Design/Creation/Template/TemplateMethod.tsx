import {
  Box,
  Button,
  List,
  ListItemButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AdsClickOutlined,
  KeyboardArrowRight,
  ShuffleOutlined,
} from "@mui/icons-material";
import useTemplateMethod from "./useTemplateMethod";
import ColorSchemeToggle from "../../Edit/ColorSchemeToggle";
import CreationIntentConfirmationDialog from "../CreationIntentConfirmationDialog";

export default function TemplateMethod({ onClose }: { onClose: () => void }) {
  const {
    templates: allTemplates,
    selectedTemplateId,
    requestSelectBlank,
    requestSelectTemplate,
    selectRandomTemplate,
    getColorSamples,
    clearPending,
    dialogOpen,
    onDiscard,
    onKeep,
    onCancel,
  } = useTemplateMethod({ onClose, autoConfirm: false });

  function cancelChangeOperation() {
    // clear pending and keep the loader open (TemplatesLoader consumer decides)
    clearPending();
    onClose();
  }

  function selectRandom() {
    selectRandomTemplate();
  }

  const handleSelectTemplate = (templateId: string) => {
    requestSelectTemplate(templateId);
  };

  const handleWithoutTemplate = () => {
    requestSelectBlank();
    onClose();
  };

  return (
    <>
      <Toolbar
        variant="dense"
        sx={{
          position: "sticky",
          top: "50px",
          zIndex: 1,
          mx: -3, // FIXME: Sync with parent padding
          justifyContent: "space-between",
          columnGap: 1,
          borderRadius: 3,
          mb: 1,
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Button startIcon={<ShuffleOutlined />} onClick={selectRandom}>
          Random
        </Button>

        <ColorSchemeToggle />
      </Toolbar>

      <List component={Stack} sx={{ gap: 1 }}>
        <ListItemButton
          dense
          sx={{
            borderRadius: 3,
            mb: 1,
            columnGap: 1,
            paddingInline: 2,
            paddingBlock: 2,
            backgroundColor: "background.default",
          }}
          onClick={handleWithoutTemplate}
        >
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            Create without a template
          </Typography>
          <KeyboardArrowRight color="action" fontSize="small" />
        </ListItemButton>

        {allTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;
          const colorSamples = getColorSamples(template);

          return (
            <ListItemButton
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              selected={isSelected}
              sx={{
                paddingInline: 2,
                paddingBlock: 2,
                justifyContent: "space-between",
                borderRadius: 3,
                backgroundColor: "background.default",
              }}
            >
              <Stack
                direction="row-reverse"
                alignItems={"center"}
                spacing={0.5}
                sx={{ columnGap: 1 }}
              >
                <Typography variant="body2" textTransform={"capitalize"}>
                  {template.label}
                </Typography>

                <Stack direction="row" spacing={0.2} height={"14px"} pl={0.2}>
                  {colorSamples.map((backgroundColor, index) => {
                    return (
                      <Box
                        key={`${template.id}-${index}`}
                        sx={{
                          height: "100%",
                          aspectRatio: "1 / 1",
                          backgroundColor,
                          borderRadius: 1,
                          border: 1.5,
                          borderColor: "divider",
                        }}
                      />
                    );
                  })}
                </Stack>
              </Stack>

              <AdsClickOutlined
                fontSize="small"
                color={isSelected ? "primary" : "action"}
              />
            </ListItemButton>
          );
        })}
      </List>

      <CreationIntentConfirmationDialog
        open={Boolean(dialogOpen)}
        onDiscard={() => {
          // discard unsaved and proceed
          onDiscard();
        }}
        onKeep={() => {
          // keep unsaved modifications
          onKeep();
        }}
        onCancel={() => {
          onCancel();
          // also close the loader UI
          cancelChangeOperation();
        }}
      />
    </>
  );
}
