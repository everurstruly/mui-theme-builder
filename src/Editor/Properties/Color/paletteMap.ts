import type { PaletteGroup } from "./Color";

// Centralized palette group map for clarity and to keep `Color.tsx` concise.
const paletteGroupMap: PaletteGroup[] = [
  {
    title: "Brand Colors",
    defaultOpen: true,
    items: [
      {
        name: "Primary",
        fill: "palette.primary.main",
        foreground: "palette.primary.contrastText",
        shades: [
          { name: "Main", path: "palette.primary.main" },
          { name: "Light", path: "palette.primary.light" },
          { name: "Dark", path: "palette.primary.dark" },
          { name: "Contrast Text", path: "palette.primary.contrastText" },
        ],
      },
      {
        name: "Secondary",
        fill: "palette.secondary.main",
        foreground: "palette.secondary.contrastText",
        shades: [
          { name: "Main", path: "palette.secondary.main" },
          { name: "Light", path: "palette.secondary.light" },
          { name: "Dark", path: "palette.secondary.dark" },
          { name: "Contrast Text", path: "palette.secondary.contrastText" },
        ],
      },
    ],
  },
  {
    title: "Text Colors",
    items: [
      { name: "Primary", fill: "palette.text.primary" },
      { name: "Secondary", fill: "palette.text.secondary" },
      { name: "Disabled", fill: "palette.text.disabled" },
    ],
  },
  {
    title: "Surface Colors",
    items: [
      { name: "Default", fill: "palette.background.default" },
      { name: "Paper", fill: "palette.background.paper" },
      { name: "Divider", fill: "palette.divider" },
    ],
  },
  {
    title: "Feedback Colors",
    defaultOpen: true,
    items: [
      {
        name: "Actions",
        fill: "palette.action.active",
        shades: [
          { name: "Active", path: "palette.action.active" },
          { name: "Hover", path: "palette.action.hover" },
          { name: "Selected", path: "palette.action.selected" },
          { name: "Disabled", path: "palette.action.disabled" },
          { name: "Disabled Background", path: "palette.action.disabledBackground" },
        ],
      },
      {
        name: "Error",
        fill: "palette.error.main",
        shades: [
          { name: "Main", path: "palette.error.main" },
          { name: "Light", path: "palette.error.light" },
          { name: "Dark", path: "palette.error.dark" },
        ],
      },
      {
        name: "Warning",
        fill: "palette.warning.main",
        shades: [
          { name: "Main", path: "palette.warning.main" },
          { name: "Light", path: "palette.warning.light" },
          { name: "Dark", path: "palette.warning.dark" },
        ],
      },
      {
        name: "Success",
        fill: "palette.success.main",
        shades: [
          { name: "Main", path: "palette.success.main" },
          { name: "Light", path: "palette.success.light" },
          { name: "Dark", path: "palette.success.dark" },
        ],
      },
      {
        name: "Info",
        fill: "palette.info.main",
        shades: [
          { name: "Main", path: "palette.info.main" },
          { name: "Light", path: "palette.info.light" },
          { name: "Dark", path: "palette.info.dark" },
        ],
      },
    ],
  },
  {
    title: "Neutral Colors",
    items: [
      { name: "Black", fill: "palette.common.black" },
      { name: "White", fill: "palette.common.white" },
      {
        name: "Grey",
        fill: "palette.grey.500",
        foreground: "palette.getContrastText(palette.grey.500)",
        shades: [
          { name: "50", path: "palette.grey.50" },
          { name: "100", path: "palette.grey.100" },
          { name: "200", path: "palette.grey.200" },
          { name: "300", path: "palette.grey.300" },
          { name: "400", path: "palette.grey.400" },
          { name: "500", path: "palette.grey.500" },
          { name: "600", path: "palette.grey.600" },
          { name: "700", path: "palette.grey.700" },
          { name: "800", path: "palette.grey.800" },
          { name: "900", path: "palette.grey.900" },
        ],
      },
    ],
  },
];

export default paletteGroupMap;
