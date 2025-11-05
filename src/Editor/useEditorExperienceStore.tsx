import { combine } from "zustand/middleware";
import { create } from "zustand";
import { type EditorExperienceId } from "./editorExperience";

export const useEditorExperienceStore = create(
  combine(
    {
      selectedExperienceId: "primitives" as EditorExperienceId,
    },

    (set) => ({
      selectExperience: (experienceId: EditorExperienceId) => {
        set({ selectedExperienceId: experienceId });
      },
    })
  )
);
