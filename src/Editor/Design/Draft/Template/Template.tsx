import ColorSchemeToggle from "../../Current/Modify/ColorSchemeToggle";
import { Box, Button, List, ListItemButton, Stack, Typography } from "@mui/material";
import { AdsClickOutlined, ShuffleOutlined } from "@mui/icons-material";
import { useTemplates } from "./useTemplates";
import { useTemplateSelection } from "./useTemplateSelection";

export default function TemplateMethod() {
  const templates = useTemplates((s) => s.templates);
  const selectedId = useTemplates((s) => s.selectedId);
  const { select, getTemplateColors, randomSelect } = useTemplateSelection();

  function handleRandom() {
    randomSelect();
  }

  const handleSelectTemplate = (templateId: string) => {
    select(templateId);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          columnGap: 2,
          my: 2,
        }}
      >
        <Button startIcon={<ShuffleOutlined />} onClick={handleRandom}>
          Random
        </Button>

        <ColorSchemeToggle />
      </Stack>

      <List component={Stack} sx={{ gap: 1 }}>
        {templates.map((template) => {
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
