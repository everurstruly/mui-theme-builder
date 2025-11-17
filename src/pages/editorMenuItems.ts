export type EditorMenuItem = {
  key: string;
  label: string;
  href?: string;
  target?: string;
};

export const EDITOR_MENU_ITEMS: EditorMenuItem[] = [
  {
    key: "theme-editor",
    label: "Legacy (pre v6)",
    href: "https://zenoo.github.io/mui-theme-creator/",
    target: "__blank",
  },
  {
    key: "color-generator",
    label: "Color Generator",
    href: "https://m2.material.io/inline-tools/color/",
    target: "__blank",
  },
  {
    key: "theme-migration",
    label: "Theme Migration Tool",
  },
];
