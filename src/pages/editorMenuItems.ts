export type EditorMenuItem = {
  key: string;
  label: string;
  href?: string;
  target?: string;
};

export const EDITOR_MENU_ITEMS: EditorMenuItem[] = [
  {
    key: "legacy-theme-editor",
    label: "Legacy Version",
    href: "https://zenoo.github.io/mui-theme-creator/",
    target: "__blank",
  },
];
