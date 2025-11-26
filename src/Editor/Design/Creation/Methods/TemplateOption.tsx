import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AdsClickOutlined,
  KeyboardArrowRight,
  ShuffleOutlined,
} from "@mui/icons-material";
import useTemplateSelection from "../useTemplateSelection";
import ColorSchemeToggle from "../../Edit/ColorSchemeToggle";

export default function TemplateOption({ onClose }: { onClose: () => void }) {
  const {
    templates: allTemplates,
    selectedTemplateId,
    selectBlank,
    pendingChange,
    selectTemplate,
    confirmSwitch,
    selectRandomTemplate,
    getColorSamples,
    clearPending,
  } = useTemplateSelection({ autoConfirm: false });

  function cancelChangeOperation() {
    clearPending();
    onClose();
  }

  function selectRandom() {
    selectRandomTemplate();
  }

  const handleSelectTemplate = (templateId: string) => {
    selectTemplate(templateId);
  };

  const handleWithoutTemplate = () => {
    selectBlank();
    onClose();
  };

  return (
    <>
      <Toolbar
        variant="dense"
        sx={{
          position: "sticky",
          top: "52px",
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
            borderRadius: 2,
            mb: 1,
            columnGap: 1,
            backgroundColor: "background.default",
          }}
          onClick={handleWithoutTemplate}
        >
          <ListItemText>Create without a template</ListItemText>
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

      <Dialog
        open={Boolean(pendingChange)}
        onClose={() => cancelChangeOperation()}
        sx={{ top: "-20%" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
            },
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">Wait! You've Unsaved Modifications</Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ maxWidth: "42ch", py: 1 }}
          >
            Switching templates will override your work unless you choose to keep
            them.
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack
            direction="row"
            spacing={3}
            sx={{ justifyContent: "center", mb: 1 }}
          >
            <Button color="warning" onClick={() => confirmSwitch(false)}>
              Discard Modifications
            </Button>

            <Button
              onClick={() => {
                confirmSwitch(true);
                cancelChangeOperation();
              }}
            >
              Keep them & Stay
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
