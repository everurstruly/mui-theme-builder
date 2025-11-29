import type { SavedSessionData } from "./types";

type RestoreHelpers = {
  addGlobalVisualEdit: (key: string, value: any) => void;
  applyModifications: (src: string) => void;
  setActiveColorScheme: (s: "light" | "dark") => void;
};

export function restoreSession(session: SavedSessionData, helpers: RestoreHelpers) {
  if (!session) return;

  const { addGlobalVisualEdit, applyModifications, setActiveColorScheme } = helpers;

  try {
    if (session.colorSchemeIndependentVisualToolEdits) {
      Object.entries(session.colorSchemeIndependentVisualToolEdits).forEach(([k, v]) => {
        try {
          addGlobalVisualEdit(k, v as any);
        } catch (e) {
          void e;
        }
      });
    }

    if (session.light?.visualToolEdits) {
      Object.entries(session.light.visualToolEdits).forEach(([k, v]) => {
        try {
          addGlobalVisualEdit(k, v as any);
        } catch (e) {
          void e;
        }
      });
    }

    if (session.dark?.visualToolEdits) {
      Object.entries(session.dark.visualToolEdits).forEach(([k, v]) => {
        try {
          addGlobalVisualEdit(k, v as any);
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
