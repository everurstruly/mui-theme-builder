import List from "@mui/material/List";
import ColorGroup from "./ColorGroup";
import ColorGroupItem from "./ColorGroupItem";
import palettes from "./palettes";

export default function ColorProperty() {
  return (
    <List
      sx={{
        bgcolor: "background.paper",
        position: "relative",
        "& ul": { padding: 0 },
      }}
    >
      {palettes.map((palette) => (
        <ColorGroup key={palette.title} title={palette.title}>
          {palette.colors.map((color) => {
            return (
              <ColorGroupItem
                key={color.name}
                name={color.name}
                initValue={color.initValue}
                modifiedValue={color.modifiedValue}
              />
            );
          })}
        </ColorGroup>
      ))}
    </List>
  );
}
