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
import { useTemplates } from "./useTemplates";
import { useTemplateSelection } from "./useTemplateSelection";
import ColorSchemeToggle from "../../Current/ColorSchemeToggle";

interface TemplateMethodProps {
  onClose: () => void;
  launch: (templateId: string) => void;
}

export default function TemplateMethod({ launch }: TemplateMethodProps) {
  const { templates: allTemplates, getTemplateColors } = useTemplates();
  const selectedId = useTemplateSelection((s) => s.selectedId);
  const select = useTemplateSelection((s) => s.select);

  function selectRandom() {
    if (allTemplates.length === 0) return;
    const idx = Math.floor(Math.random() * allTemplates.length);
    const randomTemplate = allTemplates[idx];
    launch(randomTemplate.id);
  }

  const handleSelectTemplate = (templateId: string) => {
    select(templateId);
    launch(templateId);
  };

  const handleWithoutTemplate = () => {
    select('__blank__');
    launch('__blank__');
  };

  return (
    <>
      <Toolbar
        variant="dense"
        sx={{
          position: "sticky",
          top: "50px",
          zIndex: 1,
          mx: -3,
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
          selected={selectedId === '__blank__'}
        >
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            Create without a template
          </Typography>
          <KeyboardArrowRight color="action" fontSize="small" />
        </ListItemButton>

        {allTemplates.map((template) => {
          const isSelected = selectedId === template.id;
          const colorSamples = getTemplateColors(template.id);

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
    </>
  );
}
