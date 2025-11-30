import type { SavedSessionData } from "./types";

type RestoreHelpers = {
  addGlobalDesignerEdit: (key: string, value: any) => void;
  applyModifications: (src: string) => void;
  setActiveColorScheme: (s: "light" | "dark") => void;
};

export function restoreSession(session: SavedSessionData, helpers: RestoreHelpers) {
  if (!session) return;

  const { addGlobalDesignerEdit, applyModifications, setActiveColorScheme } = helpers;

  try {
    if (session.neutralEdits) {
      Object.entries(session.neutralEdits).forEach(([k, v]) => {
        try {
          addGlobalDesignerEdit(k, v as any);
        } catch (e) {
          void e;
        }
      });
    }

    if (session.light?.designer) {
      Object.entries(session.light.designer).forEach(([k, v]) => {
        try {
          addGlobalDesignerEdit(k, v as any);
        } catch (e) {
          void e;
        }
      });
    }

    if (session.dark?.designer) {
      Object.entries(session.dark.designer).forEach(([k, v]) => {
        try {
          addGlobalDesignerEdit(k, v as any);
        } catch (e) {
          void e;
        }
      });
    }

    // Restore color scheme first so code overrides are resolved against the
    // intended scheme when they are applied (placeholders like breakpoints/
    // palette tokens may resolve differently per-scheme).
    if (session.activeColorScheme) {
      try {
        setActiveColorScheme(session.activeColorScheme);
      } catch (e) {
        void e;
      }
    }

    if (session.codeOverridesSource) {
      try {
        applyModifications(session.codeOverridesSource);
      } catch (e) {
        void e;
      }
    }
  } catch (e) {
    void e;
  }
}
