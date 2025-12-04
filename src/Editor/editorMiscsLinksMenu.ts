export type EditorMenuItem = {
  key: string;
  label: string;
  href?: string;
  target?: string;
  action?: () => void;
};

export const editorMiscsLinksMenu: EditorMenuItem[] = [
  {
    key: "help",
    label: "Help",
  },
  {
    key: "human",
    label: "Human",
    href: "https://everurstruly.netlify.app",
    target: "__blank",
  },
  {
    key: "github-repo",
    label: "GitHub",
    href: "https://github.com/everurstruly/mui-theme-builder",
    target: "__blank",
  },
];
