import List from "@mui/material/List";
import ColorGroupList from "./ColorGroupList";
import ColorGroupListOption from "./ColorGroupListOption";
import palettes from "./palettes";
import ActionColors from "./ActionsColors";

export default function ColorProperty() {
  return (
    <List
      sx={{
        bgcolor: "background.paper",
        position: "relative",
        padding: 0,
        "& ul": { padding: 0 },
      }}
    >
      {palettes.map((palette) => (
        <li key={palette.title}>
          <ColorGroupList title={palette.title}>
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
      <ActionColors title="Actions States" />
    </List>
  );
}
