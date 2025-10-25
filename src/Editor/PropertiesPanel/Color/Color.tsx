import List from "@mui/material/List";
import ColorGroupList from "./ColorGroupList";
import ColorGroupListOption from "./ColorGroupListOption";
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
        <li>
          <ColorGroupList key={palette.title} title={palette.title}>
            {palette.colors.map((color) => {
              return (
                <ColorGroupListOption
                  key={color.name}
                  name={color.name}
                  initValue={color.initValue}
                  modifiedValue={color.modifiedValue}
                />
              );
            })}
          </ColorGroupList>
        </li>
      ))}
    </List>
  );
}
