import { List } from "@mui/material";
import FontList from "./FontList";
import FontListItem, { type FontListItemProps } from "./FontListItem";

export default function Font() {
  return (
    <List
      sx={{
        bgcolor: "background.paper",
        position: "relative",
        "& ul": { padding: 0 },
      }}
    >
      <li>
        <FontList title="Font Family">
          {fontFamily.map((setting) => {
            return <FontListItem key={setting.name} {...setting} />;
          })}
        </FontList>
      </li>
      <li>
        <FontList title="Font Weight">
          {fontWeight.map((setting) => {
            return <FontListItem key={setting.name} {...setting} />;
          })}
        </FontList>
      </li>
      <li>
        <FontList title="Font Style">
          {fontStyle.map((setting) => {
            return <FontListItem key={setting.name} {...setting} />;
          })}
        </FontList>
      </li>
    </List>
  );
}

const fontStyle: Array<FontListItemProps> = [
  {
    name: "lineHeight",
    initValue: "1.5",
    modifiedValue: "1.5",
  },
  {
    name: "letterSpacing",
    initValue: "auto",
    modifiedValue: "0",
  },
  {
    name: "wordSpacing",
    initValue: "0",
    modifiedValue: "0",
  },
];

const fontFamily: Array<FontListItemProps> = [
  {
    name: "sansSerif",
    initValue: "Roboto",
    modifiedValue: "Roboto",
  },
  {
    name: "serif",
    initValue: "Roboto Slab",
    modifiedValue: "Roboto Slab",
  },
  {
    name: "monospace",
    initValue: "Roboto Mono",
    modifiedValue: "Roboto Mono",
  },
];

const fontWeight: Array<FontListItemProps> = [
  {
    name: "light",
    initValue: "400",
    modifiedValue: "400",
  },
  {
    name: "normal",
    initValue: "400",
    modifiedValue: "400",
  },
  {
    name: "meidum",
    initValue: "600",
    modifiedValue: "600",
  },
  {
    name: "bold",
    initValue: "700",
    modifiedValue: "700",
  },
  {
    name: "bolder",
    initValue: "400",
    modifiedValue: "400",
  },
];
