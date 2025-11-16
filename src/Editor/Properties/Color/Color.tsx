import List from "@mui/material/List";
import ColorOptionGroup from "./ColorOptionGroup";
import ColorOptionGroupItem from "./ColorOptionGroupItem";
import { useMemo } from "react";
import { useThemeDesignTheme } from "../../Design";
import type { Theme } from "@mui/material";

export default function ColorProperty() {
  const theme = useThemeDesignTheme();
  
  const paletteGroups = useMemo(() => {
    return extractPaletteGroups(theme.palette);
  }, [theme.palette]);

  return (
    <List
      sx={{
        position: "relative",
        padding: 0,
        "& ul": { padding: 0 },
      }}
    >
      {paletteGroups.map((group: PaletteGroup) => (
        <li key={group.title}>
          <ColorOptionGroup title={group.title}>
            {group.items.map((item: PaletteItem) => (
              <ColorOptionGroupItem
                key={item.path}
                title={item.name}
                path={item.path}
              />
            ))}
          </ColorOptionGroup>
        </li>
      ))}
    </List>
  );
}

type PaletteItem = {
  name: string;
  path: string;
};

type PaletteGroup = {
  title: string;
  items: PaletteItem[];
};

function extractPaletteGroups(palette: Theme['palette']): PaletteGroup[] {
  const groups: PaletteGroup[] = [];
  
  // Define the order and nice names for palette sections
  const sections = {
    primary: "Primary",
    secondary: "Secondary", 
    error: "Error",
    warning: "Warning",
    info: "Info",
    success: "Success",
    text: "Text Content",
    background: "Backgrounds",
    common: "Common",
  } as const;
  
  Object.entries(sections).forEach(([key, title]) => {
    const section = (palette as unknown as Record<string, unknown>)[key];
    if (!section) return;
    
    const items: PaletteItem[] = [];
    
    if (key === "grey") {
      // Handle grey scale numbers
      Object.entries(section as Record<string, unknown>).forEach(([shade, value]) => {
        if (typeof value === "string") {
          items.push({
            name: shade,
            path: `palette.grey.${shade}`,
          });
        }
      });
    } else if (typeof section === "string") {
      // Handle direct string values like divider
      items.push({
        name: key,
        path: `palette.${key}`,
      });
    } else if (typeof section === "object") {
      // Handle nested objects like primary, secondary, etc.
      Object.entries(section as Record<string, unknown>).forEach(([prop, value]) => {
        if (typeof value === "string") {
          items.push({
            name: prop,
            path: `palette.${key}.${prop}`,
          });
        }
      });
    }
    
    if (items.length > 0) {
      groups.push({ title, items });
    }
  });
  
  // Handle divider separately if it exists
  if (typeof palette.divider === "string") {
    groups.push({
      title: "Divider",
      items: [{
        name: "divider",
        path: "palette.divider",
      }]
    });
  }
  
  return groups;
}

